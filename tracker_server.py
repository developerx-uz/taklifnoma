"""
Farrux & Marjona Nikoh To'yi - Mehmonlar statistikasi, Onlayn kuzatuvchilar, RSVP va Tilaklar API
Port: 8097
Ma'lumotlar bazasi: stats.db (SQLite)
Zero dependencies (Standard library only: http.server, sqlite3, json)
"""

import http.server
import socketserver
import json
import sqlite3
import os
from urllib.parse import urlparse, parse_qs
from datetime import datetime, timezone, timedelta

PORT = 8097
ADMIN_PIN = "2026"
DB_PATH = os.path.join(os.path.dirname(__file__), "stats.db")

# Toshkent vaqt zonasi (UTC+5)
UZB_TZ = timezone(timedelta(hours=5))

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        # Tashriflar jurnali
        conn.execute("""
            CREATE TABLE IF NOT EXISTS visits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip TEXT,
                user_agent TEXT,
                device_type TEXT,
                browser TEXT,
                action TEXT,
                screen_res TEXT,
                language TEXT,
                referrer TEXT,
                created_at TEXT
            )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_visits_ip ON visits(ip)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_visits_created ON visits(created_at)")

        # Ayni damda onlayn mehmonlar (Heartbeat)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS active_sessions (
                session_id TEXT PRIMARY KEY,
                ip TEXT,
                device_type TEXT,
                browser TEXT,
                last_seen TEXT
            )
        """)

        # RSVP — Ishtirokni tasdiqlash
        conn.execute("""
            CREATE TABLE IF NOT EXISTS rsvps (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guest_name TEXT NOT NULL,
                guest_side TEXT DEFAULT 'Kuyov tomondan',
                attendance TEXT DEFAULT 'Ha, albatta boraman!',
                guests_count INTEGER DEFAULT 1,
                wishes TEXT DEFAULT '',
                ip TEXT,
                created_at TEXT
            )
        """)

        # Mehmonlar Tilaklari
        conn.execute("""
            CREATE TABLE IF NOT EXISTS wishes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                author TEXT NOT NULL,
                text TEXT NOT NULL,
                ip TEXT,
                created_at TEXT
            )
        """)

        # Migration: Mavjud jadvalda guest_side ustuni bo'lmasa qo'shish
        try:
            conn.execute("ALTER TABLE rsvps ADD COLUMN guest_side TEXT DEFAULT 'Kuyov tomondan'")
        except Exception:
            pass

        conn.commit()

init_db()

def parse_device_browser(user_agent):
    ua = user_agent.lower()
    
    # Device
    if "iphone" in ua:
        device = "iPhone"
    elif "ipad" in ua:
        device = "iPad"
    elif "android" in ua:
        device = "Android"
    elif "macintosh" in ua or "mac os" in ua:
        device = "Mac"
    elif "windows" in ua:
        device = "Windows PC"
    elif "linux" in ua:
        device = "Linux"
    else:
        device = "Boshqa"

    # Browser / App
    if "telegram" in ua:
        browser = "Telegram WebApp"
    elif "instagram" in ua:
        browser = "Instagram"
    elif "edg" in ua:
        browser = "Microsoft Edge"
    elif "chrome" in ua or "crios" in ua:
        browser = "Chrome"
    elif "safari" in ua and "chrome" not in ua:
        browser = "Safari"
    elif "firefox" in ua or "fxios" in ua:
        browser = "Firefox"
    else:
        browser = "Brauzer"

    return device, browser

def clean_old_sessions():
    """60 soniyadan beri faol bo'lmagan sessiyalarni tozalash"""
    cutoff = (datetime.now(UZB_TZ) - timedelta(seconds=60)).strftime("%Y-%m-%d %H:%M:%S")
    with get_db() as conn:
        conn.execute("DELETE FROM active_sessions WHERE last_seen < ?", (cutoff,))
        conn.commit()

