const filters = {
  sortByDate: false,
  hideViewedItems: false,
  categories: [],
};

/**
 * Given a date,
 * write "Xd Yh Zm"
 *
 * https://stackoverflow.com/a/13904120
 */
const dateToEndsInXdYhZm = (date) => {
  const currentDate = new Date();
  const givenDate = new Date(date);

  let delta = (givenDate - currentDate) / 1000;

  let daysLeft = Math.floor(delta / 86400);
  delta -= daysLeft * 86400;

  let hoursLeft = Math.floor(delta / 3600) % 24;
  delta -= hoursLeft * 3600;

  let minutesLeft = Math.floor(delta / 60) % 60;
  delta -= minutesLeft * 60;

  if (daysLeft < 0) {
    return { endsIn: null, daysLeft, hoursLeft, minutesLeft };
  }

  const daysStr = daysLeft ? `${daysLeft}d` : "";
  const hoursStr = hoursLeft ? `${hoursLeft}h` : "";
  const minutesStr = minutesLeft ? `${minutesLeft}m` : "";

  const lessThanAMinute = !daysLeft && !hoursLeft && !minutesLeft;

  const endsIn = lessThanAMinute
    ? ">1min left"
    : `${daysStr} ${hoursStr} ${minutesStr} left`;
  return { endsIn, daysLeft, hoursLeft, minutesLeft };
};

const variantFromDaysLeft = (days) => {
  let variant = "primary";
  if (2 < days && days <= 5) {
    variant = "warning";
  }
  if (days <= 2) {
    variant = "danger";
  }
  return variant;
};

const addViewedItem = (itemId) => {
  const items = JSON.parse(localStorage.getItem("viewed-items"));
  items[itemId] = true;
  localStorage.setItem("viewed-items", JSON.stringify(items));
};

const isViewedItem = (id) => {
  const items = JSON.parse(localStorage.getItem("viewed-items"));
  return items[id] ?? false;
};

const createItemIsViewedSpan = () => {
  const itemIsViewed = document.createElement("span");
  itemIsViewed.classList.add("ribbon");
  itemIsViewed.innerText = "viewed";
  return itemIsViewed;
};

const generateCard = (item) => {
  const slCard = document.createElement("sl-card");
  slCard.classList.add("item-card");
  slCard.id = item.id;
  slCard.addEventListener("click", () => {
    window.open(item.link, "_blank").focus();
    if (!isViewedItem(item.id)) {
      addViewedItem(item.id);
      slCard.appendChild(createItemIsViewedSpan());
    }
  });

  const img = document.createElement("img");
  img.slot = "image";
  img.src = item.img_link;
  img.alt = item.title;

  const link = document.createElement("a");
  link.classList.add("item-title");
  link.innerText = item.title;
  link.href = item.link;

  const description = document.createElement("span");
  description.innerText = item.description;
  description.classList.add("item-description");

  const author = document.createElement("small");
  author.innerText = item.author;

  const itemCategory = document.createElement("sl-badge");
  itemCategory.classList.add("item-category");
  itemCategory.variant = "success";
  itemCategory.innerText = item.category;

  const endDate = document.createElement("sl-badge");
  endDate.classList.add("item-end-date");
  const { endsIn, daysLeft } = dateToEndsInXdYhZm(item.end_date);
  endDate.variant = variantFromDaysLeft(daysLeft);

  // consider that the date is in the past
  if (!endsIn) {
    return null;
  }

  endDate.innerText = endsIn;

  slCard.appendChild(img);
  slCard.appendChild(link);
  slCard.appendChild(description);

  slCard.appendChild(itemCategory);
  slCard.appendChild(endDate);

  if (isViewedItem(item.id)) {
    slCard.appendChild(createItemIsViewedSpan());
  }

  return slCard;
};

const getItemsWithCategory = (itemsByCategory) => {
  const newItems = [];
  for (const [category, items] of Object.entries(itemsByCategory)) {
    for (const item of items) {
      newItems.push({ ...item, category });
    }
  }
  return newItems;
};

const generateCards = (container, items) => {
  container.innerHTML = "";
  for (const item of items) {
    const card = generateCard(item);
    if (card) {
      container.appendChild(card);
    }
  }
};

const setTheme = (theme, element) => {
  const iconTheme = element.querySelector("sl-icon");
  if (theme === "dark") {
    iconTheme.name = "moon-fill";
    element.className = "sl-theme-dark";
  } else {
    iconTheme.name = "sun-fill";
    element.className = "sl-theme-light";
  }
};

const toggleTheme = () => {
  const currentTheme = document.documentElement.className;
  if (currentTheme === "sl-theme-dark") {
    setTheme("light", document.documentElement);
    localStorage.setItem("theme", "light");
  } else {
    setTheme("dark", document.documentElement);
    localStorage.setItem("theme", "dark");
  }
};

const loadTheme = () => {
  const theme = localStorage.getItem("theme");
  if (theme) {
    setTheme(theme, document.documentElement);
  } else {
    localStorage.setItem("theme", "light");
  }
};

