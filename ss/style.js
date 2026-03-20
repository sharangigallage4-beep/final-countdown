/* script.js - shared app behaviors */

// highlight current sidebar link if any
function initPageActive(){
  const path = location.pathname.split("/").pop();
  document.querySelectorAll('.side-link').forEach(a=>{
    const href = a.getAttribute('href');
    if(href && path === href) a.classList.add('active');
  });
}

// basic logout helper
function logout(){
  location.href = 'index.html';
}

/* ----------------- Pet CRUD (localStorage) ----------------- */
const PET_KEY = 'petwell_pets_v1';

function loadPets(){
  const raw = localStorage.getItem(PET_KEY);
  return raw ? JSON.parse(raw) : [];
}
function savePets(list){
  localStorage.setItem(PET_KEY, JSON.stringify(list));
}
function addPet(obj){
  const list = loadPets();
  obj.id = 'P-'+(Date.now()%100000);
  list.push(obj);
  savePets(list);
}
function removePet(id){
  let list = loadPets();
  list = list.filter(p=>p.id !== id);
  savePets(list);
}

/* render pets into ".pet-grid" container if present */
function renderPets(){
  const container = document.querySelector('.pet-grid');
  if(!container) return;
  const list = loadPets();
  container.innerHTML = list.length ? list.map(p=>{
    return `<div class="pet-card">
      <h3>${escapeHtml(p.name)}</h3>
      <p class="small">${escapeHtml(p.type)} • ${escapeHtml(p.age)} years</p>
      <p class="small">Owner: ${escapeHtml(p.owner)}</p>
      <div style="margin-top:10px">
        <button class="btn btn-soft" onclick="editPet('${p.id}')">Edit</button>
        <button class="btn btn-danger" onclick="removePetConfirm('${p.id}')">Delete</button>
      </div>
    </div>`;
  }).join('') : '<div class="small">No pets added yet.</div>';
}
function removePetConfirm(id){
  if(confirm('Delete this pet?')){ removePet(id); renderPets(); }
}
function editPet(id){
  const list = loadPets();
  const p = list.find(x=>x.id===id);
  if(!p) return alert('Pet not found');
  // simple prompt edits (for brevity)
  const name = prompt('Pet name', p.name);
  if(name === null) return;
  p.name = name;
  savePets(list);
  renderPets();
}

/* helper to escape html */
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

/* initialize add pet form if present */
function initPetForm(){
  const form = document.getElementById('petForm');
  if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name = form.querySelector('[name=name]').value.trim();
    const type = form.querySelector('[name=type]').value.trim();
    const age = form.querySelector('[name=age]').value.trim();
    const owner = form.querySelector('[name=owner]').value.trim();
    if(!name || !type || !age || !owner) return alert('Fill all fields');
    addPet({name,type,age,owner});
    form.reset();
    renderPets();
    alert('Pet added ✔');
  });
}

/* ----------------- Delivery Filtering ----------------- */
function initDeliveryFilter(){
  const input = document.getElementById('deliverySearch');
  const sel = document.getElementById('deliveryStatus');
  if(!input && !sel) return;
  const render = ()=> {
    const q = input ? input.value.trim().toLowerCase() : '';
    const s = sel ? sel.value : '';
    document.querySelectorAll('#deliveryTable tbody tr').forEach(tr=>{
      const text = tr.innerText.toLowerCase();
      const status = tr.dataset.status || '';
      const matchQ = !q || text.includes(q);
      const matchS = !s || status === s;
      tr.style.display = (matchQ && matchS) ? '' : 'none';
    });
  };
  if(input) input.addEventListener('input', render);
  if(sel) sel.addEventListener('change', render);
}

/* ----------------- Small init on pages ----------------- */
document.addEventListener('DOMContentLoaded', ()=>{
  initPageActive();
  initPetForm();
  renderPets();
  initDeliveryFilter();
});
function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.remove("active");
    });

    document.getElementById(sectionId).classList.add("active");

    // highlight menu item
    document.querySelectorAll(".menu li").forEach(li => li.classList.remove("active"));
    event.target.classList.add("active");
}

function logout() {
    alert("You have logged out successfully!");
}
const menuButton = document.getElementById('menuButton');
const dropdownMenu = document.getElementById('dropdownMenu');

// 1. Toggle the menu when clicking the button
menuButton.addEventListener('click', (event) => {
  event.stopPropagation(); // Prevents the click from reaching the 'window' listener below
  dropdownMenu.classList.toggle('show');
});

// 2. Close the menu if the user clicks anywhere else on the screen
window.addEventListener('click', () => {
  if (dropdownMenu.classList.contains('show')) {
    dropdownMenu.classList.remove('show');
  }
});
const trigger = document.getElementById('profileTrigger');
const menu = document.getElementById('profileMenu');

trigger.addEventListener('click', (e) => {
  // Toggle the 'show' class on the menu
  menu.classList.toggle('show');
  
  // Toggle the 'active' class on the trigger to rotate the arrow
  trigger.classList.toggle('active');
  
  // Stop the click from closing the menu immediately
  e.stopPropagation();
});

// Close the menu if you click anywhere else on the page
window.addEventListener('click', () => {
  menu.classList.remove('show');
  trigger.classList.remove('active');
});
