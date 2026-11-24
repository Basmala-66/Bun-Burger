const products = [
  {
    id: "classic-smash",
    name: "Classic Smash",
    category: "Burgers",
    price: 12.5,
    description: "Double smashed beef, melty American cheese, pickles & our house sauce.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=82",
    tag: "BEST SELLER",
    rating: "4.9",
  },
  {
    id: "crispy-chicken",
    name: "Crispy Chicken",
    category: "Burgers",
    price: 11,
    description: "Buttermilk-crispy chicken, cool slaw & a little spicy honey.",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=82",
    tag: "A LITTLE CRUNCHY",
    rating: "4.8",
  },
  {
    id: "garden-party",
    name: "Garden Party",
    category: "Burgers",
    price: 10.5,
    description: "A juicy veggie patty with avocado, greens & herby yogurt.",
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=82",
    tag: "PLANT POWER",
    rating: "4.7",
  },
  {
    id: "hot-honey-pizza",
    name: "Hot Honey Pizza",
    category: "Pizza",
    price: 14,
    description: "Stone-baked crust, mozzarella, pepperoni & sweet heat.",
    image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=82",
    tag: "A LITTLE HEAT",
    rating: "4.9",
  },
  {
    id: "house-lemonade",
    name: "House Lemonade",
    category: "Drinks",
    price: 4.5,
    description: "Fresh lemon, a hint of mint & the perfect amount of chill.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=82",
    tag: "FRESH SQUEEZED",
    rating: "4.8",
  },
  {
    id: "berry-fizz",
    name: "Berry Fizz",
    category: "Drinks",
    price: 5,
    description: "Bubbly berries, fresh lime & a splash of something lovely.",
    image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=800&q=82",
    tag: "SO REFRESHING",
    rating: "4.7",
  },
  {
    id: "choco-cookie",
    name: "Choco Cookie",
    category: "Desserts",
    price: 5.5,
    description: "Warm, gooey, loaded with chocolate. Best shared (or not).",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=82",
    tag: "BAKED WITH LOVE",
    rating: "5.0",
  },
  {
    id: "vanilla-shake",
    name: "Vanilla Shake",
    category: "Desserts",
    price: 6,
    description: "Real vanilla, slow-spun thick & topped with whipped cream.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=82",
    tag: "OLD-SCHOOL GOOD",
    rating: "4.9",
  },
];

const STORAGE_KEY = "bite-house-cart";
const WHATSAPP_PHONE = "";
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const productGrid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#menu-search");
const resultsLabel = document.querySelector(".results-label");
const emptyState = document.querySelector("#empty-state");
const categoryButtons = [...document.querySelectorAll(".category-button")];
const cartDrawer = document.querySelector("#cart-drawer");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartSummary = document.querySelector("#cart-summary");
const overlay = document.querySelector("#overlay");
const dialog = document.querySelector("#product-dialog");
const toast = document.querySelector("#toast");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

let activeCategory = "All";
let cart = loadCart();
let toastTimer;

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(savedCart)) return [];
    return savedCart.filter((item) =>
      products.some((product) => product.id === item.id) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
    );
  } catch (error) {
    console.error("Could not load the saved Bun Burger cart.", error);
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Could not save the Bun Burger cart.", error);
    showToast("Your browser could not save the bag.");
  }
}

function getVisibleProducts() {
  const searchTerm = searchInput.value.trim().toLocaleLowerCase();
  return products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = `${product.name} ${product.category} ${product.description}`
      .toLocaleLowerCase()
      .includes(searchTerm);
    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  productGrid.innerHTML = visibleProducts.map((product, index) => `
    <article class="product-card" style="animation-delay: ${Math.min(index * 45, 180)}ms">
      <div class="product-card__image-wrap" data-view-product="${product.id}" tabindex="0" role="button" aria-label="View ${product.name} details">
        <img class="product-card__image" src="${product.image}" alt="${product.name}" loading="lazy" />
        <span class="product-card__tag ${product.tag.includes("HEAT") || product.tag.includes("CRUNCHY") ? "product-card__tag--hot" : ""}">${product.tag}</span>
        <span class="product-card__quick" aria-hidden="true">↗</span>
      </div>
      <div class="product-card__meta">
        <h3 class="product-card__title">${product.name}</h3>
        <span class="product-card__price">${currency.format(product.price)}</span>
      </div>
      <p class="product-card__description">${product.description}</p>
      <div class="product-card__footer">
        <span class="product-card__rating"><span aria-hidden="true">★</span>${product.rating} &nbsp;·&nbsp; ${product.category}</span>
        <button class="product-card__add" type="button" data-add-product="${product.id}">+ Add to bag</button>
      </div>
    </article>
  `).join("");
  resultsLabel.textContent = visibleProducts.length
    ? `SHOWING ${String(visibleProducts.length).padStart(2, "0")} ${visibleProducts.length === 1 ? "BITE" : "BITES"}`
    : "";
  emptyState.hidden = visibleProducts.length !== 0;
  productGrid.hidden = visibleProducts.length === 0;
}

