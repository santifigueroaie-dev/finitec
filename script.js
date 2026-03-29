const WHATSAPP_NUMBER = "5493810000000";

const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");
const brandFilters = Array.from(document.querySelectorAll('input[name="brand"]'));
const priceFilters = Array.from(document.querySelectorAll('input[name="price"]'));
const rangeFilters = Array.from(document.querySelectorAll('input[name="range"]'));
const usageFilters = Array.from(document.querySelectorAll('input[name="usage"]'));
const conditionFilters = Array.from(document.querySelectorAll('input[name="condition"]'));
const clearFiltersButton = document.getElementById("clear-filters");
const resultsCount = document.getElementById("results-count");
const productCards = Array.from(document.querySelectorAll(".product-card"));
const emptyState = document.getElementById("empty-state");
const whatsappLinks = Array.from(document.querySelectorAll(".whatsapp-link"));
const marketSlides = Array.from(document.querySelectorAll("[data-slide]"));
const sliderDots = document.getElementById("slider-dots");
const prevMarket = document.getElementById("prev-market");
const nextMarket = document.getElementById("next-market");
const buyInput = document.getElementById("buy-input");
const sellInput = document.getElementById("sell-input");
const buyValue = document.getElementById("buy-value");
const sellValue = document.getElementById("sell-value");
const productModal = document.getElementById("product-modal");
const productModalBackdrop = document.getElementById("product-modal-backdrop");
const modalClose = document.getElementById("modal-close");
const modalBrand = document.getElementById("modal-brand");
const modalCondition = document.getElementById("modal-condition");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalDescription = document.getElementById("modal-description");
const modalSpecs = document.getElementById("modal-specs");
const modalPayments = document.getElementById("modal-payments");
const modalWhatsapp = document.getElementById("modal-whatsapp");
const modalDeviceArt = document.getElementById("modal-device-art");

let currentSlide = 0;
let sliderIntervalId = null;
let lastFocusedCard = null;

const productDetails = {
  "redmi-note-13": {
    brand: "Xiaomi",
    condition: "Nuevo",
    title: "Redmi Note 13",
    price: 319999,
    artClass: "xiaomi-art",
    description: "Buen punto de entrada para quien busca pantalla nítida, batería sólida y precio competitivo.",
    specs: ["Pantalla AMOLED 6.67 pulgadas", "128 GB de almacenamiento", "Batería 5000 mAh", "Carga rápida 33W"],
    payments: ["Efectivo", "Tarjetas en cuotas"]
  },
  "galaxy-a55": {
    brand: "Samsung",
    condition: "Nuevo",
    title: "Galaxy A55",
    price: 489999,
    artClass: "samsung-art",
    description: "Una opción equilibrada para redes, cámara y uso diario con respaldo de marca fuerte.",
    specs: ["Pantalla Super AMOLED 6.6 pulgadas", "128 GB de almacenamiento", "8 GB de RAM", "Cámara principal 50 MP"],
    payments: ["Efectivo", "Tarjetas en cuotas"]
  },
  "moto-g84": {
    brand: "Motorola",
    condition: "Nuevo",
    title: "Moto G84",
    price: 579999,
    artClass: "motorola-art",
    description: "Equipo muy buscado para trabajo y uso diario por su fluidez, autonomía y buena pantalla.",
    specs: ["Pantalla pOLED 6.5 pulgadas", "256 GB de almacenamiento", "8 GB de RAM", "Batería 5000 mAh"],
    payments: ["Efectivo", "Tarjetas en cuotas"]
  },
  "xiaomi-13t": {
    brand: "Xiaomi",
    condition: "Nuevo",
    title: "Xiaomi 13T",
    price: 799999,
    artClass: "premium-art",
    description: "Pensado para usuarios exigentes que quieren potencia, mejor cámara y buena vida útil.",
    specs: ["Pantalla AMOLED 144 Hz", "256 GB de almacenamiento", "Cámara triple Leica", "Carga turbo 67W"],
    payments: ["Efectivo", "Tarjetas en cuotas"]
  },
  "galaxy-s24": {
    brand: "Samsung",
    condition: "Nuevo",
    title: "Galaxy S24",
    price: 929999,
    artClass: "samsung-premium-art",
    description: "Alta gama orientada a quienes buscan rendimiento premium, cámara y durabilidad.",
    specs: ["Pantalla Dynamic AMOLED 2X", "256 GB de almacenamiento", "Procesador de última generación", "Carga rápida e inalámbrica"],
    payments: ["Efectivo", "Tarjetas en cuotas"]
  },
  "moto-g24": {
    brand: "Motorola",
    condition: "Nuevo",
    title: "Moto G24",
    price: 279999,
    artClass: "moto-entry-art",
    description: "Una compra práctica para resolver rápido con un presupuesto más ajustado.",
    specs: ["Pantalla 6.6 pulgadas 90 Hz", "128 GB de almacenamiento", "Batería 5000 mAh", "Lector de huella lateral"],
    payments: ["Efectivo", "Tarjetas en cuotas"]
  },
  "iphone-13": {
    brand: "Apple",
    condition: "Usado",
    title: "iPhone 13",
    price: 699999,
    artClass: "iphone-art",
    description: "Ideal para entrar a Apple con una muy buena cámara, rendimiento fluido y equipo probado.",
    specs: ["Pantalla Super Retina XDR 6.1 pulgadas", "128 GB de almacenamiento", "Chip A15 Bionic", "Batería revisada"],
    payments: ["Efectivo", "Tarjetas en cuotas"]
  },
  "iphone-15": {
    brand: "Apple",
    condition: "Nuevo",
    title: "iPhone 15",
    price: 1299999,
    artClass: "iphone-premium-art",
    description: "Modelo premium para trabajo, creación de contenido y usuarios que priorizan ecosistema Apple.",
    specs: ["Pantalla Super Retina XDR 6.1 pulgadas", "128 GB de almacenamiento", "Chip A16 Bionic", "Cámara principal 48 MP"],
    payments: ["Efectivo", "Tarjetas en cuotas"]
  }
};

