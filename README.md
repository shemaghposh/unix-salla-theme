# ثيم يونكس على سلة (UNIX Salla Theme)

ثيم Twilight مخصص لمتجر **UNIX** (unix.sa). الهدف إنه يبقى نسخة من ثيم شوبيفاي الحالي بنفس الشكل بالظبط.
مبني على ثيم «رائد» الرسمي من سلة (شوف `NOTICE.md`).

## المرجع
- `docs/DESIGN-SYSTEM.md`: **نظام التصميم**، وهو المرجع الملزم لأي قيمة.
- `docs/ROADMAP.md`: **خريطة الطريق**: المراحل والحالة وشروط القبول.
- `.claude/agents/`: الـ agents اللي بيبنوا الثيم ويراجعوه.
- `docs/SPEC.md`: مواصفات ثيم شوبيفاي كاملة (الألوان والخطوط والأقسام بالترتيب وصفحة المنتج والمميزات المخصصة).
- `src/assets/styles/01-settings/unix-tokens.scss`: متغيرات هوية يونكس (الألوان والحواف والخطوط والأزرار).

## التشغيل المحلي
المطلوب Node 22 و pnpm و Salla CLI (`npm install -g @salla.sa/cli`).

```bash
pnpm install
salla login
salla theme preview   # معاينة على المتجر التجريبي
pnpm prod             # build للإنتاج
```

## إعدادات لازم تتظبط في لوحة سلة
- **اللون الأساسي:** `#373542`.
- **خط Somar Bold للعناوين:** حط الملف المرخّص في `src/assets/fonts/Somar-Bold.woff2`. لو مش موجود، العناوين هتستخدم IBM Plex Sans Arabic.

## خطة الشغل
شوف `docs/ROADMAP.md`.
