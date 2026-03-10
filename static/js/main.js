document.addEventListener("DOMContentLoaded", () => {

/* ================= SAFE GSAP CHECK ================= */
const HAS_GSAP = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
if (HAS_GSAP) gsap.registerPlugin(ScrollTrigger);

const IS_HOME = document.body.classList.contains("home-page");

/* ================= NAV DROPDOWN (MOBILE) ================= */
const dropBtn = document.querySelector(".dropbtn");
const dropdown = document.querySelector(".dropdown-menu");

if (dropBtn && dropdown) {
  dropBtn.addEventListener("click", (e) => {
    if (window.innerWidth < 768) {
      e.preventDefault();
      dropdown.style.display =
        dropdown.style.display === "flex" ? "none" : "flex";
    }
  });
}

/* ================= BACKGROUND DRIFT ================= */
window.addEventListener("scroll", ()=>{
  const offset = window.scrollY * 0.04;
  document.body.style.backgroundPosition = `center ${-offset}px`;
});

/* ===== HARD NAVBAR SCROLL CONTROLLER ===== */
window.addEventListener("load", function () {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  let lastY = window.scrollY;

  window.addEventListener("scroll", function () {
    const y = window.scrollY;
    if (y > lastY && y > 140) {
      navbar.classList.add("nav-hidden");
    } else {
      navbar.classList.remove("nav-hidden");
    }
    lastY = y;
  }, { passive: true });
});

/* ================= HERO VIDEO AUTOPLAY ================= */
window.addEventListener("load", () => {
  const heroVideo = document.querySelector(".hero video");
  if(heroVideo){
    heroVideo.muted = true;
    heroVideo.play().catch(()=>{});
  }
});

/* ================= MOBILE MENU ================= */
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });
}

/* ===================================== */
/* PRODUCT SLIDER + FLIP — FINAL STABLE  */
/* ===================================== */

(function(){
  const slider = document.getElementById("slider");
  if (!slider) return;

  const cards = slider.querySelectorAll(".product-card");
  const visible = 4;
  const moveBy  = 2;
  let index = 0;

  function step(){
    const gap = parseInt(getComputedStyle(slider).gap) || 28;
    return cards[0].offsetWidth + gap;
  }

  function maxIndex(){
    return Math.max(0, cards.length - visible);
  }

  function updateSlider(){
    slider.style.transform = `translateX(-${index * step()}px)`;
  }

  window.slidePage = function(dir) {
    index += dir * moveBy;
    if (index < 0) index = 0;
    if (index > maxIndex()) index = maxIndex();
    updateSlider();
  };

  window.addEventListener("resize", () => {
    index = 0;
    updateSlider();
  });

  updateSlider();

  /* ================= FLIP LOGIC ================= */
  const flipCards = slider.querySelectorAll(".has-flip");

  flipCards.forEach(card => {
    card.addEventListener("click", e => {
      if (e.target.closest("a")) return;
      e.stopPropagation();
      flipCards.forEach(c => {
        if (c !== card) c.classList.remove("flipped");
      });
      card.classList.toggle("flipped");
    });
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".has-flip")) {
      flipCards.forEach(c => c.classList.remove("flipped"));
    }
  });

})();

/* ===== CERT SLIDER — FIXED ===== */
(function(){
  const slider = document.getElementById("certSlider");
  if (!slider) return;                        /* ✅ FIXED: was "if (slider) return" — wrong! */

  const cards = slider.querySelectorAll(".cert-card");
  if (!cards.length) return;

  let index = 0;

  function step(){
    const gap = parseInt(getComputedStyle(slider).gap) || 28;
    return cards[0].offsetWidth + gap;
  }

  function visible(){
    const viewport = slider.parentElement.offsetWidth;
    const s = step();
    return s > 0 ? Math.max(1, Math.floor(viewport / s)) : 1;
  }

  function maxIndex(){
    return Math.max(0, cards.length - visible());
  }

  function update(){
    slider.style.transition = "transform 0.4s ease";
    slider.style.transform = `translateX(-${index * step()}px)`;
    document.querySelectorAll(".cert-side-btn.left")
      .forEach(b => {
        b.disabled = index === 0;
        b.style.opacity = index === 0 ? "0.3" : "1";
      });
    document.querySelectorAll(".cert-side-btn.right")
      .forEach(b => {
        b.disabled = index >= maxIndex();
        b.style.opacity = index >= maxIndex() ? "0.3" : "1";
      });
  }

  window.moveCert = function(dir){
    index += dir;
    if (index < 0) index = 0;
    if (index > maxIndex()) index = maxIndex();
    update();
  };

  window.addEventListener("resize", () => {
    index = 0;
    update();
  });
  update();
})();

