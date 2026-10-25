# مزایده‌گاه

وب‌سایت مزایده آنلاین؛ پروژه‌ی درس طراحی واسط کاربری.

کاربر می‌تواند مزایده‌ها را ببیند، جستجو و فیلتر کند، در مزایده‌ی فعال پیشنهاد ثبت کند، مزایده‌ها را به علاقه‌مندی‌ها اضافه کند، اعلان‌ها را ببیند و با پشتیبانی تیکت رد و بدل کند.

## وضعیت پروژه

| بخش                            | وضعیت                   |
| ------------------------------ | ----------------------- |
| طراحی رابط (Figma)             | انجام شد (نسخه‌ی اولیه) |
| فرانت‌اند (React و TypeScript) | در حال توسعه            |
| بک‌اند (Express و SQLite)      | شروع نشده               |

> **توجه:** فعلاً همه‌ی داده‌ها (مزایده‌ها، پیشنهادها) ثابت هستند و فقط داخل مرورگر کار می‌کنند. ورود و ثبت‌نام، اعلان‌ها و تیکت‌ها شبیه‌سازی شده‌اند و در `localStorage` ذخیره می‌شوند. **پاسخ پشتیبانی خودکار و نمونه است** و توسط انسان نوشته نمی‌شود. با آمدن بک‌اند، همه‌ی این‌ها واقعی می‌شوند.

## قابلیت‌ها

- لیست مزایده‌ها با تایمر معکوس زنده (قرمز شدن در ۵ دقیقه‌ی آخر)
- صفحه‌ی «مزایده‌های فعال» با فیلتر (به‌زودی تموم می‌شه، رقابتی، بازه قیمت) و مرتب‌سازی جدا
- سایدبار برای جابه‌جایی بین بخش‌ها و دسته‌بندی‌ها
- جستجو با امکان انتخاب دسته‌بندی
- صفحه‌ی جزئیات مزایده با تاریخچه‌ی پیشنهادها
- فرم ثبت پیشنهاد با اعتبارسنجی و مرحله‌ی تأیید (فقط برای کاربر واردشده)
- صفحه‌ی «پیشنهادهای من» با تب‌های وضعیت (در صدر، پیشی گرفته شده، برنده شدم)
- علاقه‌مندی‌ها (قلب روی کارت و صفحه‌ی جزئیات)
- اعلان‌ها: زنگوله با نشان خوانده‌نشده و صفحه‌ی کامل اعلان‌ها
- پشتیبانی: ثبت تیکت با دسته‌بندی و پیوست عکس، گفتگو و بستن تیکت
- ورود و ثبت‌نام با اعتبارسنجی فرم
- تم تاریک و روشن
- راست‌چین و فارسی (فونت وزیرمتن)
- واکنش‌گرا (موبایل و دسکتاپ)

## فناوری‌ها

- React و TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React (آیکون‌ها)

## طراحی

طرح اولیه‌ی صفحه‌ها در Figma:
<https://www.figma.com/design/b5f79Ar10WswX0GvVyhrvD>

نکته: طرح Figma پیش از کدنویسی انجام شده و در بعضی جزئیات با نسخه‌ی نهایی فرق دارد.

## اجرای پروژه

نیازمند Node.js است.

```bash
git clone https://github.com/Sajjad-008/auction-shop.git
cd auction-shop/client
npm install
npm run dev
```

سپس آدرس `http://localhost:5173` را باز کنید.

### دستورهای دیگر

| دستور               | کار                        |
| ------------------- | -------------------------- |
| `npm run dev`       | اجرای سرور توسعه           |
| `npm run typecheck` | بررسی نوع‌ها (TypeScript)  |
| `npm run build`     | ساخت نسخه‌ی نهایی          |
| `npm run preview`   | پیش‌نمایش نسخه‌ی ساخته‌شده |

## ساختار پوشه‌ها

```
auction-shop/
├── README.md
└── client/
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── tsconfig.app.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    ├── public/
    │   ├── favicon.svg
    │   └── images/               عکس مزایده‌ها
    ├── scripts/
    │   └── resize-images.mjs     کم‌حجم کردن عکس‌ها
    └── src/
        ├── main.tsx              نقطه‌ی شروع
        ├── App.tsx               مسیرها و وضعیت کلی برنامه
        ├── index.css             رنگ‌های تم و Tailwind
        ├── types.ts              تعریف نوع‌های داده
        ├── components/
        │   ├── AuctionCard.tsx
        │   ├── AuctionImage.tsx
        │   ├── AuthShell.tsx
        │   ├── BidForm.tsx
        │   ├── BidHistory.tsx
        │   ├── CountdownTimer.tsx
        │   ├── Dropdown.tsx
        │   ├── FavoriteButton.tsx
        │   ├── FormField.tsx
        │   ├── ImagePicker.tsx
        │   ├── Layout.tsx
        │   ├── Navbar.tsx
        │   ├── NotificationBell.tsx
        │   ├── NotificationItem.tsx
        │   ├── SearchBox.tsx
        │   ├── Sidebar.tsx
        │   ├── StatusBadge.tsx
        │   └── TicketStatusBadge.tsx
        ├── pages/
        │   ├── Home.tsx
        │   ├── ActiveAuctions.tsx
        │   ├── AuctionDetail.tsx
        │   ├── MyBids.tsx
        │   ├── Favorites.tsx
        │   ├── Notifications.tsx
        │   ├── SearchResults.tsx
        │   ├── Support.tsx
        │   ├── NewTicket.tsx
        │   ├── TicketChat.tsx
        │   ├── Login.tsx
        │   └── Signup.tsx
        ├── data/                 داده‌ی آزمایشی
        │   ├── auctions.ts
        │   ├── categories.ts
        │   ├── notifications.ts
        │   └── ticketCategories.ts
        ├── hooks/
        │   ├── useAppContext.ts
        │   └── useTheme.ts
        └── utils/
            ├── auction.ts
            ├── notificationTypes.ts
            ├── search.ts
            ├── ticket.ts
            └── validation.ts
```

## روش کار با گیت

- `main`: نسخه‌ی پایدار
- `dev`: ادغام کارهای در حال توسعه
- `feature/...`، `fix/...`، `chore/...`: شاخه‌ی هر کار، که با Pull Request به `dev` برمی‌گردد

## مراحل بعدی

- [x] صفحه‌ی مزایده‌ها، جزئیات و پیشنهادهای من
- [x] ورود و ثبت‌نام (شبیه‌سازی‌شده)
- [x] علاقه‌مندی‌ها، جستجو، اعلان‌ها و پشتیبانی
- [x] تبدیل پروژه به TypeScript
- [ ] صفحه‌ی اصلی برای مهمان (سؤالات متداول، آمار، بخش اعتماد)
- [ ] پنل جدای خریدار و فروشنده
- [ ] بک‌اند با Express و SQLite
- [ ] ورود و ثبت‌نام واقعی
- [ ] به‌روزرسانی لحظه‌ای قیمت‌ها
- [ ] اسکرین‌شات‌ها در این فایل

## توسعه‌دهنده

**Sajjad-008**

<https://github.com/Sajjad-008>
