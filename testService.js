import assert from 'assert';

import {
  getAllThoughts,
  getOneThought,
  addThought,
  incrementLike,
  decrementLike,
  updateThought,
  removeThought,
} from './services/thoughtService.js';

////////////////////// ASSERT TESTING ////////////////////////

// 1) Initial count
const initialCount = getAllThoughts().length;

// 2) Lägg till en ny thought
const newThought = addThought({ message: 'Test thought' });
assert.strictEqual(
  getAllThoughts().length,
  initialCount + 1,
  `addThought: förväntade length ${initialCount + 1}, men fick ${
    getAllThoughts().length
  }`
);

// 3) Hämta just den thought
const fetched = getOneThought(newThought._id);
assert.ok(fetched, 'getOneThought: thought ska finnas');
assert.strictEqual(
  fetched.message,
  'Test thought',
  `getOneThought: förväntade message 'Test thought', men fick '${fetched.message}'`
);

// 4) Testa incrementLike
incrementLike(newThought._id);
assert.strictEqual(
  getOneThought(newThought._id).hearts,
  1,
  'incrementLike: hearts borde vara 1'
);

// 5) Testa decrementLike (får inte gå under 0)
decrementLike(newThought._id);
assert.strictEqual(
  getOneThought(newThought._id).hearts,
  0,
  'decrementLike: hearts borde vara tillbaka till 0'
);
decrementLike(newThought._id); // ytterligare en decrement
assert.strictEqual(
  getOneThought(newThought._id).hearts,
  0,
  'decrementLike: hearts borde inte gå under 0'
);

// 6) Testa updateThought
updateThought(newThought._id, { message: 'Updated thought' });
assert.strictEqual(
  getOneThought(newThought._id).message,
  'Updated thought',
  'updateThought: message uppdaterades inte korrekt'
);

// 7) Testa removeThought
const removed = removeThought(newThought._id);

// 7.1) Förväntar oss ett objekt, inte bara true
assert.ok(
  removed && removed._id === newThought._id,
  `removeThought: förväntade borttaget objekt med _id ${newThought._id}, men fick ${removed}`
);

// 7.2) Efter borttagningen ska getOneThought ge null
assert.strictEqual(
  getOneThought(newThought._id),
  null,
  'getOneThought: borde returnera null för borttagen thought'
);

// 7.3) Totalt antal ska ha minskat med 1 (till initialCount igen)
assert.strictEqual(
  getAllThoughts().length,
  initialCount,
  `removeThought: förväntade length ${initialCount}, men fick ${
    getAllThoughts().length
  }`
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
