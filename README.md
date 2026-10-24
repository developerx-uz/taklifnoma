# 💍 Farrux & Marjona - Nikoh To'yi Veb-Taklifnomasi

Ushbu loyiha zamonaviy mobil (Telegram WebApp / Instagram Story) va to'liq kompyuter (Desktop) formatidagi shohona nikoh to'yi taklifnomasi hisoblanadi.

🌐 **Jonli Sayt (Live Demo):** [https://developerx-uz.github.io/taklifnoma/](https://developerx-uz.github.io/taklifnoma/)  
📦 **GitHub Repozitoriy:** [https://github.com/developerx-uz/taklifnoma](https://github.com/developerx-uz/taklifnoma)

---

## 📋 To'y Ma'lumotlari:
- **Kelin va Kuyov:** Farrux & Marjona
- **Sana:** 2026-yil 30-oktyabr (30.10.2026)
- **Boshlanish vaqti:** 18:00
- **To'yxona:** Sohil Tantanalar Saroyi (Yangiyo'l tumani)
- **Xarita havolasi:** [Google Maps](https://maps.app.goo.gl/UYrrhsPyq9Dfcx1h8)

---

## ✨ Imkoniyatlar va Funksiyalar:
1. **To'liq Moslashuvchan Dizayn (Responsive):**
   - **Smartfon / Telegram WebApp:** O'ta ixcham, shinam, Instagram Story / WebApp formatidagi to'liq ekranli mobil ko'rinish.
   - **Kompyuter / Noutbuk:** Katta ekranga mos shohona keng format, tepada maxsus navigatsiya menyusi (*F & M* monogrammasi bilan), 2 ustunli kartochkalar va 4 ustunli vaqt chizig'i.
2. **Ko'p Tilli (Multilingual):** O'zbekcha (UZ), Ruscha (RU), Inglizcha (EN) — bitta tugma orqali butun sahifa matnlari jonli o'zgaradi.
3. **Fon Musiqasi:**
   - O'ng pastdagi tilla rangli aylanuvchi gramplastinka pleyeri.
   - `assets/audio/music.mp3` fayli mavjud bo'lsa uni o'ynatadi.
   - Hozircha esa **Web Audio API** orqali mayin romantik to'y arpedjiosi avtomatik yangraydi.
4. **Jonli Ortga Hisoblash (Countdown):** 2026-yil 30-oktyabr soat 18:00 gacha qolgan kun, soat, daqiqa va soniyalarni hisoblab boradi.
5. **Google Taqvimga Qo'shish:** Mehmonlar birgina tugma orqali to'y kunini o'z Google Kalendariga belgilab qo'yishi mumkin.
6. **Kun Tartibi:** 18:00, 19:00, 20:00, 23:00 vaqtlari nafis tilla vaqt chizig'ida.
7. **Xotira Galereyasi:** Suratlarni bosganda to'liq ekranda ko'rish (Lightbox).
8. **To'yxona va Joylashuv:** Sohil saroyining interer va fasad suratlari, Google xarita va manzilni nusxalash.
9. **R.S.V.P. Formasi:** Mehmonlar ismini kiritib, ishtirokini tasdiqlashi mumkin. Yuborilganda bayramona oltin va ko'k konfetti otiladi va natija mahalliy xotirada saqlanadi.
10. **Mehmonlar Kitobi:** Mehmonlar kelin-kuyovga samimiy tilaklarini yozib qoldirishi mumkin.

---

## 🛠️ Foydalanish va O'zgartirish Qo'llanmasi

### 1. Rasmlarni almashtirish:
Barcha suratlar `assets/images/` papkasida joylashgan:
- `floral_frame.jpg` — Atirgulli naqshinkor fon ramkasi
- `couple_biz.jpg` — Kelin-kuyov surati ("Biz" bo'limi)
- `sohil_hall.jpg` — To'yxona ichki zali
- `sohil_exterior.jpg` — To'yxona tashqi ko'rinishi
- `gallery_1.jpg`, `gallery_2.jpg`, `gallery_3.jpg`, `gallery_4.jpg` — Galereya suratlari

> Yangi suratlarni xuddi shu nomlar bilan almashtirsangiz kifoya, kodga teginish shart emas!

### 2. O'zingiz tanlagan musiqani qo'yish:
Kelin-kuyov tanlagan qo'shiqni (mp3 formatida) `assets/audio/` papkasiga tashlab, nomini **`music.mp3`** deb nomlang. Sayt avtomatik ravishda shu musiqani o'ynatishni boshlaydi.

### 3. Matnlarni yoki manzilni tahrirlash:
- Asosiy HTML matnlari `index.html` faylida.
- Ko'p tilli tarjimalar (UZ, RU, EN) `script.js` faylining eng boshidagi `translations` ob'ektida joylashgan.

### 4. O'zgarishlarni GitHub'ga yuklash:
Kodingizga o'zgartirish kiritganingizdan so'ng, terminalda quyidagi buyruqlarni ketma-ket bajaring:
```bash
git add .
git commit -m "Yangilanishlar kiritildi"
git push origin main
```
1-2 daqiqadan so'ng jonli havola ([https://developerx-uz.github.io/taklifnoma/](https://developerx-uz.github.io/taklifnoma/)) avtomatik yangilanadi.

---

## 📲 Telegram WebApp sifatida ulashish:
Ushbu taklifnomani Telegram bot orqali ochish uchun botingizdagi `InlineKeyboardButton` da:
```json
{
  "text": "💍 To'y Taklifnomasi",
  "web_app": {
    "url": "https://developerx-uz.github.io/taklifnoma/"
  }
}
```
yoki to'g'ridan-to'g'ri havolani Telegram orqali yuborishingiz mumkin.
