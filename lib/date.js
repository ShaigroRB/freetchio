export const dateToEndsInXdYhZm = (date) => {
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
    : [daysStr, hoursStr, minutesStr].filter(Boolean).join(' ') + ' left';
  return { endsIn, daysLeft, hoursLeft, minutesLeft };
};