/* ================= CERTIFICATE MODAL — UNIVERSAL ================= */
window.openCertModal = function(card) {
  const img = card.querySelector("img");
  if (!img) return;
  const modal = document.getElementById("certModal");
  const modalImg = document.getElementById("certModalImg");
  if (!modal || !modalImg) return;
  modalImg.src = img.src;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
};

window.closeCertModal = function() {
  const modal = document.getElementById("certModal");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
};

/* ================= CONTACT FORM ================= */
window.submitContactForm = function(e){
  e.preventDefault();
  fetch("/submit_contact",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      name:e.target.name.value,
      email:e.target.email.value,
      phone:e.target.countryCode.value + " " + e.target.phone.value,
      subject:e.target.subject.value,
      message:e.target.message.value
    })
  })
  .then(r=>r.json())
  .then(d=>{
    alert(d.status==="success" ? "Message sent!" : "Error!");
    if(d.status==="success") e.target.reset();
  })
  .catch(()=>alert("Server error"));
};

/* ===== LOCATION PAGE REVEAL ===== */
if (document.querySelector(".location-page")) {
  gsap.to(".loc-title", { opacity:1, y:0, duration:1.2, ease:"power3.out" });
  gsap.to(".loc-sub",   { opacity:1, y:0, duration:1.2, delay:0.2, ease:"power3.out" });
  gsap.from(".map-box", { opacity:0, y:40, duration:1.3, delay:0.35, ease:"power3.out" });
}

/* ===== CONTACT DETAILS REVEAL ===== */
if (HAS_GSAP && document.querySelector(".contact-details-block")) {
  gsap.to(".detail-item", {
    scrollTrigger: { trigger:".contact-details-block", start:"top 80%", once:true },
    opacity:1, y:0, duration:0.8, stagger:0.25, ease:"power3.out"
  });
}

/* ================= GSAP ANIMATIONS ================= */
if (HAS_GSAP && IS_HOME) {
  gsap.to(".navbar",{opacity:1,y:0,duration:1});
  gsap.to(".logo-container img, .logo-container span",
    {opacity:1,y:0,stagger:.15,duration:.8,delay:.3});
  gsap.fromTo(".nav-links a",
    {opacity:0,y:10},
    {opacity:1,y:0,stagger:.08,duration:.6,delay:.6});
  gsap.to(".team-card",{
    scrollTrigger:{trigger:"#team",start:"top 80%",once:true},
    opacity:1,y:0,stagger:.2
  });
  ScrollTrigger.create({
    trigger:"#why-us",
    start:"top 85%",
    once:true,
    onEnter:()=> gsap.to("#why-us .video-mask",
      {opacity:1,y:0,scale:1,duration:1.4})
  });
}

});

/* ===== MODAL IMAGE VIEWER ===== */
function openImageModal(src) {
  document.getElementById("modalImage").src = src;
  document.getElementById("imageModal").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeImageModal() {
  document.getElementById("imageModal").classList.remove("show");
  document.body.style.overflow = "auto";
}

function openCertModal(card) {
  const img = card.querySelector("img");
  openImageModal(img.src);
}

function openGalleryModal(img) {
  document.getElementById("galleryModalImg").src = img.src;
  document.getElementById("galleryModal").classList.add("active");
}

function closeGallery() {
  document.getElementById("galleryModal").classList.remove("active");
}

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeImageModal();
});

/* ================= GALLERY SLIDER — MOBILE FIXED ================= */

let galleryIndex = 0;

window.moveGallery = function(direction) {
  const slider = document.getElementById("gallerySlider");
  if (!slider) return;
  const imgs  = slider.querySelectorAll("img");
  const total = imgs.length;
  if (!total) return;

  /* mobile shows 1 image, desktop shows 2 */
  const isMobile = window.innerWidth <= 600;
  const gap      = isMobile ? 12 : 20;
  const perPage  = isMobile ? 1 : 2;
  const maxIdx   = total - perPage;

  galleryIndex += direction;
  if (galleryIndex < 0)      galleryIndex = 0;
  if (galleryIndex > maxIdx) galleryIndex = maxIdx;

  const imgWidth = imgs[0].offsetWidth;
  slider.style.transition = "transform 0.45s ease";
  slider.style.transform  = `translateX(-${galleryIndex * (imgWidth + gap)}px)`;
};

