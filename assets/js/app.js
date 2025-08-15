
// Levant Boulangerie — Vanilla JS
const state = {
  products: [
    {id:1, name:'Croissant Royale', price:28000, img:'assets/img/product-1.svg'},
    {id:2, name:'Baguette Classic', price:22000, img:'assets/img/product-2.svg'},
    {id:3, name:'Pain au Chocolat', price:32000, img:'assets/img/product-3.svg'},
    {id:4, name:'Sourdough Loaf', price:38000, img:'assets/img/product-4.svg'},
    {id:5, name:'Macaron Assortie (6)', price:55000, img:'assets/img/product-5.svg'},
  ],
  testimonials: [
    {name:'Nadia', text:'Rotinya fresh banget, makaronnya juara!', rating:5},
    {name:'Rafi', text:'Croissant paling flaky di Jakarta.', rating:5},
    {name:'Maya', text:'Harga bersahabat, ambience toko elegan.', rating:4}
  ],
  cart: JSON.parse(localStorage.getItem('lb_cart')||'[]')
};

// Helpers
const formatIDR = v => v.toLocaleString('id-ID');
const qs = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => [...el.querySelectorAll(s)];

function saveCart(){ localStorage.setItem('lb_cart', JSON.stringify(state.cart)); updateCartBadge(); renderCartTable(); }

function addToCart(id){
  const item = state.cart.find(it => it.id === id);
  if(item){ item.qty += 1; } else {
    const p = state.products.find(p => p.id === id);
    state.cart.push({id:p.id, name:p.name, price:p.price, qty:1});
  }
  saveCart();
  toast('Ditambahkan ke keranjang');
}

function removeFromCart(id){
  state.cart = state.cart.filter(it => it.id !== id);
  saveCart();
}

function changeQty(id, delta){
  const item = state.cart.find(it => it.id === id);
  if(!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
}

function updateCartBadge(){
  const count = state.cart.reduce((a,b)=>a+b.qty,0);
  qs('#cart-badge').textContent = count;
}

function renderProducts(){
  const grid = qs('#product-grid');
  grid.innerHTML = state.products.map(p => `
    <div class="card product reveal">
      <img src="${p.img}" alt="${p.name}">
      <div class="title">${p.name}</div>
      <div class="price">Rp ${formatIDR(p.price)}</div>
      <div class="cta">
        <button class="btn" aria-label="Tambahkan ${p.name}" data-add="${p.id}">+ Keranjang</button>
        <button class="btn gold" aria-label="Checkout cepat ${p.name}" data-buy="${p.id}">Beli Sekarang</button>
      </div>
      <div class="tag">Best seller</div>
    </div>
  `).join('');

  grid.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    const buy = e.target.closest('[data-buy]');
    if(add){ addToCart(+add.dataset.add); }
    if(buy){ addToCart(+buy.dataset.buy); openCart(); }
  });
}

function renderSlider(){
  const slidesEl = qs('.slides');
  const top5 = state.products.slice(0,5);
  slidesEl.innerHTML = top5.map(p => `
    <div class="slide">
      <img src="${p.img}" alt="${p.name}">
      <div class="info">
        <span class="badge">Terlaris</span>
        <h4>${p.name}</h4>
        <p>Rasa autentik Prancis — dibuat harian dengan bahan premium.</p>
        <div class="price">Rp ${formatIDR(p.price)}</div>
        <div style="margin-top:.5rem;display:flex;gap:.5rem">
          <button class="btn" onclick="addToCart(${p.id})">+ Keranjang</button>
          <button class="btn gold" onclick="addToCart(${p.id}); openCart()">Checkout</button>
        </div>
      </div>
    </div>
  `).join('');

  let index = 0;
  const update = ()=> slidesEl.style.transform = `translateX(-${index*100}%)`;
  qs('.next').onclick = ()=>{ index = (index+1)%top5.length; update(); };
  qs('.prev').onclick = ()=>{ index = (index-1+top5.length)%top5.length; update(); };
  setInterval(()=>{ index = (index+1)%top5.length; update(); }, 5000);
}

function renderTestimonials(){
  const wrap = qs('#testimonials');
  const stored = JSON.parse(localStorage.getItem('lb_testi')||'[]');
  const all = [...state.testimonials, ...stored];
  wrap.innerHTML = all.map(t => `
    <div class="card reveal">
      <strong>${t.name}</strong>
      <div class="small">${'★'.repeat(t.rating||5)}</div>
      <p style="margin:.5rem 0 0">${t.text}</p>
    </div>
  `).join('');
}

function handleForms(){
  // Kritik & saran
  qs('#feedback-form').addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.target);
    e.target.reset();
    toast('Terima kasih atas masukannya!');
  });

  // Input testimoni
  qs('#testi-form').addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const entry = {
      name: data.get('name') || 'Anonim',
      text: data.get('text') || '',
      rating: +data.get('rating') || 5
    };
    const list = JSON.parse(localStorage.getItem('lb_testi')||'[]');
    list.push(entry);
    localStorage.setItem('lb_testi', JSON.stringify(list));
    renderTestimonials();
    e.target.reset();
    toast('Testimoni ditambahkan!');
  });
}

function renderCartTable(){
  const body = qs('#cart-body');
  const emptyRow = `<tr><td colspan="5" style="text-align:center;color:#cfc7ff">Keranjang masih kosong</td></tr>`;
  if(!body) return;
  body.innerHTML = state.cart.length ? state.cart.map(it => `
    <tr>
      <td>${it.name}</td>
      <td>Rp ${formatIDR(it.price)}</td>
      <td>
        <button class="btn ghost" onclick="changeQty(${it.id},-1)">−</button>
        <span style="display:inline-block;min-width:24px;text-align:center">${it.qty}</span>
        <button class="btn ghost" onclick="changeQty(${it.id},1)">+</button>
      </td>
      <td>Rp ${formatIDR(it.qty*it.price)}</td>
      <td><button class="btn" onclick="removeFromCart(${it.id})">Hapus</button></td>
    </tr>
  `).join('') : emptyRow;

  const total = state.cart.reduce((a,b)=>a+b.qty*b.price,0);
  qs('#cart-total').textContent = 'Rp ' + formatIDR(total);
}

function openCart(){ qs('#cart-modal').classList.add('open'); renderCartTable(); }
function closeCart(){ qs('#cart-modal').classList.remove('open'); }

function checkout(){
  if(!state.cart.length){ toast('Keranjang kosong'); return; }
  const total = state.cart.reduce((a,b)=>a+b.qty*b.price,0);
  alert('Checkout sukses! Total: Rp ' + formatIDR(total) + '\nTerima kasih berbelanja di Levant Boulangerie.');
  state.cart = [];
  saveCart();
  closeCart();
}

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){ en.target.classList.add('show'); io.unobserve(en.target); }
  });
},{threshold:.12});

function toast(msg){
  const el = qs('#toast'); el.textContent = msg; el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'), 2000);
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderSlider();
  renderProducts();
  renderTestimonials();
  handleForms();
  updateCartBadge();
  qsa('.reveal').forEach(el=>io.observe(el));
  qs('#open-cart').addEventListener('click', openCart);
  qs('#close-cart').addEventListener('click', closeCart);
  qs('#checkout').addEventListener('click', checkout);
});