class StatsHandler(http.server.BaseHTTPRequestHandler):
    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def get_client_ip(self):
        xff = self.headers.get("X-Forwarded-For")
        if xff:
            return xff.split(",")[0].strip()
        x_real = self.headers.get("X-Real-IP")
        if x_real:
            return x_real.strip()
        return self.client_address[0]

    def read_json_body(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length > 0:
                raw_body = self.rfile.read(content_length).decode("utf-8")
                return json.loads(raw_body)
        except Exception:
            pass
        return {}

    def respond_json(self, status, data):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")
        ip = self.get_client_ip()
        now_str = datetime.now(UZB_TZ).strftime("%Y-%m-%d %H:%M:%S")

        # 1. Mehmon tashrifi va Jonli Onlayn Heartbeat (Track Visit & Heartbeat)
        if path.endswith("/api/track") or path.endswith("/api/visit"):
            data = self.read_json_body()
            ua = self.headers.get("User-Agent", data.get("user_agent", ""))
            device, browser = parse_device_browser(ua)
            
            action = data.get("action", "pageview")
            session_id = data.get("session_id", f"{ip}_{device}")
            screen = data.get("screen", "")
            lang = data.get("lang", "uz")
            referrer = data.get("referrer", "")

            with get_db() as conn:
                # Agar faqat heartbeat bo'lmasa, visits jadvaliga yozamiz
                if action != "heartbeat":
                    conn.execute("""
                        INSERT INTO visits (ip, user_agent, device_type, browser, action, screen_res, language, referrer, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (ip, ua, device, browser, action, screen, lang, referrer, now_str))

                # Onlayn faoliyatni yangilaymiz
                conn.execute("""
                    INSERT OR REPLACE INTO active_sessions (session_id, ip, device_type, browser, last_seen)
                    VALUES (?, ?, ?, ?, ?)
                """, (session_id, ip, device, browser, now_str))
                conn.commit()

            clean_old_sessions()
            with get_db() as conn:
                online_count = conn.execute("SELECT COUNT(DISTINCT ip) FROM active_sessions").fetchone()[0]

            return self.respond_json(200, {
                "success": True, 
                "action": action, 
                "online_count": max(1, online_count),
                "timestamp": now_str
            })

        # 2. RSVP — Ishtirokni to'liq hisoblash (Men boraman / Kelaman)
        elif path.endswith("/api/rsvp"):
            data = self.read_json_body()
            name = (data.get("name") or "").strip()
            side = data.get("side", "Kuyov tomondan")
            attendance = data.get("attendance", "Ha, albatta boraman!")
            
            # Agar "+ Mehmon bilan" bo'lsa, avtomatik 2 kishi deb hisoblaymiz
            guests_count = int(data.get("guests", 1))
            if "mehmon bilan" in attendance.lower():
                guests_count = max(2, guests_count)
            elif "kela olmayman" in attendance.lower():
                guests_count = 0

            wishes = (data.get("wishes") or data.get("message") or "").strip()

            if not name:
                return self.respond_json(400, {"error": "Ism kiritilishi shart"})

            with get_db() as conn:
                conn.execute("""
                    INSERT INTO rsvps (guest_name, guest_side, attendance, guests_count, wishes, ip, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (name, side, attendance, guests_count, wishes, ip, now_str))
                conn.commit()

            return self.respond_json(200, {
                "success": True, 
                "message": "Ishtirokingiz qabul qilindi! Rahmat!",
                "name": name,
                "attendance": attendance
            })

        # 3. Tilak qoldirish (Mehmonlar Kitobi)
        elif path.endswith("/api/wish"):
            data = self.read_json_body()
            author = (data.get("author") or data.get("name") or "").strip()
            text = (data.get("text") or data.get("wishes") or "").strip()

            if not author or not text:
                return self.respond_json(400, {"error": "Ism va tilak matni kiritilishi shart"})

            with get_db() as conn:
                cursor = conn.execute("""
                    INSERT INTO wishes (author, text, ip, created_at)
                    VALUES (?, ?, ?, ?)
                """, (author, text, ip, now_str))
                wish_id = cursor.lastrowid
                conn.commit()

            return self.respond_json(200, {
                "success": True, 
                "id": wish_id,
                "author": author,
                "text": text,
                "created_at": now_str
            })

        # 4. Statistikani tozalash (Admin PIN bilan)
        elif path.endswith("/api/reset"):
            params = parse_qs(parsed.query)
            pin = params.get("pin", [""])[0]
            if pin != ADMIN_PIN:
                return self.respond_json(403, {"error": "Noto'g'ri PIN kod"})

            with get_db() as conn:
                conn.execute("DELETE FROM visits")
                conn.commit()

            return self.respond_json(200, {"success": True, "message": "Statistika tozalandi"})

        else:
            return self.respond_json(404, {"error": "Not Found"})

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")
        params = parse_qs(parsed.query)

        # 1. Health check
        if path.endswith("/api/health"):
            return self.respond_json(200, {"status": "ok", "app": "Taklifnoma Analytics & RSVP API"})

        # 2. Hozirgi jonli onlayn kuzatuvchilar soni (Public Live Online Count)
        elif path.endswith("/api/online"):
            clean_old_sessions()
            with get_db() as conn:
                online = conn.execute("SELECT COUNT(DISTINCT ip) FROM active_sessions").fetchone()[0]
            return self.respond_json(200, {"online_visitors": max(1, online)})

        # 3. Barcha jamoat tilaklarini olish (Saytda ko'rsatish uchun)
        elif path.endswith("/api/wishes"):
            with get_db() as conn:
                rows = conn.execute("SELECT id, author, text, created_at FROM wishes ORDER BY id DESC LIMIT 50").fetchall()
                wishes = [dict(row) for row in rows]
            return self.respond_json(200, {"wishes": wishes})

        # 4. To'liq Admin Statistikasi va Ishtirok hisobi
        elif path.endswith("/api/stats"):
            pin = params.get("pin", [""])[0]
            if pin != ADMIN_PIN:
                return self.respond_json(403, {"error": "PIN kod talab qilinadi yoki noto'g'ri"})

            clean_old_sessions()
            today_str = datetime.now(UZB_TZ).strftime("%Y-%m-%d")

            with get_db() as conn:
                # Jonli onlayn
                online_visitors = conn.execute("SELECT COUNT(DISTINCT ip) FROM active_sessions").fetchone()[0]

                # Jami sahifa ko'rishlar
                total_views = conn.execute("SELECT COUNT(*) FROM visits WHERE action='pageview'").fetchone()[0]

                # Unikal mehmonlar (IP bo'yicha)
                unique_visitors = conn.execute("SELECT COUNT(DISTINCT ip) FROM visits WHERE action='pageview'").fetchone()[0]

                # Bugungi tashriflar
                today_views = conn.execute("SELECT COUNT(*) FROM visits WHERE action='pageview' AND created_at LIKE ?", (f"{today_str}%",)).fetchone()[0]
                today_unique = conn.execute("SELECT COUNT(DISTINCT ip) FROM visits WHERE created_at LIKE ?", (f"{today_str}%",)).fetchone()[0]

                # Taklifnomani ochganlar (slide unlock)
                unlocked_count = conn.execute("SELECT COUNT(*) FROM visits WHERE action='unlock'").fetchone()[0]

                # Musiqani tinglaganlar
                music_count = conn.execute("SELECT COUNT(*) FROM visits WHERE action='music_play'").fetchone()[0]

                # =============================================================
                # ISHTIROK (RSVP) TO'LIQ HISOBI
                # =============================================================
                rsvp_rows = conn.execute("""
                    SELECT id, guest_name, guest_side, attendance, guests_count, wishes, created_at
                    FROM rsvps
                    ORDER BY id DESC
                """).fetchall()
                rsvps = [dict(row) for row in rsvp_rows]

                # Boraman / Mehmon bilan / Borolmayman / Aniq emas hisoblari
                attending_yes = 0       # "Ha, albatta!"
                attending_plus = 0      # "+ Mehmon bilan"
                attending_no = 0        # "Kela olmayman"
                attending_maybe = 0     # "Aniq emas"
                total_attending_heads = 0 # Jami kelishi kutilayotgan odam soni

                side_counts = {"Kuyov tomondan": 0, "Kelin tomondan": 0, "Qadrdon do‘stlar": 0, "Hamkasblar / Boshqa": 0}

                for r in rsvps:
                    att = (r["attendance"] or "").lower()
                    side = r.get("guest_side", "Kuyov tomondan")
                    side_counts[side] = side_counts.get(side, 0) + 1

                    if "mehmon bilan" in att or "+ mehmon" in att:
                        attending_plus += 1
                        total_attending_heads += max(2, r.get("guests_count", 2))
                    elif "ha" in att or "boraman" in att or "albatta" in att:
                        attending_yes += 1
                        total_attending_heads += max(1, r.get("guests_count", 1))
                    elif "kela olmayman" in att or "borolmayman" in att or "afsus" in att:
                        attending_no += 1
                    else:
                        attending_maybe += 1

                # =============================================================
                # TILAKLAR RO'YXATI
                # =============================================================
                wish_rows = conn.execute("SELECT id, author, text, created_at FROM wishes ORDER BY id DESC").fetchall()
                wishes = [dict(row) for row in wish_rows]

                # Qurilmalar taqsimoti
                devices_rows = conn.execute("""
                    SELECT device_type, COUNT(*) as cnt 
                    FROM visits 
                    WHERE action='pageview'
                    GROUP BY device_type 
                    ORDER BY cnt DESC
                """).fetchall()
                devices = {row["device_type"]: row["cnt"] for row in devices_rows}

                # Brauzerlar taqsimoti
                browsers_rows = conn.execute("""
                    SELECT browser, COUNT(*) as cnt 
                    FROM visits 
                    WHERE action='pageview'
                    GROUP BY browser 
                    ORDER BY cnt DESC
                """).fetchall()
                browsers = {row["browser"]: row["cnt"] for row in browsers_rows}

                # Oxirgi 100 ta tashrif jurnali
                recent_rows = conn.execute("""
                    SELECT id, ip, device_type, browser, action, language, screen_res, referrer, created_at
                    FROM visits 
                    ORDER BY id DESC 
                    LIMIT 100
                """).fetchall()
                recent_visits = [dict(row) for row in recent_rows]

            stats_data = {
                "server_time": datetime.now(UZB_TZ).strftime("%Y-%m-%d %H:%M:%S"),
                "online_visitors": max(1, online_visitors),
                "summary": {
                    "total_views": total_views,
                    "unique_visitors": unique_visitors,
                    "today_views": today_views,
                    "today_unique": today_unique,
                    "unlocked_count": unlocked_count,
                    "music_count": music_count,
                    "total_rsvps": len(rsvps),
                    "total_wishes": len(wishes)
                },
                "attendance": {
                    "attending_yes": attending_yes,
                    "attending_plus": attending_plus,
                    "attending_no": attending_no,
                    "attending_maybe": attending_maybe,
                    "total_confirmed_guests": attending_yes + attending_plus,
                    "total_attending_heads": total_attending_heads,
                    "by_side": side_counts
                },
                "devices": devices,
                "browsers": browsers,
                "rsvps": rsvps,
                "wishes": wishes,
                "recent_visits": recent_visits
            }

            return self.respond_json(200, stats_data)

        else:
            return self.respond_json(404, {"error": "Not Found"})

    def do_DELETE(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")
        params = parse_qs(parsed.query)

        # Tilakni o'chirish (Admin PIN bilan)
        if path.endswith("/api/wish"):
            pin = params.get("pin", [""])[0]
            if pin != ADMIN_PIN:
                return self.respond_json(403, {"error": "Noto'g'ri PIN kod"})

            wish_id = params.get("id", [""])[0]
            if not wish_id:
                return self.respond_json(400, {"error": "Tilak ID ko'rsatilishi shart"})

            with get_db() as conn:
                conn.execute("DELETE FROM wishes WHERE id = ?", (wish_id,))
                conn.commit()

            return self.respond_json(200, {"success": True, "message": "Tilak o'chirildi"})

        # RSVP yozuvini o'chirish
        elif path.endswith("/api/rsvp"):
            pin = params.get("pin", [""])[0]
            if pin != ADMIN_PIN:
                return self.respond_json(403, {"error": "Noto'g'ri PIN kod"})

            rsvp_id = params.get("id", [""])[0]
            if not rsvp_id:
                return self.respond_json(400, {"error": "RSVP ID ko'rsatilishi shart"})

            with get_db() as conn:
                conn.execute("DELETE FROM rsvps WHERE id = ?", (rsvp_id,))
                conn.commit()

            return self.respond_json(200, {"success": True, "message": "RSVP o'chirildi"})

        else:
            return self.respond_json(404, {"error": "Not Found"})

if __name__ == "__main__":
    server_address = ("127.0.0.1", PORT)
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(server_address, StatsHandler)
    print(f"Taklifnoma Stats Tracker running on http://127.0.0.1:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping tracker...")
        httpd.server_close()
