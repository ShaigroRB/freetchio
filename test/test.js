import { dateToEndsInXdYhZm } from '../lib/date.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

const futureDate = new Date();
futureDate.setHours(futureDate.getHours() + 12);

const { endsIn } = dateToEndsInXdYhZm(futureDate.toISOString());

assert(!endsIn.startsWith(' '), 'The "endsIn" string should not have a leading space.');

console.log('All tests passed!');
