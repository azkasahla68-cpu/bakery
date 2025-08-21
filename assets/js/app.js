// Simple product data (max 5 items)
const PRODUCTS = [
  { id: "P001", name: "Ballon Bleu Watch", price: 128_000_000, img: "watch.svg" },
  { id: "P002", name: "Love Bracelet", price: 95_000_000, img: "bracelet.svg" },
  { id: "P003", name: "Juste Un Clou Ring", price: 52_000_000, img: "ring.svg" },
  { id: "P004", name: "Tank Française Watch", price: 115_000_000, img: "watch2.svg" },
  { id: "P005", name: "Diamants Légers Necklace", price: 75_000_000, img: "necklace.svg" },
];

// Utilities
const rp = (n)=> new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR', maximumFractionDigits:0}).format(n);
const qs = (s, el=document)=> el.querySelector(s);
const qsa = (s, el=document)=> [...el.querySelectorAll(s)];

// Build slider cards
const track = qs('#productTrack');
PRODUCTS.forEach(p => {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <img class="product-img" src="assets/img/${p.img}" alt="${p.name}" loading="lazy"/>
    <div class="meta">
      <h3>${p.name}</h3>
      <div class="price">${rp(p.price)}</div>
    </div>
    <div class="actions">
      <button class="btn btn-gold" data-add="${p.id}">Tambahkan ke Keranjang</button>
      <button class="btn btn-ghost" data-buy="${p.id}">Beli Sekarang</button>
    </div>
  `;
  track.appendChild(card);
});

// Slider controls
const prev = qs('.slider .prev');
const next = qs('.slider .next');
prev.addEventListener('click', () => track.scrollBy({left: -track.clientWidth, behavior:'smooth'}));
next.addEventListener('click', () => track.scrollBy({left: track.clientWidth, behavior:'smooth'}));

// Cart logic
const state = {
  items: [],
};

const cartDrawer = qs('#cartDrawer');
const cartButton = qs('#cartButton');
const closeCart = qs('#closeCart');
const cartItems = qs('#cartItems');
const cartCount = qs('#cartCount');
const cartTotal = qs('#cartTotal');
const checkoutButton = qs('#checkoutButton');
const checkoutTop = qs('#checkoutTop');

function saveCart(){ localStorage.setItem('cart', JSON.stringify(state.items)); }
function loadCart(){ state.items = JSON.parse(localStorage.getItem('cart') || '[]'); renderCart(); }
function addToCart(id, qty=1){
  const found = state.items.find(i=> i.id === id);
  const product = PRODUCTS.find(p=> p.id === id);
  if(!product) return;
  if(found){ found.qty += qty; } else { state.items.push({id, qty}); }
  renderCart(); saveCart();
  openCart();
}
function removeFromCart(id){ state.items = state.items.filter(i=> i.id !== id); renderCart(); saveCart(); }
function setQty(id, qty){ const it = state.items.find(i=> i.id === id); if(it){ it.qty = Math.max(1, qty|0); renderCart(); saveCart(); } }
function openCart(){ cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden','false'); }
function closeCartDrawer(){ cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden','true'); }

function renderCart(){
  cartItems.innerHTML = '';
  let total = 0;
  state.items.forEach(it => {
    const p = PRODUCTS.find(pp=> pp.id === it.id);
    if(!p) return;
    total += p.price * it.qty;
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <img src="assets/img/${p.img}" alt="${p.name}" />
      <div style="flex:1">
        <div style="font-weight:700">${p.name}</div>
        <div class="meta">${rp(p.price)} × 
          <input type="number" min="1" value="${it.qty}" style="width:60px; padding:.3rem; margin-left:.3rem" />
        </div>
      </div>
      <button class="icon-btn" aria-label="Hapus">🗑️</button>
    `;
    li.querySelector('input').addEventListener('input', (e)=> setQty(p.id, +e.target.value));
    li.querySelector('button').addEventListener('click', ()=> removeFromCart(p.id));
    cartItems.appendChild(li);
  });
  cartCount.textContent = state.items.reduce((a,b)=> a+b.qty, 0);
  cartTotal.textContent = rp(total);
}

document.addEventListener('click', (e)=>{
  const add = e.target.closest('[data-add]');
  const buy = e.target.closest('[data-buy]');
  if(add){ addToCart(add.dataset.add, 1); }
  if(buy){ addToCart(buy.dataset.buy, 1); openCart(); }
});

cartButton.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartDrawer);

// Checkout buttons
function checkout(){
  if(state.items.length === 0){ alert('Keranjang masih kosong.'); return; }
  const summary = state.items.map(it=> {
    const p = PRODUCTS.find(pp=> pp.id === it.id);
    return `• ${p.name} x ${it.qty} = ${rp(p.price*it.qty)}`;
  }).join('\n');
  alert('Checkout sukses (demo)!\n\nRincian:\n' + summary + '\n\nTerima kasih.');
  state.items = []; saveCart(); renderCart(); closeCartDrawer();
}
checkoutButton.addEventListener('click', checkout);
checkoutTop.addEventListener('click', checkout);

// Testimonials
const DEFAULT_TESTIMONIALS = [
  { nama: "Alya", pesan: "Pelayanan sangat elegan, kemasannya pun mewah." },
  { nama: "Rama", pesan: "Produk original dan finishing-nya sempurna." },
  { nama: "Sinta", pesan: "Pengiriman cepat, packing rapi. Recommended!" }
];

function loadTestimonials(){
  const saved = JSON.parse(localStorage.getItem('testimonials') || 'null');
  return saved && Array.isArray(saved) ? saved : DEFAULT_TESTIMONIALS.slice();
}
function saveTestimonials(list){ localStorage.setItem('testimonials', JSON.stringify(list)); }
function renderTestimonials(list){
  const ul = qs('#testimonialList');
  ul.innerHTML = '';
  list.forEach(t => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${t.nama}</strong><p>${t.pesan}</p>`;
    ul.appendChild(li);
  });
}

const tForm = qs('#testimonialForm');
let testimonials = loadTestimonials();
renderTestimonials(testimonials);

tForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const nama = qs('#nama').value.trim();
  const pesan = qs('#pesan').value.trim();
  if(!nama || !pesan) return;
  testimonials.unshift({nama, pesan});
  saveTestimonials(testimonials);
  renderTestimonials(testimonials);
  tForm.reset();
  alert('Terima kasih untuk testimoninya!');
});

// Feedback form (kritik & saran)
qs('#feedbackForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const email = qs('#email').value.trim();
  const subjek = qs('#subjek').value.trim();
  const isi = qs('#isi').value.trim();
  console.log('Feedback terkirim (demo):', {{ email, subjek, isi }});
  alert('Terima kasih atas masukan Anda!');
  e.target.reset();
});

// Init
loadCart();