function updateCart() {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return total + product.price * item.quantity;
  }, 0);

  document.querySelector(".cart-count").textContent = itemCount;
  document.querySelector(".drawer-count").textContent = `(${itemCount})`;
  document.querySelector("#cart-subtotal").textContent = currency.format(subtotal);
  cartEmpty.hidden = cart.length > 0;
  cartSummary.hidden = cart.length === 0;

  cartItems.innerHTML = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    return `
      <article class="cart-item">
        <img class="cart-item__image" src="${product.image}" alt="" />
        <div class="cart-item__details">
          <h3 class="cart-item__name">${product.name}</h3>
          <span class="cart-item__price">${currency.format(product.price * item.quantity)}</span>
          <div class="quantity-control" aria-label="${product.name} quantity">
            <button type="button" data-quantity="${product.id}" data-change="-1" aria-label="Decrease ${product.name} quantity">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-quantity="${product.id}" data-change="1" aria-label="Increase ${product.name} quantity">+</button>
          </div>
        </div>
        <button class="cart-item__remove" type="button" data-remove="${product.id}" aria-label="Remove ${product.name}">×</button>
      </article>
    `;
  }).join("");
}

function addToCart(productId) {
  const cartItem = cart.find((item) => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart();
  updateCart();
  const product = products.find((entry) => entry.id === productId);
  showToast(`${product.name} added to your bag.`);
}

function changeQuantity(productId, amount) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter((entry) => entry.id !== productId);
  saveCart();
  updateCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  updateCart();
  showToast("Bite removed from your bag.");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function setBodyLocked(locked) {
  document.body.classList.toggle("is-locked", locked);
}

function openCart() {
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
  window.requestAnimationFrame(() => overlay.classList.add("is-visible"));
  setBodyLocked(true);
  document.querySelector(".close-cart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  overlay.classList.remove("is-visible");
  window.setTimeout(() => {
    if (!cartDrawer.classList.contains("is-open")) overlay.hidden = true;
  }, 250);
  setBodyLocked(false);
  document.querySelector(".cart-trigger").focus();
}

function openProductDetails(productId) {
  const product = products.find((entry) => entry.id === productId);
  if (!product) return;
  document.querySelector("#product-dialog-content").innerHTML = `
    <img class="product-dialog__image" src="${product.image}" alt="${product.name}" />
    <div class="product-dialog__details">
      <p class="product-dialog__category">${product.category} · ★ ${product.rating}</p>
      <h2 id="dialog-title">${product.name}</h2>
      <p class="product-dialog__price">${currency.format(product.price)}</p>
      <p class="product-dialog__description">${product.description}</p>
      <button class="button button--dark" type="button" data-dialog-add="${product.id}">
        Add to your bag <span class="button__arrow" aria-hidden="true">↗</span>
      </button>
    </div>
  `;
  dialog.returnValue = product.id;
  dialog.showModal();
  document.querySelector(".dialog-close").focus();
}

function submitWhatsAppOrder() {
  if (!/^[1-9]\d{7,14}$/.test(WHATSAPP_PHONE)) {
    showToast("Add the restaurant's WhatsApp number in script.js first.");
    return;
  }

  const orderLines = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    return `• ${product.name} × ${item.quantity} — ${currency.format(product.price * item.quantity)}`;
  });
  const subtotal = cart.reduce((total, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return total + product.price * item.quantity;
  }, 0);
  const message = [
    "Hi Bun Burger! I'd like to place an order:",
    "",
    ...orderLines,
    "",
    `Subtotal: ${currency.format(subtotal)}`,
    "Please confirm delivery and payment details. Thank you!",
  ].join("\n");
  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    categoryButtons.forEach((categoryButton) => {
      const selected = categoryButton === button;
      categoryButton.classList.toggle("is-selected", selected);
      categoryButton.setAttribute("aria-pressed", String(selected));
    });
    renderProducts();
  });
});

searchInput.addEventListener("input", renderProducts);
productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-product]");
  const detailButton = event.target.closest("[data-view-product]");
  if (addButton) addToCart(addButton.dataset.addProduct);
  else if (detailButton) openProductDetails(detailButton.dataset.viewProduct);
});
productGrid.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-view-product][role='button']")) {
    event.preventDefault();
    openProductDetails(event.target.dataset.viewProduct);
  }
});
cartItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) changeQuantity(quantityButton.dataset.quantity, Number(quantityButton.dataset.change));
  if (removeButton) removeFromCart(removeButton.dataset.remove);
});

document.querySelector(".cart-trigger").addEventListener("click", openCart);
document.querySelector(".close-cart").addEventListener("click", closeCart);
document.querySelector(".continue-shopping").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.querySelector("#whatsapp-order").addEventListener("click", submitWhatsAppOrder);
document.querySelector("#clear-filters").addEventListener("click", () => {
  activeCategory = "All";
  searchInput.value = "";
  categoryButtons.forEach((button) => {
    const selected = button.dataset.category === "All";
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  renderProducts();
});
document.querySelector("#product-dialog-content").addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-dialog-add]");
  if (!addButton) return;
  addToCart(addButton.dataset.dialogAdd);
  dialog.close();
});
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener("close", () => {
  const trigger = document.querySelector(`[data-view-product="${dialog.returnValue}"]`);
  if (trigger) trigger.focus();
});
menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  mainNav.classList.toggle("is-open", !isExpanded);
});
mainNav.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  mainNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (cartDrawer.classList.contains("is-open")) closeCart();
    if (dialog.open) dialog.close();
  }
  if (
    event.key === "/" &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !["INPUT", "TEXTAREA"].includes(event.target.tagName) &&
    !event.target.isContentEditable
  ) {
    event.preventDefault();
    searchInput.focus();
  }
});
document.querySelector("#current-year").textContent = new Date().getFullYear();

renderProducts();
updateCart();
