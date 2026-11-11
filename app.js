const listings = [
  {id:'demo-1',name:'Светлая квартира у набережной',meta:'2 комн. · 58 м² · 7/12 этаж',price:38500000,rent:260000,district:'Есиль',tone:'a',school:6,transit:4,park:8,shop:5,clinic:12},
  {id:'demo-2',name:'Уютная двушка для семьи',meta:'2 комн. · 64 м² · 4/9 этаж',price:32900000,rent:230000,district:'Сарыарка',tone:'b',school:4,transit:7,park:11,shop:3,clinic:8},
  {id:'demo-3',name:'Современная квартира',meta:'1 комн. · 42 м² · 10/16 этаж',price:28700000,rent:210000,district:'Нура',tone:'c',school:9,transit:5,park:6,shop:8,clinic:10},
  {id:'demo-4',name:'Просторная квартира с видом',meta:'3 комн. · 82 м² · 6/10 этаж',price:44900000,rent:320000,district:'Алматы',tone:'d',school:3,transit:9,park:5,shop:7,clinic:4}
];
let favorites = new Set(JSON.parse(localStorage.getItem('ryadom-favorites') || '[]'));
let onlySaved = false;
const money = n => new Intl.NumberFormat('ru-RU').format(n);
function activeNeeds(){return [...document.querySelectorAll('.chip.selected')].map(x=>x.dataset.need)}
function score(x, needs){if(!needs.length)return 100;return Math.round(needs.reduce((s,k)=>s+(x[k]<=5?100:x[k]<=8?80:x[k]<=12?60:35),0)/needs.length)}
function render(){
  const deal=document.querySelector('#deal').value,budget=Number(document.querySelector('#budget').value)||Infinity,rooms=document.querySelector('#rooms').value,district=document.querySelector('#district').value,needs=activeNeeds();
  const rows=listings.filter(x=>{const count=Number(x.meta.match(/^(\d)/)?.[1]);return (deal==='buy'?x.price:x.rent)<=budget&&(rooms==='any'||(rooms==='4'?count>=4:count===Number(rooms)))&&(district==='any'||x.district===district)&&(!onlySaved||favorites.has(x.id))}).sort((a,b)=>score(b,needs)-score(a,needs));
  document.querySelector('#resultCount').textContent=rows.length;document.querySelector('#savedCount').textContent=favorites.size;
  document.querySelector('#listingsBody').innerHTML=rows.length?rows.map(x=>`<tr><td><div class="listing"><div class="thumb ${x.tone}">⌂</div><div><div class="listing-name">${x.name}</div><div class="listing-meta">${x.meta}</div><a class="open-listing" href="https://krisha.kz/${deal==='buy'?'prodazha':'arenda'}/kvartiry/astana/" target="_blank" rel="noopener">Открыть поиск на Krisha.kz ↗</a></div></div></td><td><div class="price">${money(deal==='buy'?x.price:x.rent)} ₸<small>${deal==='rent'?'/ мес.':''}</small></div></td><td>${x.meta.match(/· (\d+) м²/)[1]}</td><td><span class="district-tag">${x.district}</span></td><td><span class="distance">${x.school} мин</span><small class="distance">пешком*</small></td><td><span class="distance">${x.transit} мин</span><small class="distance">до остановки*</small></td><td><span class="score">${score(x,needs)}%</span></td><td><button class="save-row ${favorites.has(x.id)?'saved':''}" data-save="${x.id}" aria-label="Сохранить">${favorites.has(x.id)?'♥':'♡'}</button></td></tr>`).join(''):'<tr><td colspan="8" style="padding:28px;text-align:center;color:#89928d">Нет подходящих вариантов. Измените фильтры или снимите фильтр избранного.</td></tr>';
  document.querySelectorAll('[data-save]').forEach(b=>b.onclick=()=>{favorites.has(b.dataset.save)?favorites.delete(b.dataset.save):favorites.add(b.dataset.save);localStorage.setItem('ryadom-favorites',JSON.stringify([...favorites]));render()});
  document.querySelector('#krishaSearch').href=`https://krisha.kz/${deal==='buy'?'prodazha':'arenda'}/kvartiry/astana/`;
}
document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{b.classList.toggle('selected');render()});
['deal','budget','rooms','district'].forEach(id=>document.querySelector('#'+id).addEventListener('change',render));document.querySelector('#budget').addEventListener('input',render);
document.querySelector('#searchBtn').onclick=()=>{render();document.querySelector('#results').scrollIntoView({behavior:'smooth'})};
document.querySelector('#resetFilters').onclick=()=>{document.querySelector('#deal').value='buy';document.querySelector('#budget').value=45000000;document.querySelector('#rooms').value='any';document.querySelector('#district').value='any';document.querySelectorAll('.chip').forEach((c,i)=>c.classList.toggle('selected',i===0));onlySaved=false;render()};
document.querySelector('#savedToggle').onclick=()=>{onlySaved=!onlySaved;render();document.querySelector('#results').scrollIntoView({behavior:'smooth'})};
render();
