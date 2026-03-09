console.log("JS LOADED");

/* ================= CERTIFICATE SLIDER ================= */

let certIndex = 0;

function moveCert(direction){

  const slider = document.getElementById("certSlider");
  if(!slider) return;

  const cards = slider.querySelectorAll(".cert-card");
  const cardWidth = cards[0].offsetWidth + 40;

  const visible = 2;
  const maxIndex = cards.length - visible;

  certIndex += direction;

  if(certIndex < 0) certIndex = 0;
  if(certIndex > maxIndex) certIndex = maxIndex;

  slider.style.transform =
    `translateX(-${certIndex * cardWidth}px)`;
}


/* ================= CERTIFICATE CLICK ================= */

function openCertModal(card){

  const img = card.querySelector("img");

  const modal = document.getElementById("galleryModal");
  const modalImg = document.getElementById("galleryModalImg");

  modalImg.src = img.src;
  modal.style.display = "flex";

}


/* ================= CLOSE MODAL ================= */

function closeGallery(){

  const modal = document.getElementById("galleryModal");

  modal.style.display = "none";

}


/* ================= GALLERY SLIDER ================= */

let galleryIndex = 0;

function moveGallery(direction){

  const slider = document.getElementById("gallerySlider");
  if(!slider) return;

  const images = slider.querySelectorAll("img");
  if(images.length === 0) return;

  const imageWidth = 340;
  const gap = 28;
  const itemWidth = imageWidth + gap;

  const visible = 2;
  const maxIndex = Math.max(0, images.length - visible);

  galleryIndex += direction;

  if(galleryIndex < 0) galleryIndex = 0;
  if(galleryIndex > maxIndex) galleryIndex = maxIndex;

  console.log(`Gallery moved: index=${galleryIndex}, transform=-${galleryIndex * itemWidth}px`);

  slider.style.transform = `translateX(-${galleryIndex * itemWidth}px)`;

}


/* ================= GALLERY CLICK ================= */

function openGalleryModal(img){

  const modal = document.getElementById("galleryModal");
  const modalImg = document.getElementById("galleryModalImg");

  modalImg.src = img.src;
  modal.style.display = "flex";

}


/* ================= PRODUCT MODAL ================= */

function openProductModal(img,title,desc,link){

  document.getElementById("productModal").style.display="flex";

  document.getElementById("modalImg").src=img;
  document.getElementById("modalTitle").innerText=title;
  document.getElementById("modalDesc").innerText=desc;
  document.getElementById("modalLink").href=link;

}

function closeProductModal(){
  document.getElementById("productModal").style.display="none";
}


/* ================= CHATBOT BUTTON CREATE ================= */

document.body.insertAdjacentHTML("beforeend", `
<div id="chatbot-button">💬</div>
`);

const bubble = document.getElementById("chatbot-button");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

/* OPEN CHATBOT */

bubble.addEventListener("dblclick", function(){

window.open(
"https://chatbot-e99e.onrender.com",
"chatbot",
"width=450,height=650"
);

});

/* DRAG START */

bubble.addEventListener("mousedown", function(e){

isDragging = true;

bubble.style.right = "auto";
bubble.style.bottom = "auto";

offsetX = e.clientX - bubble.getBoundingClientRect().left;
offsetY = e.clientY - bubble.getBoundingClientRect().top;

});

/* DRAG MOVE */

document.addEventListener("mousemove", function(e){

if(!isDragging) return;

bubble.style.left = (e.clientX - offsetX) + "px";
bubble.style.top = (e.clientY - offsetY) + "px";

});

/* DRAG STOP */

document.addEventListener("mouseup", function(){

isDragging = false;

});


