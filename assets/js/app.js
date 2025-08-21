const PRODUCTS = [
  { id: "P001", name: "Ballon Bleu Watch", price: 128_000_000, img: "watch.svg" },
  { id: "P002", name: "Love Bracelet", price: 95_000_000, img: "bracelet.svg" },
  { id: "P003", name: "Juste Un Clou Ring", price: 52_000_000, img: "ring.svg" },
  { id: "P004", name: "Tank Française Watch", price: 115_000_000, img: "watch2.svg" },
  { id: "P005", name: "Diamants Légers Necklace", price: 75_000_000, img: "necklace.svg" },
];
const rp = (n)=> new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
const qs = (s,el=document)=> el.querySelector(s);

const track = qs('#sliderTrack');
PRODUCTS.forEach(p=>{
  const card = document.createElement('article');
  card.className='card';
  card.innerHTML=`
    <img class="product-img" src="assets/img/${p.img}" alt="${p.name}" loading="lazy" />
    <div class="meta">
      <h3>${p.name}</h3>
      <div class="price">${rp(p.price)}</div>
    </div>
    <div class="actions">
      <button class="btn btn-gold" data-add="${p.id}">Tambahkan ke Keranjang</button>
      <button class="btn btn-ghost" data-buy="${p.id}">Beli Sekarang</button>
    </div>`;
  track.appendChild(card);
});

qs('.nav.prev').addEventListener('click', ()=> track.scrollBy({left:-track.clientWidth, behavior:'smooth'}));
qs('.nav.next').addEventListener('click', ()=> track.scrollBy({left: track.clientWidth, behavior:'smooth'}));

const state={items:[]};
const cartDrawer=qs('#cartDrawer');
const cartButton=qs('#cartButton');
const closeCart=qs('#closeCart');
const cartItems=qs('#cartItems');
const cartCount=qs('#cartCount');
const cartTotal=qs('#cartTotal');
const checkoutButton=qs('#checkoutButton');
const checkoutTop=qs('#checkoutTop');

function saveCart(){ localStorage.setItem('cart', JSON.stringify(state.items)); }
function loadCart(){ state.items = JSON.parse(localStorage.getItem('cart')||'[]'); renderCart(); }
function addToCart(id, qty=1){
  const found=state.items.find(i=>i.id===id);
  const p=PRODUCTS.find(x=>x.id===id); if(!p) return;
  if(found){found.qty+=qty;} else {state.items.push({id,qty});}
  renderCart(); saveCart(); openCart();
}
function removeFromCart(id){ state.items = state.items.filter(i=> i.id!==id); renderCart(); saveCart(); }
function setQty(id, qty){ const it=state.items.find(i=>i.id===id); if(it){ it.qty=Math.max(1, qty|0); renderCart(); saveCart(); } }
function openCart(){ cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden','false'); }
function closeCartDrawer(){ cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden','true'); }

function renderCart(){
  cartItems.innerHTML='';
  let total=0;
  state.items.forEach(it=>{
    const p=PRODUCTS.find(pp=>pp.id===it.id); if(!p) return;
    total+=p.price*it.qty;
    const li=document.createElement('li');
    li.className='cart-item';
    li.innerHTML=`
      <img src="assets/img/${p.img}" alt="${p.name}" />
      <div style="flex:1">
        <div style="font-weight:700">${p.name}</div>
        <div class="meta">${rp(p.price)} × 
          <input type="number" min="1" value="${it.qty}" style="width:60px; padding:.3rem; margin-left:.3rem" />
        </div>
      </div>
      <button class="icon-btn" aria-label="Hapus">🗑️</button>`;
    li.querySelector('input').addEventListener('input',e=> setQty(p.id, +e.target.value));
    li.querySelector('button').addEventListener('click',()=> removeFromCart(p.id));
    cartItems.appendChild(li);
  });
  cartCount.textContent = state.items.reduce((a,b)=> a+b.qty, 0);
  cartTotal.textContent = rp(total);
}

document.addEventListener('click', e=>{
  const add=e.target.closest('[data-add]');
  const buy=e.target.closest('[data-buy]');
  if(add) addToCart(add.dataset.add,1);
  if(buy) addToCart(buy.dataset.buy,1);
});

cartButton.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartDrawer);

function checkout(){
  if(state.items.length===0){ alert('Keranjang masih kosong.'); return; }
  const summary = state.items.map(it=>{
    const p=PRODUCTS.find(pp=>pp.id===it.id);
    return `• ${p.name} x ${it.qty} = ${rp(p.price*it.qty)}`;
  }).join('\\n');
  alert('Checkout sukses (demo)!\\n\\nRincian:\\n'+summary+'\\n\\nTerima kasih.');
  state.items=[]; saveCart(); renderCart(); closeCartDrawer();
}
checkoutButton.addEventListener('click', checkout);
checkoutTop.addEventListener('click', checkout);

const DEFAULT_TESTIMONIALS=[
  {nama:'Alya', pesan:'Pelayanan elegan, kemasan mewah.'},
  {nama:'Rama', pesan:'Produk original, finishing sempurna.'},
  {nama:'Sinta', pesan:'Pengiriman cepat, packing rapi!'},
];
function loadTestimonials(){ const s=JSON.parse(localStorage.getItem('testimonials')||'null'); return s&&Array.isArray(s)?s:DEFAULT_TESTIMONIALS.slice(); }
function saveTestimonials(l){ localStorage.setItem('testimonials', JSON.stringify(l)); }
function renderTestimonials(l){
  const ul=qs('#testimonialList'); ul.innerHTML='';
  l.forEach(t=>{ const li=document.createElement('li'); li.innerHTML=`<strong>${t.nama}</strong><p>${t.pesan}</p>`; ul.appendChild(li); });
}
let testimonials=loadTestimonials(); renderTestimonials(testimonials);
qs('#testimonialForm').addEventListener('submit', e=>{
  e.preventDefault();
  const nama=qs('#nama').value.trim();
  const pesan=qs('#pesan').value.trim();
  if(!nama||!pesan) return;
  testimonials.unshift({nama, pesan}); saveTestimonials(testimonials); renderTestimonials(testimonials);
  e.target.reset(); alert('Terima kasih untuk testimoninya!');
});

qs('#feedbackForm').addEventListener('submit', e=>{
  e.preventDefault();
  const email=qs('#email').value.trim();
  const subjek=qs('#subjek').value.trim();
  const isi=qs('#isi').value.trim();
  console.log('Feedback (demo):',{email, subjek, isi});
  alert('Terima kasih atas masukan Anda!'); e.target.reset();
});

(function init(){ const saved=localStorage.getItem('cart'); if(saved) state.items=JSON.parse(saved); renderCart(); })();
