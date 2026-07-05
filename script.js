const loader = document.querySelector(".loader");
const header = document.querySelector(".site-header");
const progress = document.querySelector(".scroll-progress");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const backToTop = document.querySelector(".back-to-top");
const heroBg = document.querySelector(".hero-bg");
const revealItems = document.querySelectorAll(".reveal");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
const videoModal = document.querySelector("#videoModal");
const bookingForm = document.querySelector("#bookingForm");
const formMessage = document.querySelector("#formMessage");

const reviews = [
  {
    name: "Aiko Tanaka",
    text: "Không gian rất tĩnh, món ăn tinh tế và dịch vụ đúng chuẩn fine dining Tokyo.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=80",
    rating: 5
  },
  {
    name: "Minh Anh",
    text: "Sashimi tươi, trình bày đẹp, đặt bàn nhanh và nhân viên cực kỳ chu đáo.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=180&q=80",
    rating: 5
  },
  {
    name: "Harper Lee",
    text: "Một landing page tạo cảm giác cao cấp ngay từ phần hero. Rất cân bằng và sang.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80",
    rating: 5
  }
];

let currentReview = 0;

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 450);
});

function updateScrollState() {
  const scrollTop = window.scrollY;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = pageHeight > 0 ? (scrollTop / pageHeight) * 100 : 0;

  progress.style.width = `${percent}%`;
  header.classList.toggle("scrolled", scrollTop > 30);
  backToTop.classList.toggle("show", scrollTop > 500);

  if (heroBg) {
    heroBg.style.setProperty("--parallax", `${scrollTop * 0.12}px`);
  }
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

menuToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});

siteNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    siteNav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

document.querySelectorAll(".ripple").forEach((button) => {
  button.addEventListener("click", (event) => {
    const rect = button.getBoundingClientRect();
    const dot = document.createElement("span");
    dot.className = "ripple-dot";
    dot.style.left = `${event.clientX - rect.left}px`;
    dot.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(dot);
    dot.addEventListener("animationend", () => dot.remove());
  });
});

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.full;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  });
});

lightbox.querySelector("button").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.classList.remove("modal-open");
}

function renderReview() {
  const review = reviews[currentReview];
  document.querySelector("#reviewAvatar").src = review.avatar;
  document.querySelector("#reviewName").textContent = review.name;
  document.querySelector("#reviewText").textContent = `“${review.text}”`;
  document.querySelector("#reviewStars").innerHTML = Array.from({ length: review.rating }, () => '<i class="fa-solid fa-star"></i>').join("");
}

document.querySelectorAll("[data-carousel]").forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.carousel === "next" ? 1 : -1;
    currentReview = (currentReview + direction + reviews.length) % reviews.length;
    renderReview();
  });
});

setInterval(() => {
  currentReview = (currentReview + 1) % reviews.length;
  renderReview();
}, 5200);

renderReview();

document.querySelector(".play-button").addEventListener("click", () => {
  videoModal.classList.add("open");
  videoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
});

videoModal.querySelector("button").addEventListener("click", closeVideo);
videoModal.addEventListener("click", (event) => {
  if (event.target === videoModal) closeVideo();
});

function closeVideo() {
  videoModal.classList.remove("open");
  videoModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [...bookingForm.querySelectorAll("input[required], textarea[required]")];
  const invalidFields = fields.filter((field) => !field.checkValidity());

  fields.forEach((field) => field.classList.toggle("error", !field.checkValidity()));

  if (invalidFields.length > 0) {
    formMessage.textContent = "Vui lòng kiểm tra lại thông tin đặt bàn.";
    formMessage.style.color = "#ffb4b4";
    invalidFields[0].focus();
    return;
  }

  const formData = new FormData(bookingForm);
  formMessage.textContent = `Cảm ơn ${formData.get("name")}. Sakura Ginza đã nhận yêu cầu đặt bàn cho ${formData.get("guests")} khách.`;
  formMessage.style.color = "#c9a227";
  bookingForm.reset();
});

bookingForm.addEventListener("input", (event) => {
  if (event.target.matches("input, textarea")) {
    event.target.classList.remove("error");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    closeVideo();
  }
});