window.addEventListener("resize", () => {
  galleryIndex = 0;
  const slider = document.getElementById("gallerySlider");
  if (slider) {
    slider.style.transition = "none";
    slider.style.transform  = "translateX(0)";
  }
});

/* ================= GALLERY MODAL ================= */

window.openGalleryModal = function(img) {
  document.getElementById("galleryModalImg").src = img.src;
  document.getElementById("galleryModal").classList.add("active");
};

window.closeGallery = function() {
  document.getElementById("galleryModal").classList.remove("active");
};

/* ================= CHATBOT ================= */

window.openChatbot = function() {
  window.open(
    "https://chatbot-e99e.onrender.com",
    "chatbot",
    "width=450,height=650"
  );
};

/* ================= AWARDS SLIDER ================= */

let awardsIndex = 0;

window.moveAwards = function(direction) {

  const slider =
  document.getElementById("awardsSlider");
  if (!slider) return;
  const images   = slider.querySelectorAll("img");
  const maxIndex = images.length - 2;

  awardsIndex += direction * 2;

  if (awardsIndex < 0)        awardsIndex = 0;
  if (awardsIndex > maxIndex) awardsIndex = maxIndex;
  const imgWidth = images[0].offsetWidth;
  slider.style.transform = `translateX(-${awardsIndex * (imgWidth + 24)}px)`;
};

/* ================= CERT MODAL ================= */

window.openCertModal = function(card) {
  const img = card.querySelector("img");
  if (!img) return;
  const modal = document.getElementById("certModal");
  const modalImg = document.getElementById("certModalImg");
  if (!modal || !modalImg) return;
  modalImg.src = img.src;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
};

window.closeCertModal = function() {
  const modal = document.getElementById("certModal");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
};

/* ================= CONTACT FORM ================= */

window.submitContactForm = function(e) {
  e.preventDefault();
  fetch("/submit_contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name:    e.target.name.value,
      email:   e.target.email.value,
      phone:   e.target.countryCode.value + " " + e.target.phone.value,
      subject: e.target.subject.value,
      message: e.target.message.value
    })
  })
  .then(r => r.json())
  .then(d => {
    alert(d.status === "success" ? "Message sent!" : "Error!");
    if (d.status === "success") e.target.reset();
  })
  .catch(() => alert("Server error"));
};

/* ================= IMAGE MODAL ================= */

window.openImageModal = function(src) {
  const modal = document.getElementById("imageModal");
  const img   = document.getElementById("modalImage");
  if (!modal || !img) return;
  img.src = src;
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
};

window.closeImageModal = function() {
  const modal = document.getElementById("imageModal");
  if (!modal) return;
  modal.classList.remove("show");
  document.body.style.overflow = "auto";
};

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") window.closeImageModal();
});

/* ================= DOM READY ================= */

