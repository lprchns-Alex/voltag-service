# Voltag Service — homepage

Static Russian-language homepage for automotive air-conditioning service.

## Preview

Open `index.html` or serve this folder:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

No build step or external package dependencies. CSS, JavaScript, images and Inter font are local.

## Features

- Responsive layout, service accordion and symptom selector.
- Refrigerant cost calculator and eight workshop locations.
- Customer review excerpts with links to their source.
- Booking form prototype.

The booking form is a demo: it does not send or store submissions. A backend integration is required to receive enquiries. Workshop selection is saved in browser local storage. Yandex Maps requires an internet connection.

## Assets and sources

Service and equipment images are generated promotional illustrations. They are not photographs of the workshops. Inter license: `assets/inter-OFL.txt`. Workshop sources: `map-sources.json`. Review sources: `review-sources.json`.

This snapshot contains the latest revised homepage. Earlier design versions are maintained separately.

Плавная прокрутка: локальная копия Lenis 1.3.17 (MIT), лицензия в `assets/vendor/lenis-LICENSE.txt`. Системная настройка уменьшения движения отключает инерцию и точку курсора.

Галерея под калькулятором: четыре сгенерированных промоизображения (`assets/gallery/`), встроенный image_gen; полные промпты в `gallery-prompts.json`. Лента движется со скоростью 25 px/с, останавливается при наведении, фокусе и системном уменьшении движения. Доступны пауза и стрелки. Ручная прокрутка карточек колесом, тачпадом и свайпом отключена; вертикальная прокрутка страницы сохранена.
