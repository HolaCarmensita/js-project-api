import assert from 'assert';

import {
  getAllThoughts,
  addThought,
  incrementLike,
  decrementLike,
  updateThought,
  removeThought,
} from './services/thoughtService.js';

////////////////////// ASSERT TESTING ////////////////////////

// 1) Initial count
const before = getAllThoughts().length;

// 2) Lägg till
const t = addThought({ message: 'Hej på dig' });
assert.strictEqual(
  getAllThoughts().length,
  before + 1,
  `addThought: förväntar length ${before + 1}, men fick ${
    getAllThoughts().length
  }`
);

// 3) Like
incrementLike(t._id);
assert.strictEqual(
  getAllThoughts().find((x) => x._id === t._id).hearts,
  1,
  'incrementLike: hearts borde vara 1'
);

// 4) Update
updateThought(t._id, { message: 'Uppdaterat!' });
assert.strictEqual(
  getAllThoughts().find((x) => x._id === t._id).message,
  'Uppdaterat!',
  'updateThought: message matchar inte'
);

// 5) Remove
removeThought(t._id);
assert.strictEqual(
  getAllThoughts().some((x) => x._id === t._id),
  false,
  'removeThought: ID borde vara borttagen'
);

console.log('🎉 Alla service-tester gick igenom utan fel!');

//////////////////////// MANUAL TESTING ////////////////////////

// // 1) Börja med en ren mock-array
// console.log('Initial:', getAllThoughts());

// // 2) Lägg till en ny
// const newT = addThought({ message: 'Testmeddelande' });
// console.log('Efter add:', getAllThoughts());

// // 3) Gilla och ogilla
// incrementLike(newT._id);
// console.log(
//   '✅ Efter +1 like:',
//   getAllThoughts().find((t) => t._id === newT._id)
// );
// decrementLike(newT._id);
// console.log(
//   ' ✅ Efter -1 like:',
//   getAllThoughts().find((t) => t._id === newT._id)
// );

// // 4) Uppdatera
// updateThought(newT._id, { message: 'Uppdaterat meddelande' });
// console.log(
//   ' ✅ Efter update:',
//   getAllThoughts().find((t) => t._id === newT._id)
// );

// // 5) Ta bort
// removeThought(newT._id);
// console.log(' ✅ Efter remove:', getAllThoughts());
