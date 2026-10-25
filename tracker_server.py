"""
Farrux & Marjona Nikoh To'yi - Mehmonlar statistikasi va Admin paneli serveri
Port: 8097
Ma'lumotlar bazasi: stats.db (SQLite)
Zero dependencies (Standard library only: http.server, sqlite3, json)
"""

import http.server
import socketserver
import json
import sqlite3
import os
import re
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

        conn.execute("""
            CREATE TABLE IF NOT EXISTS rsvps (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guest_name TEXT,
                attendance TEXT,
                guests_count INTEGER DEFAULT 1,
                wishes TEXT,
                ip TEXT,
                created_at TEXT
            )
        """)
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

class StatsHandler(http.server.BaseHTTPRequestHandler):
    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
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

        # 1. Mehmon tashrifini yozib olish (Track Visit)
        if path.endswith("/api/track") or path.endswith("/api/visit"):
            data = self.read_json_body()
            ua = self.headers.get("User-Agent", data.get("user_agent", ""))
            device, browser = parse_device_browser(ua)
            
            action = data.get("action", "pageview")
            screen = data.get("screen", "")
            lang = data.get("lang", "uz")
            referrer = data.get("referrer", "")

            with get_db() as conn:
                conn.execute("""
                    INSERT INTO visits (ip, user_agent, device_type, browser, action, screen_res, language, referrer, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (ip, ua, device, browser, action, screen, lang, referrer, now_str))
                conn.commit()

            return self.respond_json(200, {"success": True, "action": action, "timestamp": now_str})

        # 2. RSVP (Mehmon ishtirokini tasdiqlash)
        elif path.endswith("/api/rsvp"):
            data = self.read_json_body()
            name = (data.get("name") or "").strip()
            attendance = data.get("attendance", "yes")
            guests_count = int(data.get("guests", 1))
            wishes = (data.get("wishes") or data.get("message") or "").strip()

            if not name:
                return self.respond_json(400, {"error": "Ism kiritilishi shart"})

            with get_db() as conn:
                conn.execute("""
                    INSERT INTO rsvps (guest_name, attendance, guests_count, wishes, ip, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (name, attendance, guests_count, wishes, ip, now_str))
                conn.commit()

            return self.respond_json(200, {"success": True, "message": "RSVP saqlandi!"})

        # 3. Statistikani tozalash (Faqat admin uchun)
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
            return self.respond_json(200, {"status": "ok", "app": "Taklifnoma Analytics API"})

        # 2. Ochiq qisqacha hisoblagich (Public Counter)
        elif path.endswith("/api/public-count"):
            with get_db() as conn:
                total = conn.execute("SELECT COUNT(*) FROM visits WHERE action='pageview'").fetchone()[0]
                unique = conn.execute("SELECT COUNT(DISTINCT ip) FROM visits WHERE action='pageview'").fetchone()[0]
            return self.respond_json(200, {"total_views": total, "unique_visitors": unique})

        # 3. To'liq Admin Statistikasi
        elif path.endswith("/api/stats"):
            pin = params.get("pin", [""])[0]
            if pin != ADMIN_PIN:
                return self.respond_json(403, {"error": "PIN kod talab qilinadi yoki noto'g'ri"})

            today_str = datetime.now(UZB_TZ).strftime("%Y-%m-%d")

            with get_db() as conn:
                # Jami sahifa ko'rishlar
                total_views = conn.execute("SELECT COUNT(*) FROM visits WHERE action='pageview'").fetchone()[0]
                
                # Jami barcha harakatlar
                total_actions = conn.execute("SELECT COUNT(*) FROM visits").fetchone()[0]

                # Unikal mehmonlar (IP bo'yicha)
                unique_visitors = conn.execute("SELECT COUNT(DISTINCT ip) FROM visits").fetchone()[0]

                # Bugungi tashriflar
                today_views = conn.execute("SELECT COUNT(*) FROM visits WHERE action='pageview' AND created_at LIKE ?", (f"{today_str}%",)).fetchone()[0]
                today_unique = conn.execute("SELECT COUNT(DISTINCT ip) FROM visits WHERE created_at LIKE ?", (f"{today_str}%",)).fetchone()[0]

                # Taklifnomani ochganlar (slide unlock)
                unlocked_count = conn.execute("SELECT COUNT(*) FROM visits WHERE action='unlock'").fetchone()[0]

                # Musiqani eshitganlar
                music_count = conn.execute("SELECT COUNT(*) FROM visits WHERE action='music_play'").fetchone()[0]

                # Qurilmalar bo'yicha taqsimot
                devices_rows = conn.execute("""
                    SELECT device_type, COUNT(*) as cnt 
                    FROM visits 
                    WHERE action='pageview'
                    GROUP BY device_type 
                    ORDER BY cnt DESC
                """).fetchall()
                devices = {row["device_type"]: row["cnt"] for row in devices_rows}

                # Brauzerlar bo'yicha taqsimot
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

                # RSVP javoblari
                rsvp_rows = conn.execute("""
                    SELECT id, guest_name, attendance, guests_count, wishes, created_at
                    FROM rsvps
                    ORDER BY id DESC
                """).fetchall()
                rsvps = [dict(row) for row in rsvp_rows]

                total_attending = sum(r["guests_count"] for r in rsvps if r["attendance"] == "yes")

            stats_data = {
                "server_time": datetime.now(UZB_TZ).strftime("%Y-%m-%d %H:%M:%S"),
                "summary": {
                    "total_views": total_views,
                    "total_actions": total_actions,
                    "unique_visitors": unique_visitors,
                    "today_views": today_views,
                    "today_unique": today_unique,
                    "unlocked_count": unlocked_count,
                    "music_count": music_count,
                    "total_rsvps": len(rsvps),
                    "total_attending_guests": total_attending
                },
                "devices": devices,
                "browsers": browsers,
                "recent_visits": recent_visits,
                "rsvps": rsvps
            }

            return self.respond_json(200, stats_data)

        else:
            return self.respond_json(404, {"error": "Not Found"})

if __name__ == "__main__":
    server_address = ("127.0.0.1", PORT)
    httpd = socketserver.TCPServer(server_address, StatsHandler)
    print(f"Taklifnoma Stats Tracker running on http://127.0.0.1:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping tracker...")
        httpd.server_close()
