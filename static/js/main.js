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
  if (!navbar) {
    console.log("❌ navbar not found");
    return;
  }

  console.log("✅ navbar scroll active");

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

  const visible = 4;   // show 4 cards
  const moveBy  = 3;   // move 3 per click

  let index = 0;

function moveGallery(direction) {

  const slider = document.getElementById("gallerySlider");
  const images = slider.querySelectorAll("img");

  const imageWidth = 360;
  const visibleImages = 2;

  index += direction;

  if (index < 0) {
    index = 0;
  }

  if (index > images.length - visibleImages) {
    index = images.length - visibleImages;
  }

  slider.style.transform = `translateX(-${index * imageWidth}px)`;
}
  /* ===== button click ===== */

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

      // allow links on back side to work
      if (e.target.closest("a")) return;

      e.stopPropagation();

      // close others
      flipCards.forEach(c => {
        if (c !== card) c.classList.remove("flipped");
      });

      // toggle this one
      card.classList.toggle("flipped");
    });

  });

  // click outside → close all flips
  document.addEventListener("click", e => {
    if (!e.target.closest(".has-flip")) {
      flipCards.forEach(c => c.classList.remove("flipped"));
    }
  });

})();
/* ===== CERT SLIDER — FINAL ===== */

(function(){

  const slider = document.getElementById("certSlider");
  if (!slider) return;

  const cards = slider.querySelectorAll(".cert-card");
  if (!cards.length) return;

  let index = 0;

  function step(){
    const gap = parseInt(getComputedStyle(slider).gap) || 28;
    return cards[0].offsetWidth + gap;
  }

  function visible(){
    const viewport = slider.parentElement.offsetWidth;
    return Math.floor(viewport / step());
  }

  function maxIndex(){
    return Math.max(0, cards.length - visible());
  }

  function update(){
    slider.style.transform =
      `translateX(-${index * step()}px)`;

    document.querySelectorAll(".cert-side-btn.left")
      .forEach(b => b.disabled = index === 0);

    document.querySelectorAll(".cert-side-btn.right")
      .forEach(b => b.disabled = index >= maxIndex());
  }

  window.moveCert = function(dir){
    index += dir;

    if (index < 0) index = 0;
    if (index > maxIndex()) index = maxIndex();

    update();
  };

  window.addEventListener("resize", update);

  update();

})();

/* ================= CERTIFICATE MODAL — UNIVERSAL ================= */

const certModal = document.getElementById("certModal");
const certModalImg = document.getElementById("certModalImg");

window.openCertModal = function(card){
  if (!certModal || !certModalImg) return;

  const img = card.querySelector("img");
  if (!img) return;

  certModalImg.src = img.src;
  certModal.classList.add("active");
  document.body.style.overflow = "hidden";
};

window.closeCertModal = function(){
  if (!certModal) return;
  certModal.classList.remove("active");
  document.body.style.overflow = "";
};

/* optional arrows — safe even if not used */
window.modalNext = function(){};
window.modalPrev = function(){};

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

  gsap.to(".loc-title", {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power3.out"
  });

  gsap.to(".loc-sub", {
    opacity: 1,
    y: 0,
    duration: 1.2,
    delay: 0.2,
    ease: "power3.out"
  });

  gsap.from(".map-box", {
    opacity: 0,
    y: 40,
    duration: 1.3,
    delay: 0.35,
    ease: "power3.out"
  });

}
/* ===== CONTACT DETAILS REVEAL ===== */

if (HAS_GSAP && document.querySelector(".contact-details-block")) {

  gsap.to(".detail-item", {
    scrollTrigger: {
      trigger: ".contact-details-block",
      start: "top 80%",
      once: true
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.25,
    ease: "power3.out"
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
if (HAS_GSAP && IS_HOME) {
  ScrollTrigger.create({
    trigger:"#why-us",
    start:"top 85%",
    once:true,
    onEnter:()=> gsap.to("#why-us .video-mask",
      {opacity:1,y:0,scale:1,duration:1.4})
  });
}
}
}
);
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

/* cert click */
function openCertModal(card) {
  const img = card.querySelector("img");
  openImageModal(img.src);
}

/* gallery click */
function openGalleryModal(img) {
  openImageModal(img.src);
}

/* ESC close */
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeImageModal();
});
/* ================= GALLERY SLIDER ================= */

const gallerySlider = document.getElementById("gallerySlider");
let galleryIndex = 0;

function moveGallery(direction){
  const imgWidth = gallerySlider.querySelector("img").offsetWidth + 28;
  const total = gallerySlider.querySelectorAll("img").length;

  const visible = window.innerWidth < 600 ? 1 :
                  window.innerWidth < 900 ? 2 : 3;

  const maxIndex = total - visible;

  galleryIndex += direction;

  if(galleryIndex < 0) galleryIndex = 0;
  if(galleryIndex > maxIndex) galleryIndex = maxIndex;

  gallerySlider.style.transform =
    `translateX(-${galleryIndex * imgWidth}px)`;
}

/* ================= GALLERY MODAL ================= */

function openGalleryModal(img){
  document.getElementById("galleryModalImg").src = img.src;
  document.getElementById("galleryModal").classList.add("active");
}

function closeGallery(){
  document.getElementById("galleryModal").classList.remove("active");
}/* ================= AWARDS SLIDER ================= */

let awardsIndex = 0;

function moveAwards(direction){

  const slider = document.getElementById("awardsSlider");
  if(!slider) return;

  const images = slider.querySelectorAll("img");

  const visible = 2;
  const maxIndex = images.length - visible;

  awardsIndex += direction * visible;

  if(awardsIndex < 0) awardsIndex = 0;
  if(awardsIndex > maxIndex) awardsIndex = maxIndex;

  slider.style.transform = `translateX(-${awardsIndex * 50}%)`;

}