'use strict';

// Central business configuration for Shree Café, Motihari.
const CAFE = {
  name: 'Shree Café',
  phoneDisplay: '+91 86039 42561',
  phoneTel: '+918603942561',
  whatsapp: '918603942561',
  address: 'Ground Floor, SBI Building, near Pipal Chowk, State Bank of India, Raghunathpur, Motihari, Bihar 845401, India',
  hours: 'Daily, 11:00 AM – 9:30 PM',
  coordinates: { lat: 26.6405454, lng: 84.8957378 },
  serviceModes: ['Takeaway pickup at Shree Café', 'Dine-in at Shree Café']
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function makeWhatsAppUrl(message) {
  return `https://wa.me/${CAFE.whatsapp}?text=${encodeURIComponent(message)}`;
}
function openWhatsApp(message) {
  // The customer must press Send in WhatsApp; this site does not silently send messages.
  window.open(makeWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
}
function toast(message) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 3000);
}

// Mobile navigation.
const navToggle = $('#navToggle');
const mainNav = $('#mainNav');
navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  mainNav.classList.toggle('open', !isOpen);
});
$$('#mainNav a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
}));

// Reveal sections as they enter the viewport.
const revealTargets = $$('.hero-content, .hero-image-wrap, .story-grid, .menu-feature, .menu-extra, .moments-grid, .gallery-heading, .gallery-tile, .order-copy, .order-form, .visit-top, .visit-grid');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
} else {
  revealTargets.forEach(el => el.classList.add('visible'));
}

// Order list: menu buttons add verified favourites or a category request to the form.
const orderItems = $('#orderItems');
const cartBar = $('#orderCartBar');
const cartCount = $('#orderCartCount');
const cartHint = $('#orderCartHint');

function makeQuantityOptions(selected = '1') {
  return Array.from({ length: 10 }, (_, index) => {
    const value = String(index + 1);
    return `<option value="${value}" ${value === String(selected) ? 'selected' : ''}>Qty ${value}</option>`;
  }).join('');
}

function addOrderLine(name = '', quantity = '1') {
  if (!orderItems) return null;
  if (orderItems.children.length >= 12) {
    toast('You can add up to 12 different items in one order.');
    return null;
  }
  const row = document.createElement('div');
  row.className = 'order-line';
  row.innerHTML = `<input class="order-item-name" type="text" maxlength="80" placeholder="Type menu item name" aria-label="Food or drink name" /><select class="order-item-qty" aria-label="Quantity">${makeQuantityOptions(quantity)}</select><button class="remove-order-item" type="button" aria-label="Remove item" title="Remove item">×</button>`;
  $('.order-item-name', row).value = name;
  orderItems.appendChild(row);
  updateOrderBar();
  return row;
}

function getOrderLines() {
  if (!orderItems) return [];
  return $$('.order-line', orderItems).map(row => ({
    name: $('.order-item-name', row).value.trim(),
    quantity: Number($('.order-item-qty', row).value || 1)
  })).filter(item => item.name && Number.isInteger(item.quantity) && item.quantity > 0);
}

function updateOrderBar() {
  if (!cartBar || !orderItems) return;
  const lines = getOrderLines();
  const units = lines.reduce((sum, item) => sum + item.quantity, 0);
  cartBar.hidden = units === 0;
  if (cartCount) cartCount.textContent = `${units} ${units === 1 ? 'item' : 'items'} selected`;
  if (cartHint) cartHint.textContent = `${lines.length} different ${lines.length === 1 ? 'item' : 'items'} · price confirmed by café`;
}

function addMenuItemToOrder(itemName) {
  if (!orderItems || !itemName) return;
  const existing = $$('.order-line', orderItems).find(row => $('.order-item-name', row).value.trim().toLowerCase() === itemName.toLowerCase());
  if (existing) {
    const quantitySelect = $('.order-item-qty', existing);
    quantitySelect.value = String(Math.min(10, Number(quantitySelect.value || 1) + 1));
  } else {
    const firstBlank = $$('.order-line', orderItems).find(row => !$('.order-item-name', row).value.trim());
    if (firstBlank) {
      $('.order-item-name', firstBlank).value = itemName;
    } else {
      addOrderLine(itemName, '1');
    }
  }
  updateOrderBar();
  toast(`${itemName} added to your order.`);
}

$$('.add-menu-item').forEach(button => button.addEventListener('click', () => {
  addMenuItemToOrder(button.dataset.item || '');
}));
$$('.menu-category-add').forEach(button => button.addEventListener('click', () => {
  addMenuItemToOrder(button.dataset.item || '');
}));