const getSavedFilters = () => {
  const sortByDate = localStorage.getItem("sort-by-date") === "true";
  const categoriesStr = localStorage.getItem("filter-by-categories") ?? "[]";
  const hideViewed = localStorage.getItem("hide-viewed-items") === "true";
  const categories = JSON.parse(categoriesStr);
  return [sortByDate, hideViewed, categories];
};

const setSortByFilter = (isEnabled) => {
  localStorage.setItem("sort-by-date", isEnabled);
};

const setHideViewedFilter = (isEnabled) => {
  localStorage.setItem("hide-viewed-items", isEnabled);
};

const setCategoriesFilter = (categories) => {
  localStorage.setItem("filter-by-categories", JSON.stringify(categories));
};

const getNewSortedItems = (items, isEnabled = true) => {
  if (!isEnabled) {
    return items;
  }
  const sortedItems = [...items];
  sortedItems.sort((a, b) => {
    const aDate = new Date(a.end_date);
    const bDate = new Date(b.end_date);
    return aDate - bDate;
  });
  return sortedItems;
};

const getFilteredItemsByCategories = (items, categories) => {
  if (categories.length === 0) {
    return items;
  }
  return [...items.filter((item) => categories.includes(item.category))];
};

/** Returns only the items that have been viewed by the user. */
const getFilteredItemsByViewed = (items, hideViewed = true) => {
  if (!hideViewed) {
    return items;
  }

  const viewedItems = JSON.parse(localStorage.getItem("viewed-items"));
  return [...items.filter((item) => !viewedItems[item.id] ?? true)];
};

// initialize the page

// the "?" after the filename is to specify a version of the file
// this tricks the browser to ignore the cache & effectively reload the file
const itemsByCategory = await fetch(
  `assets/items.json?${new Date().getTime()}`
).then((response) => response.json());
const originalItems = getItemsWithCategory(itemsByCategory);
const [savedSortBy, savedHideViewed, savedCategories] = getSavedFilters();

filters.categories = savedCategories;
filters.hideViewedItems = savedHideViewed;
filters.sortByDate = savedSortBy;

let items = getNewSortedItems(
  getFilteredItemsByViewed(
    getFilteredItemsByCategories(originalItems, filters.categories),
    filters.hideViewedItems
  ),
  filters.sortByDate
);

// init viewed items in local storage if it does not exist
if (localStorage.getItem("viewed-items") == null) {
  localStorage.setItem("viewed-items", JSON.stringify({}));
}

const cards = document.querySelector("#cards");

// generate for the first time the cards
generateCards(cards, items);

const sortByDate = document.querySelector("#sort-by-date");
sortByDate.checked = filters.sortByDate;
sortByDate.addEventListener("click", () => {
  const checked = sortByDate.checked;
  items = getFilteredItemsByViewed(
    getFilteredItemsByCategories(originalItems, filters.categories),
    filters.hideViewedItems
  );

  generateCards(cards, getNewSortedItems(items, checked));

  filters.sortByDate = checked;
  setSortByFilter(checked);
});

const hideViewedItems = document.querySelector("#hide-viewed-items");
hideViewedItems.checked = filters.hideViewedItems;
hideViewedItems.addEventListener("click", () => {
  const checked = hideViewedItems.checked;
  items = getFilteredItemsByViewed(
    getFilteredItemsByCategories(originalItems, filters.categories),
    checked
  );
  generateCards(cards, getNewSortedItems(items, filters.sortByDate));

  filters.hideViewedItems = checked;
  setHideViewedFilter(checked);
});

const openInfoBtn = document.querySelector("#open-info");
openInfoBtn.addEventListener("click", () => {
  const infoDrawer = document.querySelector("#info-drawer");
  infoDrawer.show();
});

loadTheme();

const toggleThemeBtn = document.querySelector("#toggle-theme");
toggleThemeBtn.addEventListener("click", toggleTheme);

const selectCategories = document.querySelector("#select-category");
selectCategories.value = filters.categories;
selectCategories.addEventListener("sl-change", (ev) => {
  const categories = ev.target.value;
  items = getFilteredItemsByViewed(
    getFilteredItemsByCategories(originalItems, categories),
    filters.hideViewedItems
  );
  // don't forget to sort the filtered items if enabled
  generateCards(cards, getNewSortedItems(items, filters.sortByDate));

  filters.categories = categories;
  setCategoriesFilter(categories);
});

/**
 * Wait for all shoelace elements to be defined
 * to display them.
 */
await Promise.allSettled([
  customElements.whenDefined("sl-switch"),
  customElements.whenDefined("sl-select"),
  customElements.whenDefined("sl-button"),
  customElements.whenDefined("sl-icon"),
  customElements.whenDefined("sl-drawer"),
  customElements.whenDefined("sl-card"),
  customElements.whenDefined("sl-badge"),
]);

document
  .querySelectorAll(".contain-shoelace")
  .forEach((el) => el.classList.add("ready"));