function buildWhatsAppUrl(message) {
  const baseUrl = `https://wa.me/${WHATSAPP_NUMBER}`;
  const safeMessage = encodeURIComponent(message);

  return `${baseUrl}?text=${safeMessage}`;
}

function hydrateWhatsAppLinks() {
  whatsappLinks.forEach((link) => {
    const message = link.dataset.message || "Hola Finitec 👋 Quiero hacer una consulta.";
    link.href = buildWhatsAppUrl(message);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

function toggleMenu() {
  const isOpen = siteNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function closeMenuOnNavigation() {
  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function matchesPriceFilter(price, filterValue) {
  if (filterValue === "all") {
    return true;
  }

  const [min, max] = filterValue.split("-").map(Number);
  return price >= min && price <= max;
}

function getSelectedRadioValue(filters) {
  return filters.find((filter) => filter.checked)?.value || "all";
}

function filterProducts() {
  const selectedBrands = brandFilters.filter((filter) => filter.checked).map((filter) => filter.value);
  const selectedPrice = getSelectedRadioValue(priceFilters);
  const selectedRange = getSelectedRadioValue(rangeFilters);
  const selectedUsage = getSelectedRadioValue(usageFilters);
  const selectedCondition = getSelectedRadioValue(conditionFilters);

  let visibleCards = 0;

  productCards.forEach((card) => {
    const price = Number(card.dataset.price);
    const brandMatches = selectedBrands.length === 0 || selectedBrands.includes(card.dataset.brand);
    const rangeMatches = selectedRange === "all" || card.dataset.range === selectedRange;
    const priceMatches = matchesPriceFilter(price, selectedPrice);
    const usageMatches = selectedUsage === "all" || card.dataset.usage === selectedUsage;
    const conditionMatches = selectedCondition === "all" || card.dataset.condition === selectedCondition;
    const shouldShow = brandMatches && rangeMatches && priceMatches && usageMatches && conditionMatches;

    card.hidden = !shouldShow;

    if (shouldShow) {
      visibleCards += 1;
    }
  });

  emptyState.hidden = visibleCards > 0;

  if (resultsCount) {
    resultsCount.textContent = String(visibleCards);
  }
}

function clearFilters() {
  brandFilters.forEach((filter) => {
    filter.checked = false;
  });

  [priceFilters, rangeFilters, usageFilters, conditionFilters].forEach((filters) => {
    filters.forEach((filter) => {
      filter.checked = filter.value === "all";
    });
  });

  filterProducts();
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(value);
}

function syncCurrencyBoard() {
  buyValue.textContent = formatCurrency(Number(buyInput.value || 0));
  sellValue.textContent = formatCurrency(Number(sellInput.value || 0));
}

function renderList(target, values) {
  target.innerHTML = "";

  values.forEach((value) => {
    const listItem = document.createElement("li");
    listItem.textContent = value;
    target.appendChild(listItem);
  });
}

function openProductModal(card) {
  const details = productDetails[card.dataset.productId];

  if (!details || !productModal) {
    return;
  }

  lastFocusedCard = card;
  productModal.hidden = false;
  document.body.style.overflow = "hidden";
  modalBrand.textContent = details.brand;
  modalCondition.textContent = details.condition;
  modalTitle.textContent = details.title;
  modalPrice.textContent = formatCurrency(details.price);
  modalDescription.textContent = details.description;
  renderList(modalSpecs, details.specs);
  renderList(modalPayments, details.payments);
  modalDeviceArt.className = `phone-art ${details.artClass}`;
  modalWhatsapp.dataset.message = `Hola Finitec 👋 Quiero consultar por el ${details.title}.`;
  modalWhatsapp.href = buildWhatsAppUrl(modalWhatsapp.dataset.message);
}

function closeProductModal() {
  if (!productModal) {
    return;
  }

  productModal.hidden = true;
  document.body.style.overflow = "";

  if (lastFocusedCard) {
    lastFocusedCard.focus();
  }
}

function renderSlider(index) {
  currentSlide = (index + marketSlides.length) % marketSlides.length;

  marketSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === currentSlide);
  });

  Array.from(sliderDots.children).forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === currentSlide);
    dot.setAttribute("aria-current", dotIndex === currentSlide ? "true" : "false");
  });
}

