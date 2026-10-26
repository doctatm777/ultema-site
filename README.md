# ultema.pro — сайт Артёма Рякина (ULTEMA)

Статический сайт: HTML / CSS / JS без фреймворков. Страницы собираются небольшим скриптом на Node из данных о проектах, результат лежит в репозитории и выкладывается как есть (GitHub Pages, `CNAME` = ultema.pro).

```
index.html                 главная: шоурил → работы → обо мне → контакты (собирается)
work/<slug>/index.html     страница каждого ролика, Sky Race с полным разбором (собирается)
404.html, sitemap.xml      тоже собираются
tools/works.mjs            данные проектов: названия, описания EN/RU, форматы, ролики
tools/sky-race.mjs         тексты разбора Sky Race (с Behance)
tools/build.mjs            сборка страниц + CONFIG (почта, Telegram, Instagram, Behance)
assets/css/site.css        все стили
assets/js/site.js          язык, шоурил, полёт логотипа, стена работ, видео по наведению
assets/fonts/              Unbounded и Onest (латиница + кириллица, self-hosted)
assets/media/              шоурил, ролики, превью для наведения, кадры, материалы Sky Race
PRODUCT.md                 продукт и решения владельца (контекст для Impeccable)
.impeccable/surfaces/      бриф и контракт визуального направления
```

## Изменить контакты или тексты

1. Почта, Telegram, Instagram, Behance — объект `CONFIG` в начале `tools/build.mjs`. Список контактов в блоке «Контакты» собирается из `contacts` рядом с `CONFIG`.
2. Описания роликов, клиенты, годы — `tools/works.mjs` (порядок на стене — `wallOrder` в `tools/build.mjs`).
3. Пересобрать страницы:

```bash
node tools/build.mjs
```

## Посмотреть локально

```bash
node .claude/serve.mjs . 8080
```

и открыть http://localhost:8080 (сервер умеет перемотку видео).

## Медиа

Исходники лежат в `F:/UNREAL_ENGINE/PORTFOLIO`. В сайт идут только перекодированные H.264-версии: ролики в `assets/media/work`, 5-секундные петли для наведения в `assets/media/hover`, кадры для страниц в `assets/media/stills`, разбор Sky Race в `assets/media/sky-race`. Шоурил (`assets/media/reel-16x9.mp4` и вертикальный `reel-9x16.mp4`) собран из роликов портфолио и будет заменён собственным монтажом Артёма.
