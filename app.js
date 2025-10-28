'use strict';

const IDS = {
  filtersForm: 'filters-form',
  modeRadios: 'mode-radios',
  illustratedOnly: 'illustrated-only',
  applyBtn: 'apply-btn',
  resetBtn: 'reset-btn',
  randomBtn: 'random-btn',
  routesGrid: 'routes-grid',
  cardTemplate: 'route-card-template',
};

const STORAGE_KEYS = {
  filters: 'routeCards.filters',
  favorites: 'routeCards.favorites',
};

const routesData = [
  { id: 'r1', origin: 'Old Town',         destination: 'River Park',     mode: 'walk', vibes: ['scenic', 'quiet'], illustrated: true,  notes: 'Shaded promenade by the river.', image:'images/pedestrian.png' },
  { id: 'r2', origin: 'Central Station',  destination: 'Museum Mile',    mode: 'bus',  vibes: ['fast'],             illustrated: false, notes: 'Direct line, few stops.', image:'/images/bus.png' },
  { id: 'r3', origin: 'Seaside',          destination: 'Cliff Lookout',  mode: 'bike', vibes: ['scenic'],           illustrated: true,  notes: 'Coastal road, gentle climb.', image:'/images/biking.png' },
  { id: 'r4', origin: 'Market Square',    destination: 'Tech Campus',    mode: 'bus',  vibes: ['fast','busy'],      illustrated: true,  notes: 'Express during peak hours.', image:'/images/bus.png' },
  { id: 'r5', origin: 'Botanic Garden',   destination: 'Lakehouse',      mode: 'walk', vibes: ['quiet'],            illustrated: false, notes: 'Dirt path, birdwatching.', image:'/images/pedestrian.png' },
  { id: 'r6', origin: 'Harbor',           destination: 'Lighthouse',     mode: 'bike', vibes: ['scenic','windy'],   illustrated: false, notes: 'Open stretches, bring water.', image:'/images/biking.png' },
];


let favoriteIds = []
const favoBadge = document.getElementById('favorites-count')
const radioModeEl = document.getElementById('mode-radios');
const illustratedEL = document.getElementById('illustrated-only');
const applyBtnEL = document.getElementById('apply-btn');
const resetBtnEL = document.getElementById('reset-btn');
const randomBtn = document.getElementById('random-btn');
const routesGridEL = document.getElementById('routes-grid');
const cardTemplateEl = document.getElementById('route-card-template');
const sortMenuEl = document.getElementById('sort-menu');
const sortLabelEl = sortMenuEl ? sortMenuEl.querySelector('[data-sort-label]') : null;

console.log('Route Cards: JS loaded');


document.addEventListener('click', function(e){
    const clickedBTN = e.target.closest('button')
    if (!clickedBTN) return;

    const fn = actions[clickedBTN.id]
    if (fn) fn ()

})

const actions = {
  'apply-btn': applyFilters,
  'reset-btn': resetFilters,
  'random-btn': pickRandom,
  'fav-btn': favorite
}

function favorite (){
  


}

function applyFilters () {
  const radioMode = document.querySelector('input[name = "mode"]:checked')
  const selectedRadio = radioMode.value
  const isIllustrated = illustratedEL.checked
  let finalRoute = routesData.filter(route=> route.mode===selectedRadio )
  if (isIllustrated){
    finalRoute = finalRoute.filter(route=> route.illustrated===true)
  }
  renderRoute (finalRoute)


}

function renderRoute (route){
  routesGridEL.innerHTML = "";

  for (let i = 0; i < route.length; i++){
    const frag = cardTemplateEl.content.cloneNode(true);
   
    // Card element & Metadata
    const cardEl = frag.querySelector('[data-id]')
    cardEl.dataset.id = route[i].id

    // fill text
    frag.querySelector('[data-origin]').textContent = route[i].origin;
    frag.querySelector('[data-destination]').textContent = route[i].destination;
    frag.querySelector('[data-mode]').textContent = route[i].mode;
    frag.querySelector('[data-notes]').textContent = route[i].notes;
    

    // vibes as "a, b, c"
    const vibesEl = frag.querySelector('[data-vibes]');
    vibesEl.textContent = Array.isArray(route[i].vibes) ? route[i].vibes.join(', ') : '';

    // media: remove skeleton, then add img
    const media = frag.querySelector('.card-media');
    const skel  = media.querySelector('.media-skeleton');
    if (skel) skel.remove();

    const img = document.createElement('img');
    img.src = route[i].image; // e.g. '../images/pedestrian.png'
    img.alt = `${route[i].origin} to ${route[i].destination}`;
    media.append(img);

    const routeID = route[i].id
    

    // finally append the filled clone to the grid
    routesGridEL.append(frag);
  }
}

function resetFilters () {
  const radio = radioModeEl.querySelector('input[name = "mode"]:checked')
  if (radio){
    routesGridEL.innerHTML = ""
    applyBtnEL.disabled = true
    illustratedEL.checked = false
    radio.checked = false
  }

}

function pickRandom () {console.log('Pick Random')}

// --- Initial render on load ---
document.addEventListener('DOMContentLoaded', () => {
  // baseline controls
  const formEl = document.getElementById('filters-form');
  if (formEl) formEl.reset();                  // clears radios/checkbox
  applyBtnEL.disabled = true;                  // Apply starts disabled
  document.querySelectorAll('.radio')
    .forEach(lbl => lbl.classList.remove('highlight'));

  if (sortLabelEl) sortLabelEl.textContent = 'Sort';
  const summary = sortMenuEl ? sortMenuEl.querySelector('summary') : null;
  if (summary) summary.setAttribute('aria-expanded', 'false');

  // render all routes
  renderRoute(routesData);
});

if (sortMenuEl) {
  const summaryEl = sortMenuEl.querySelector('summary');

  sortMenuEl.addEventListener('toggle', () => {
    if (summaryEl) summaryEl.setAttribute('aria-expanded', sortMenuEl.hasAttribute('open'));
  });

  sortMenuEl.addEventListener('click', event => {
    const menuItem = event.target.closest('.menu-item');
    if (!menuItem) return;

    if (sortLabelEl) sortLabelEl.textContent = menuItem.textContent.trim();

    sortMenuEl.open = false;
    if (summaryEl) summaryEl.setAttribute('aria-expanded', 'false');
  });
}

radioModeEl.addEventListener('change', function(){
  const checkedRadio = document.querySelector('input[name = "mode"]:checked')
  console.log(checkedRadio)
  applyBtnEL.disabled=false

})

document.addEventListener('click', (e)=>{
  const starBtn = e.target.closest('[data-action="toggle-fav"]')
  if (!starBtn) return
  const card = starBtn.closest('[data-id]')
  const id = card?.dataset.id
  if (favoriteIds.includes(id)){
    favoriteIds = favoriteIds.filter(fav => fav !==id)

  }
  else {favoriteIds.push(id)}
  const isNowFav = favoriteIds.includes(id)
  starBtn.setAttribute('aria-pressed', String(isNowFav))
  favoriteRoute()
  
})



function favoriteRoute (){
  console.log(favoriteIds)
  favoBadge.textContent = favoriteIds.length

}

illustratedEL.addEventListener('change', function(){
  console.log(illustratedEL.checked)
})
