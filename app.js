'use strict';
const locations = [
 {name:'Митино',address:'1-й Митинский переулок, 25',city:'Москва',phone:'+7 (495) 120-40-72',coordinates:[37.38948, 55.852021],color:'#9654a0'},
 {name:'Коптево',address:'ул. Клары Цеткин, 24',city:'Москва',phone:'+7 (495) 120-40-39',coordinates:[37.513556499999986, 55.829082068926596],color:'#cb5161'},
 {name:'Нагатинская',address:'1-й Нагатинский проезд, 15, 18-й таксопарк',city:'Москва',phone:'+7 (495) 120-40-29',coordinates:[37.631361, 55.675646],color:'#91989e'},
 {name:'Чертановская',address:'ул. Котляковская, 4с27',city:'Москва',phone:'+7 (495) 723-08-73',coordinates:[37.635014, 55.640883],color:'#91989e'},
 {name:'Домодедовская',address:'Каширское шоссе, 61, корп. 3А, АТЦ «Москва»',city:'Москва',phone:'+7 (495) 120-40-63',coordinates:[37.716369899475104, 55.61556349692569],color:'#64a365'},
 {name:'Аннино',address:'МКАД, 32-й км, внешняя сторона, «ТРАКТ»',city:'Москва',phone:'+7 (495) 120-40-57',coordinates:[37.61768128042604, 55.57334191513158],color:'#91989e'},
 {name:'Щёлковская',address:'ул. Иркутская, 5/6, стр. 3',city:'Москва',phone:'+7 (495) 120-40-79',coordinates:[37.782988499999966, 55.816343276946405],color:'#4c86c5'},
 {name:'Химки',address:'Новокуркинское шоссе, 39',city:'Химки',phone:'+7 (495) 120-40-89',coordinates:[37.38993, 55.901218],color:'#55778e'}
];
const $ = q => document.querySelector(q);
const digits = text => text.replace(/\D/g,'');
const format = n => new Intl.NumberFormat('ru-RU').format(n);
const stored = key => {try {return localStorage.getItem(key)} catch{return null}};
const remember = (key,value) => {try{localStorage.setItem(key,value)}catch{}};
let selected = Math.max(0, Math.min(7, Number(stored('voltag-location')) || 0));
const routeFor = l => l.coordinates ? `https://yandex.ru/maps/?rtext=~${l.coordinates[1]},${l.coordinates[0]}&rtt=auto` : `https://yandex.ru/maps/?text=${encodeURIComponent(l.city+' '+l.address)}`;
function renderLocations() {
 const cards = locations.map((l,i)=>`<article class="location-card ${i===selected?'active':''}" data-location="${i}"><div class="location-head"><button class="location-select" type="button" aria-label="Показать на карте: ${l.name}" aria-pressed="${i===selected}" data-select="${i}">${l.name}</button><button class="location-book" type="button" data-book-location="${i}">Записаться</button></div><p class="location-address">${l.address}</p><div class="location-bottom"><a href="tel:+${digits(l.phone)}">${l.phone}</a><a class="location-route" href="${routeFor(l)}" target="_blank" rel="noopener">Маршрут</a></div></article>`);
 $('#locations-left').innerHTML=cards.slice(0,4).join('');
 $('#locations-right').innerHTML=cards.slice(4).join('');
}
function selectLocation(i,updateMap=true) {
 selected=i;remember('voltag-location',String(i));
 const l=locations[i];
 $('#booking-location').value=String(i);
 $('#map-location').textContent=l.name;
 $('#map-address').textContent=l.address;
 const q=encodeURIComponent(l.city+' '+l.address);
 if(updateMap && l.coordinates) {
  const point=l.coordinates.join(',');
  $('#service-map').src=`https://yandex.ru/map-widget/v1/?ll=${point}&z=15&pt=${point},pm2blm`;
 }
 $('#route-link').href=routeFor(l);
 $('#reviews-link').href=`https://yandex.ru/maps/?text=${encodeURIComponent('Вольтаж Сервис '+l.city+' '+l.address)}`;
 $('#reviews-link').textContent=`Отзывы: ${l.name}`;
 document.querySelectorAll('[data-location]').forEach(card=>{
  const active=Number(card.dataset.location)===selected;
  card.classList.toggle('active',active);
  card.querySelector('[data-select]').setAttribute('aria-pressed',String(active));
 });
}
$('#booking-location').innerHTML=locations.map((l,i)=>`<option value="${i}">${l.name} — ${l.address}</option>`).join('');
renderLocations();selectLocation(selected);
$('#booking-location').addEventListener('change',e=>{selectLocation(Number(e.target.value));$('#form-result').hidden=true});
$('#location-list').addEventListener('click',e=>{
 const book=e.target.closest('[data-book-location]');
 if(book){selectLocation(Number(book.dataset.bookLocation));scrollBooking();return}
 if(e.target.closest('a'))return;
 const card=e.target.closest('[data-location]');
 if(card)selectLocation(Number(card.dataset.location));
});
function updatePrice(){const amount=Number($('#amount').value);$('#weight').innerHTML=`${format(amount)} <small>г</small>`;$('#gas-price').textContent=format(amount*5)+' ₽';$('#total-price').innerHTML=`${format(2000+amount*5)} <small>₽</small>`;$('#amount').setAttribute('aria-valuetext',amount+' грамм, предварительно '+(2000+amount*5)+' рублей')}
$('#amount').addEventListener('input',updatePrice);updatePrice();
const symptomContent=[
 ['Заправка нужна не всегда.','Если воздух стал теплее, важно проверить систему и определить причину. Одного добавления хладагента может быть недостаточно.','Проверим работу системы и согласуем следующий шаг.'],
 ['Начнём с причины отказа.','Когда кондиционер не включается, нужно проверить систему, а не выбирать ремонт по одному симптому. Мастер определит, что мешает её работе.','Проведём диагностику перед заправкой или ремонтом.'],
 ['Сначала найдём, куда уходит хладагент.','Если после заправки прохлада быстро пропала, повторная заправка может не решить проблему. Обсудите проверку герметичности и поиск утечки.','Поиск места утечки — отдельная услуга по согласованию.'],
 ['Определим источник шума.','Посторонний звук требует проверки компрессора и связанных узлов. По итогам диагностики объясним, какие работы необходимы.','Стоимость и объём ремонта — после проверки.'],
 ['Проверим, что вызывает запах.','Заправка не решает все вопросы с запахом в салоне. Расскажите мастеру, когда он появляется, чтобы согласовать проверку и нужное обслуживание.','Возможность очистки уточните в выбранном сервисе.']
];
function selectSymptom(i,focus=false){document.querySelectorAll('[data-symptom]').forEach((b,j)=>{b.classList.toggle('active',j===i);b.setAttribute('aria-selected',j===i?'true':'false');b.tabIndex=j===i?0:-1;if(j===i&&focus)b.focus()});$('#symptom-title').textContent=symptomContent[i][0];$('#symptom-text').textContent=symptomContent[i][1];$('#symptom-next').textContent=symptomContent[i][2];$('#symptom-panel').setAttribute('aria-labelledby','symptom-tab-'+i);updateSymptomVisual(i)}
document.querySelectorAll('[data-symptom]').forEach(b=>{b.addEventListener('click',()=>selectSymptom(Number(b.dataset.symptom)));b.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();const i=Number(b.dataset.symptom);selectSymptom(e.key==='Home'?0:e.key==='End'?4:(i+((e.key==='ArrowRight'||e.key==='ArrowDown')?1:4))%5,true)})});
function scrollBooking(service){if(service)$('#booking-comment').value=service;$('#booking').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});$('#form-result').hidden=true;$('#booking-location').focus({preventScroll:true})}
document.querySelectorAll('[data-book]').forEach(b=>b.addEventListener('click',()=>scrollBooking(b.dataset.service)));
$('.menu-toggle').addEventListener('click',()=>{const open=$('.menu-toggle').getAttribute('aria-expanded')==='true';$('.menu-toggle').setAttribute('aria-expanded',String(!open));$('.menu-toggle').setAttribute('aria-label',open?'Открыть меню':'Закрыть меню');$('.mobile-nav').hidden=open});
$('.mobile-nav').addEventListener('click',e=>{if(e.target.closest('a')){$('.mobile-nav').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').setAttribute('aria-label','Открыть меню')}});
$('#booking-phone').addEventListener('input',e=>{e.target.setCustomValidity('');$('#form-result').hidden=true});
$('#booking-form').addEventListener('submit',e=>{e.preventDefault();const phone=$('#booking-phone');const num=digits(phone.value);if(num.length<10||num.length>15){phone.setCustomValidity('Укажите телефон: от 10 до 15 цифр.');phone.reportValidity();return}const l=locations[Number($('#booking-location').value)];$('#form-result').innerHTML=`<strong>Для подтверждения записи позвоните в ${l.name==='Химки'?'сервис в Химках':'мастерскую «'+l.name+'»'}.</strong><br>В этой демонстрационной версии форма не отправляет данные в сервис. Телефон и комментарий не сохраняются.<a href="tel:+${digits(l.phone)}">Позвонить: ${l.phone} </a>`;$('#form-result').hidden=false;$('#form-result').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'})});
if(stored('voltag-notice'))$('#cookie-note').hidden=true;
$('#cookie-close').addEventListener('click',()=>{$('#cookie-note').hidden=true;remember('voltag-notice','1')});

// Service chapters use native disclosure semantics and remain keyboard accessible.


const serviceCards = [...document.querySelectorAll('.service-chapter')];
function activateService(index){serviceCards.forEach((card,i)=>{
 const active=i===index;
 card.toggleAttribute('open',active);
 card.querySelector('.chapter-toggle').setAttribute('aria-expanded',String(active));
 card.querySelector('.chapter-body').inert=!active;
 card.querySelector('.chapter-body').setAttribute('aria-hidden',String(!active));
});}
serviceCards.forEach((card,i)=>{
 const button=card.querySelector('.chapter-toggle'),panel=card.querySelector('.chapter-body');
 button.id='service-toggle-'+i;panel.id='service-panel-'+i;
 button.setAttribute('aria-controls',panel.id);panel.setAttribute('aria-labelledby',button.id);
 button.addEventListener('click',()=>activateService(i));
 button.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(i+1)%serviceCards.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(i+serviceCards.length-1)%serviceCards.length;else return;e.preventDefault();activateService(n);serviceCards[n].querySelector('.chapter-toggle').focus();});
});
activateService(0);

// Measure every panel at its fully expanded width, never its animated width.
const serviceDeck=document.querySelector('.service-deck');
let serviceDeckWidth=-1;
function sizeServiceDeck(){
 if(!matchMedia('(min-width:721px)').matches){serviceDeckWidth=-1;return;}
 const width=serviceDeck.clientWidth;
 const deckStyle=getComputedStyle(serviceDeck);
 const available=width-parseFloat(deckStyle.paddingLeft)-parseFloat(deckStyle.paddingRight)-parseFloat(deckStyle.columnGap)*(serviceCards.length-1)-70*(serviceCards.length-1)-72;
 serviceDeck.style.setProperty('--service-body-width',available+'px');
 serviceDeck.style.setProperty('--service-panel-height','auto');
 const height=Math.max(548,...serviceCards.map(card=>Math.ceil(card.querySelector('.chapter-body').scrollHeight)));
 serviceDeck.style.setProperty('--service-panel-height',height+'px');
 serviceDeck.style.setProperty('--service-deck-height',(height+26)+'px');
 serviceDeckWidth=width;
}
new ResizeObserver(()=>{if(serviceDeck.clientWidth!==serviceDeckWidth)sizeServiceDeck();}).observe(serviceDeck);
document.fonts.ready.then(sizeServiceDeck);
serviceDeck.querySelectorAll('img').forEach(img=>img.addEventListener('load',sizeServiceDeck,{once:true}));
sizeServiceDeck();


function updateSymptomVisual(i){
 const images=['service-01.png','service-02.png','service-02.png','service-03.png','service-04.png'];
 const alts=['Манометры для диагностики автокондиционера','Конденсор автомобильного кондиционера','Конденсор и трубки контура кондиционера','Компрессор автокондиционера','Оборудование для обслуживания контура'];
 const image=document.getElementById('symptom-image');
 image.src='assets/'+images[i];image.alt=alts[i];
 document.getElementById('symptom-count').textContent=String(i+1).padStart(2,'0')+' / 05';
 document.getElementById('symptom-label').textContent=document.getElementById('symptom-tab-'+i).textContent.trim();
 if(!matchMedia('(prefers-reduced-motion:reduce)').matches){
  document.querySelector('.symptom-answer-copy').animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'ease-out'});
 }
}
