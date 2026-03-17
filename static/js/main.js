/* ================= GLOBAL HELPERS ================= */

window.moveCert    = function(d) { console.log('[CERT] not yet initialized'); };
window.moveGallery = function(d) { console.log('[GALLERY] not yet initialized'); };
window.moveAwards  = function(d) { console.log('[AWARDS] not yet initialized'); };

/* ---- Image Modal ---- */
window.openImageModal = function(src) {
  const modal = document.getElementById('imageModal');
  const img   = document.getElementById('modalImage');
  if (!modal || !img) return;
  img.src = src;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
};
window.closeImageModal = function() {
  const modal = document.getElementById('imageModal');
  if (!modal) return;
  modal.classList.remove('show');
  document.body.style.overflow = 'auto';
};

/* ---- Cert Modal ---- */
window.openCertModal = function(card) {
  if (!card) return;
  const img      = card.querySelector('img');
  const modalImg = document.getElementById('certModalImg');
  const modal    = document.getElementById('certModal');
  if (!img || !modal || !modalImg) return;
  modalImg.src = img.src;
  modal.classList.add('active');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};
window.closeCertModal = function() {
  const modal = document.getElementById('certModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.style.display = 'none';
  document.body.style.overflow = '';
};

/* ---- Gallery Modal ---- */
window.openGalleryModal = function(img) {
  if (!img) return;
  const modalImg = document.getElementById('galleryModalImg');
  const modal    = document.getElementById('galleryModal');
  if (!modal || !modalImg) return;
  modalImg.src = img.src;
  modal.classList.add('active');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};
window.closeGallery = function() {
  const modal = document.getElementById('galleryModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.style.display = 'none';
  document.body.style.overflow = '';
};

/* ---- Contact Form ---- */
window.submitContactForm = function(e) {
  e.preventDefault();
  fetch('/submit_contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name:    e.target.name.value,
      email:   e.target.email.value,
      phone:   e.target.countryCode.value + ' ' + e.target.phone.value,
      subject: e.target.subject.value,
      message: e.target.message.value
    })
  })
  .then(r => r.json())
  .then(d => {
    alert(d.status === 'success' ? 'Message sent!' : 'Error!');
    if (d.status === 'success') e.target.reset();
  })
  .catch(() => alert('Server error'));
};

/* ---- Chatbot ---- */
window.openChatbot = function() {
  window.open('https://chatbot-e99e.onrender.com', 'chatbot', 'width=450,height=650');
};

/* ================= GLOBAL KEYBOARD HANDLER ================= */
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  window.closeImageModal?.();
  window.closeGallery?.();
  window.closeCertModal?.();
});