$('#addOrderItem')?.addEventListener('click', () => {
  const row = addOrderLine();
  $('.order-item-name', row)?.focus();
});

orderItems?.addEventListener('click', event => {
  const remove = event.target.closest('.remove-order-item');
  if (!remove) return;
  const row = remove.closest('.order-line');
  if (orderItems.children.length === 1) {
    $('.order-item-name', row).value = '';
    $('.order-item-qty', row).value = '1';
  } else {
    row.remove();
  }
  updateOrderBar();
});
orderItems?.addEventListener('input', updateOrderBar);
orderItems?.addEventListener('change', updateOrderBar);
updateOrderBar();

// Order submission: every message goes directly to the café's WhatsApp.
$('#orderForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const orderMode = String(data.get('orderMode') || CAFE.serviceModes[0]);
  const note = String(data.get('message') || '').trim();
  const items = getOrderLines();
  const digits = phone.replace(/\D/g, '');

  if (name.length < 2) return toast('Please enter your name.');
  if (digits.length < 10 || digits.length > 13) return toast('Please enter a valid phone number.');
  if (!items.length) return toast('Please add at least one menu item before ordering.');
  if (!CAFE.serviceModes.includes(orderMode)) return toast('Please choose dine-in or takeaway pickup at the café.');

  const itemText = items.map((item, index) => `${index + 1}. ${item.name}\n   Quantity: ${item.quantity}\n   Price: Please confirm with Shree Café`).join('\n\n');
  const message = [
    `Hello ${CAFE.name}!`,
    '',
    'I would like to place an order at the café.',
    '',
    'CUSTOMER DETAILS',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Order preference: ${orderMode}`,
    '',
    'ORDER ITEMS',
    itemText,
    '',
    'Price / total: Please confirm the current menu price and final amount.',
    note ? `Special instructions: ${note}` : '',
    '',
    'This order is for dine-in or pickup at Shree Café, Motihari. No home delivery requested.',
    'Please confirm item availability and accept the order on WhatsApp.',
    '',
    'Thank you!'
  ].filter(Boolean).join('\n');

  const feedback = $('#orderFeedback');
  if (feedback) feedback.textContent = 'WhatsApp is opening with your full order. Please press Send in WhatsApp; Shree Café will confirm availability and prices.';
  openWhatsApp(message);
});

// Table reservation request — never presented as confirmed until the café replies.
const todayLocal = new Date();
const dateOffset = todayLocal.getTimezoneOffset();
const localDate = new Date(todayLocal.getTime() - dateOffset * 60000).toISOString().slice(0, 10);
$('#reserveDate')?.setAttribute('min', localDate);
$('#reservationForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const date = String(data.get('date') || '');
  const time = String(data.get('time') || '');
  const guests = String(data.get('guests') || '2');
  const note = String(data.get('note') || '').trim();
  const digits = phone.replace(/\D/g, '');
  if (name.length < 2) return toast('Please enter your name.');
  if (digits.length < 10 || digits.length > 13) return toast('Please enter a valid phone number.');
  if (date < localDate) return toast('Please choose today or a future date.');
  const message = [
    `Hello ${CAFE.name}!`, '', 'I would like to enquire about a table reservation.', '',
    `Name: ${name}`, `Phone: ${phone}`, `Preferred date: ${date}`, `Preferred time: ${time}`,
    `Number of guests: ${guests}`, note ? `Special request: ${note}` : '', '',
    'Please confirm whether a table is available. This is a request, not a confirmed booking.',
    'Thank you!'
  ].filter(Boolean).join('\n');
  $('#reservationFeedback').textContent = 'WhatsApp is opening with your reservation request. The booking is not confirmed until the café replies.';
  openWhatsApp(message);
});

// Gallery lightbox.
const lightbox = $('#lightbox');
const lightboxImage = $('#lightboxImage');
function closeLightbox() {
  lightbox?.classList.remove('open');
  lightbox?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  lightboxImage?.removeAttribute('src');
}
$$('.gallery-tile').forEach(tile => tile.addEventListener('click', () => {
  const image = tile.dataset.full || $('img', tile)?.src;
  if (!image || !lightbox || !lightboxImage) return;
  lightboxImage.src = image;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}));
$('#lightboxClose')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && lightbox?.classList.contains('open')) closeLightbox(); });

// Footer year.
const year = $('#year');
if (year) year.textContent = new Date().getFullYear();

// Image fallback: show the styled frame instead of a broken-image icon.
$$('img').forEach(img => img.addEventListener('error', () => {
  img.style.display = 'none';
  const frame = img.closest('.image-frame');
  if (frame) frame.classList.add('image-unavailable');
}, { once: true }));
