/**
 * Given a date,
 * write "Ends in Xd, Yh, Zm"
 */
const dateToEndsInXdYhZm = (date) => {
  const currentDate = new Date();
  const givenDate = new Date(date);
  let daysLeft = givenDate.getDate() - currentDate.getDate();
  daysLeft = daysLeft < 0 ? 0 : daysLeft;
  let hoursLeft = givenDate.getHours() - currentDate.getHours();
  hoursLeft = hoursLeft < 0 ? 0 : hoursLeft;
  let minutesLeft = givenDate.getMinutes() - currentDate.getMinutes();
  minutesLeft = minutesLeft < 0 ? 0 : minutesLeft;

  if (!daysLeft && !hoursLeft && !minutesLeft) {
    return null;
  }

  const daysStr = daysLeft ? `${daysLeft}d` : "";
  const hoursStr = hoursLeft ? `${hoursLeft}h` : "";
  const minutesStr = minutesLeft ? `${minutesLeft}m` : "";

  const endsIn = `Ends in ${daysStr} ${hoursStr} ${minutesStr}`;
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