function createSliderDots() {
  marketSlides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir a noticia ${index + 1}`);
    dot.addEventListener("click", () => {
      renderSlider(index);
      restartSlider();
    });
    sliderDots.appendChild(dot);
  });
}

function startSlider() {
  sliderIntervalId = window.setInterval(() => {
    renderSlider(currentSlide + 1);
  }, 5000);
}

function restartSlider() {
  window.clearInterval(sliderIntervalId);
  startSlider();
}

function registerSliderControls() {
  prevMarket.addEventListener("click", () => {
    renderSlider(currentSlide - 1);
    restartSlider();
  });

  nextMarket.addEventListener("click", () => {
    renderSlider(currentSlide + 1);
    restartSlider();
  });
}

function registerProductCards() {
  productCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest(".whatsapp-link")) {
        return;
      }

      openProductModal(card);
    });

    card.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && !event.target.closest(".whatsapp-link")) {
        event.preventDefault();
        openProductModal(card);
      }
    });
  });
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", toggleMenu);
  closeMenuOnNavigation();
}

[...brandFilters, ...priceFilters, ...rangeFilters, ...usageFilters, ...conditionFilters].forEach((filter) => {
  filter.addEventListener("change", filterProducts);
});

[buyInput, sellInput].forEach((input) => {
  input.addEventListener("input", syncCurrencyBoard);
});

[clearFiltersButton].filter(Boolean).forEach((button) => {
  button.addEventListener("click", clearFilters);
});

[modalClose, productModalBackdrop].filter(Boolean).forEach((element) => {
  element.addEventListener("click", closeProductModal);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && productModal && !productModal.hidden) {
    closeProductModal();
  }
});

hydrateWhatsAppLinks();
filterProducts();
syncCurrencyBoard();
registerProductCards();

if (marketSlides.length > 0 && sliderDots && prevMarket && nextMarket) {
  createSliderDots();
  renderSlider(0);
  registerSliderControls();
  startSlider();
}