document.addEventListener("DOMContentLoaded", function() {

  const HAS_GSAP = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  if (HAS_GSAP) gsap.registerPlugin(ScrollTrigger);
  const IS_HOME = document.body.classList.contains("home-page");

  /* NAV DROPDOWN MOBILE */
  const dropBtn  = document.querySelector(".dropbtn");
  const dropdown = document.querySelector(".dropdown-menu");
  if (dropBtn && dropdown) {
    dropBtn.addEventListener("click", (e) => {
      if (window.innerWidth < 768) {
        e.preventDefault();
        dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
      }
    });
  }

  /* BACKGROUND DRIFT */
  window.addEventListener("scroll", () => {
    document.body.style.backgroundPosition = `center ${-(window.scrollY * 0.04)}px`;
  });

  /* NAVBAR HIDE ON SCROLL */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y > lastY && y > 140) navbar.classList.add("nav-hidden");
      else navbar.classList.remove("nav-hidden");
      lastY = y;
    }, { passive: true });
  }

  /* HERO VIDEO */
  const heroVideo = document.querySelector(".hero video");
  if (heroVideo) { heroVideo.muted = true; heroVideo.play().catch(() => {}); }

  /* MOBILE MENU */
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks   = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => navLinks.classList.toggle("active"));
    document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", () => navLinks.classList.remove("active"));
    });
  }

  /* PRODUCT SLIDER */
  const productSlider = document.getElementById("slider");
  if (productSlider) {
    const cards  = productSlider.querySelectorAll(".product-card");
    const moveBy = 2;
    let   pIndex = 0;

    function pStep() {
      const gap = parseInt(getComputedStyle(productSlider).gap) || 28;
      return cards[0].offsetWidth + gap;
    }
    function pMax() { return Math.max(0, cards.length - 4); }
    function pUpdate() { productSlider.style.transform = `translateX(-${pIndex * pStep()}px)`; }

    window.slidePage = function(dir) {
      pIndex += dir * moveBy;
      if (pIndex < 0)       pIndex = 0;
      if (pIndex > pMax())  pIndex = pMax();
      pUpdate();
    };

    window.addEventListener("resize", () => { pIndex = 0; pUpdate(); });
    pUpdate();

    /* FLIP */
    const flipCards = productSlider.querySelectorAll(".has-flip");
    flipCards.forEach(card => {
      card.addEventListener("click", e => {
        if (e.target.closest("a")) return;
        e.stopPropagation();
        flipCards.forEach(c => { if (c !== card) c.classList.remove("flipped"); });
        card.classList.toggle("flipped");
      });
    });
    document.addEventListener("click", e => {
      if (!e.target.closest(".has-flip"))
        flipCards.forEach(c => c.classList.remove("flipped"));
    });
  }

  /* CERT SLIDER — FIXED */
  const certSlider = document.getElementById("certSlider");
  if (certSlider) {
    const certCards = certSlider.querySelectorAll(".cert-card");
    if (certCards.length) {
      let cIndex = 0;

      function cStep() {
        const gap = parseInt(getComputedStyle(certSlider).gap) || 28;
        return certCards[0].offsetWidth + gap;
      }
      function cVisible() {
        const s = cStep();
        return s > 0 ? Math.max(1, Math.floor(certSlider.parentElement.offsetWidth / s)) : 1;
      }
      function cMax()     { return Math.max(0, certCards.length - cVisible()); }
      function cUpdate()  {
        certSlider.style.transition = "transform 0.4s ease";
        certSlider.style.transform = `translateX(-${cIndex * cStep()}px)`;
        document.querySelectorAll(".cert-side-btn.left").forEach(b => {
          b.disabled = cIndex === 0;
          b.style.opacity = cIndex === 0 ? "0.3" : "1";
        });
        document.querySelectorAll(".cert-side-btn.right").forEach(b => {
          b.disabled = cIndex >= cMax();
          b.style.opacity = cIndex >= cMax() ? "0.3" : "1";
        });
      }

      window.moveCert = function(dir) {
        cIndex += dir;
        if (cIndex < 0)       cIndex = 0;
        if (cIndex > cMax())  cIndex = cMax();
        cUpdate();
      };

      window.addEventListener("resize", () => { cIndex = 0; cUpdate(); });
      cUpdate();
    }
  }

  /* GSAP */
  if (HAS_GSAP && IS_HOME) {
    gsap.to(".navbar", { opacity:1, y:0, duration:1 });
    gsap.to(".logo-container img, .logo-container span", { opacity:1, y:0, stagger:.15, duration:.8, delay:.3 });
    gsap.fromTo(".nav-links a", { opacity:0, y:10 }, { opacity:1, y:0, stagger:.08, duration:.6, delay:.6 });
    gsap.to(".team-card", { scrollTrigger:{ trigger:"#team", start:"top 80%", once:true }, opacity:1, y:0, stagger:.2 });
    ScrollTrigger.create({
      trigger: "#why-us", start: "top 85%", once: true,
      onEnter: () => gsap.to("#why-us .video-mask", { opacity:1, y:0, scale:1, duration:1.4 })
    });
  }

  if (HAS_GSAP && document.querySelector(".contact-details-block")) {
    gsap.to(".detail-item", {
      scrollTrigger: { trigger:".contact-details-block", start:"top 80%", once:true },
      opacity:1, y:0, duration:0.8, stagger:0.25, ease:"power3.out"
    });
  }

});