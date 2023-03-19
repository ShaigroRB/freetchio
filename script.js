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

const generateCard = ({ category, item }) => {
  const slCard = document.createElement("sl-card");
  slCard.classList.add("item-card");
  slCard.id = item.id;
  slCard.addEventListener("click", () => {
    window.open(item.link, "_blank").focus();
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
  itemCategory.innerText = category;

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

  return slCard;
};

// initialize the page
const categories = await fetch("assets/items.json").then((response) =>
  response.json()
);

const cards = document.querySelector("#cards");
for (const [category, items] of Object.entries(categories)) {
  if (items.length === 0) {
    continue;
  }

  for (const item of items) {
    const card = generateCard({ category, item });
    if (card) {
      cards.appendChild(card);
    }
  }
}