/* ================= DOM READY ================= */
document.addEventListener('DOMContentLoaded', function() {

  /* ----- NAV DROPDOWN (MOBILE) ----- */
  const dropBtn  = document.querySelector('.dropbtn');
  const dropdown = document.querySelector('.dropdown-menu');
  if (dropBtn && dropdown) {
    dropBtn.addEventListener('click', (e) => {
      if (window.innerWidth < 768) {
        e.preventDefault();
        dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
      }
    });
  }

  /* ----- BACKGROUND DRIFT ----- */
  window.addEventListener('scroll', () => {
    document.body.style.backgroundPosition = `center ${-(window.scrollY * 0.04)}px`;
  });

  /* ----- NAVBAR HIDE ON SCROLL DOWN ----- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      navbar.classList.toggle('nav-hidden', y > lastY && y > 140);
      lastY = y;
    }, { passive: true });
  }

  /* ----- HERO VIDEO AUTOPLAY ----- */
  const heroVideo = document.querySelector('.hero video');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.play().catch(() => {});
  }

  /* ----- MOBILE MENU TOGGLE ----- */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks   = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
  }

  /* ----- PRODUCT SLIDER + FLIP ----- */
  const productSlider = document.querySelector('.products-wrapper');
  if (productSlider) {
    const cards  = productSlider.querySelectorAll('.product-card');
    const moveBy = 2;
    let   pIndex = 0;

    function pStep() {
      const gap = parseInt(getComputedStyle(productSlider).gap) || 28;
      return cards[0].offsetWidth + gap;
    }
    function pMax()    { return Math.max(0, cards.length - 4); }
    function pUpdate() { productSlider.style.transform = `translateX(-${pIndex * pStep()}px)`; }

    window.slidePage = function(dir) {
      pIndex = Math.max(0, Math.min(pIndex + dir * moveBy, pMax()));
      pUpdate();
    };

    window.addEventListener('resize', () => { pIndex = 0; pUpdate(); });
    pUpdate();

    /* Flip cards */
    const flipCards = productSlider.querySelectorAll('.has-flip');
    flipCards.forEach(card => {
      ['click', 'touchend'].forEach(evt => {
        card.addEventListener(evt, e => {
          if (e.target.closest('a')) return;
          e.stopPropagation();
          flipCards.forEach(c => { if (c !== card) c.classList.remove('flipped'); });
          card.classList.toggle('flipped');
        });
      });
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.has-flip'))
        flipCards.forEach(c => c.classList.remove('flipped'));
    });
  }

  /* ----- GSAP ANIMATIONS ----- */
  const HAS_GSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  if (HAS_GSAP) gsap.registerPlugin(ScrollTrigger);
  const IS_HOME = document.body.classList.contains('home-page');

  if (HAS_GSAP && IS_HOME) {
    gsap.to('.navbar', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    gsap.to('.logo-container img, .logo-container span', {
      opacity: 1, y: 0, stagger: 0.15, duration: 0.8, delay: 0.3, ease: 'power3.out'
    });
    gsap.fromTo('.nav-links a',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, delay: 0.6, ease: 'power2.out' }
    );
    gsap.fromTo('.team-card',
      { opacity: 0, y: 40 },
      { scrollTrigger: { trigger: '#team', start: 'top 80%', once: true },
        opacity: 1, y: 0, stagger: 0.2, duration: 0.9, ease: 'power3.out' }
    );
    ScrollTrigger.create({
      trigger: '#why-us', start: 'top 85%', once: true,
      onEnter: () => gsap.fromTo('#why-us .video-mask',
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power3.out' }
      )
    });
  }

  if (HAS_GSAP && document.querySelector('.location-page')) {
    gsap.to('.loc-title', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' });
    gsap.to('.loc-sub',   { opacity: 1, y: 0, duration: 1.2, delay: 0.2, ease: 'power3.out' });
    gsap.fromTo('.map-box',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.3, delay: 0.35, ease: 'power3.out' }
    );
  }

  if (HAS_GSAP && document.querySelector('.contact-details-block')) {
    gsap.fromTo('.detail-item',
      { opacity: 0, y: 30 },
      { scrollTrigger: { trigger: '.contact-details-block', start: 'top 80%', once: true },
        opacity: 1, y: 0, duration: 0.8, stagger: 0.25, ease: 'power3.out' }
    );
  }

  /* ================= SLIDERS (init after full page load) ================= */
  function initClickHandlers() {
    // Cert cards
    document.querySelectorAll('.cert-card').forEach(card => {
      card.addEventListener('click', function(e) {
        e.stopPropagation();
        window.openCertModal(this);
      }, true);
    });

    // Gallery images
    document.querySelectorAll('.gallery-slider img').forEach(img => {
      img.addEventListener('click', function(e) {
        e.stopPropagation();
        window.openGalleryModal(this);
      }, true);
    });

    // Modal backdrop close
    ['certModal', 'galleryModal'].forEach(id => {
      const m = document.getElementById(id);
      if (m) m.addEventListener('click', e => {
        if (e.target === m) id === 'certModal' ? window.closeCertModal() : window.closeGallery();
      });
    });
  }

  function initCertSlider() {
    const slider   = document.getElementById('certSlider');
    const leftBtn  = document.querySelector('.cert-side-btn.left');
    const rightBtn = document.querySelector('.cert-side-btn.right');
    if (!slider || !leftBtn || !rightBtn) return;

    const cards = slider.querySelectorAll('.cert-card');
    if (!cards.length) return;

    let currentIndex = 0;

    function getVisibleCards() {
      return window.innerWidth <= 600 ? 1 : window.innerWidth <= 1000 ? 2 : 3;
    }

    function getStep() {
      const box = document.querySelector('.cert-grid-box');
      const gap = box ? parseFloat(getComputedStyle(box).gap) || 24 : 24;
      const w   = cards[0].getBoundingClientRect().width || cards[0].offsetWidth || 320;
      return w + gap;
    }

    function update() {
      const maxIndex = Math.max(0, cards.length - getVisibleCards());
      currentIndex = Math.min(currentIndex, maxIndex);
      slider.style.transform = `translateX(-${currentIndex * getStep()}px)`;
      leftBtn.disabled  = currentIndex === 0;
      rightBtn.disabled = currentIndex >= maxIndex;
    }

    window.moveCert = function(dir) {
      const maxIndex = Math.max(0, cards.length - getVisibleCards());
      currentIndex = Math.max(0, Math.min(currentIndex + dir, maxIndex));
      update();
    };

    window.addEventListener('resize', () => { currentIndex = 0; update(); });
    update();
  }

  function initAwardsSlider() {
    const slider   = document.getElementById('awardsSlider');
    const leftBtn  = document.querySelector('.awards-btn.left');
    const rightBtn = document.querySelector('.awards-btn.right');
    if (!slider || !leftBtn || !rightBtn) return;

    const images = slider.querySelectorAll('img');
    if (!images.length) return;

    let currentIndex = 0;

    function getVisible() {
      return window.innerWidth <= 580 ? 1 : window.innerWidth <= 900 ? 2 : 3;
    }

    function getStep() {
      const gap = window.innerWidth <= 580 ? 12 : 20;
      const w   = images[0].getBoundingClientRect().width || images[0].offsetWidth || 320;
      return w + gap;
    }

    function update() {
      const maxIndex = Math.max(0, images.length - getVisible());
      currentIndex = Math.min(currentIndex, maxIndex);
      slider.style.transform = `translateX(-${currentIndex * getStep()}px)`;
      leftBtn.disabled  = currentIndex === 0;
      rightBtn.disabled = currentIndex >= maxIndex;
    }

    window.moveAwards = function(dir) {
      const maxIndex = Math.max(0, images.length - getVisible());
      currentIndex = Math.max(0, Math.min(currentIndex + dir, maxIndex));
      update();
    };

    window.addEventListener('resize', () => { currentIndex = 0; update(); });
    update();
  }

  function initGallerySlider() {
    const slider   = document.getElementById('gallerySlider');
    const leftBtn  = document.querySelector('.gallery-btn.left');
    const rightBtn = document.querySelector('.gallery-btn.right');
    if (!slider || !leftBtn || !rightBtn) return;

    const images = slider.querySelectorAll('img');
    if (!images.length) return;

    let currentIndex = 0;

    function getVisible() {
      return window.innerWidth <= 580 ? 1 : window.innerWidth <= 900 ? 2 : 3;
    }

    function getStep() {
      const gap = window.innerWidth <= 580 ? 10 : 18;
      const w   = images[0].getBoundingClientRect().width || images[0].offsetWidth || 280;
      return w + gap;
    }

    function update() {
      const maxIndex = Math.max(0, images.length - getVisible());
      currentIndex = Math.min(currentIndex, maxIndex);
      slider.style.transform = `translateX(-${currentIndex * getStep()}px)`;
      leftBtn.disabled  = currentIndex === 0;
      rightBtn.disabled = currentIndex >= maxIndex;
    }

    window.moveGallery = function(dir) {
      const maxIndex = Math.max(0, images.length - getVisible());
      currentIndex = Math.max(0, Math.min(currentIndex + dir, maxIndex));
      update();
    };

    // FIX: Gallery was missing resize listener
    window.addEventListener('resize', () => { currentIndex = 0; update(); });
    update();
  }

  // Use 'load' event to guarantee images are sized before reading offsetWidth
  if (document.readyState === 'complete') {
    // 'load' already fired (e.g. script is deferred) — run immediately
    initCertSlider();
    initAwardsSlider();
    initGallerySlider();
    initClickHandlers();
  } else {
    window.addEventListener('load', () => {
      initCertSlider();
      initAwardsSlider();
      initGallerySlider();
      initClickHandlers();
    });
  }

}); // END DOMContentLoaded 
