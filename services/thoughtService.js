import { thoughts } from './mockData.js';
import { v4 as uuidv4 } from 'uuid';

export function getAllThoughts() {
  const thoughtList = [...thoughts];
  return thoughtList;
}

export function addThought({ message }) {
  const newThought = {
    _id: uuidv4(),
    message: message,
    hearts: 0,
    createdAt: new Date().toISOString(),
    __v: 0,
  };

  thoughts.push(newThought);
  return newThought;
}

export function getOneThought(id) {
  if (!id) return null;

  const thought = thoughts.find((thought) => thought._id === String(id));
  if (!thought) return null;

  return thought;
}

export function incrementLike(id) {
  const foundThought = thoughts.find((thought) => thought._id === String(id));
  //if the thought is not found, return null
  if (!foundThought) return null;

  //else increment the hearts count
  foundThought.hearts += 1;
  return foundThought;
}

export function decrementLike(id) {
  const foundThought = thoughts.find((thought) => thought._id === String(id));
  //if the thought is not found, return null
  if (!foundThought) return null;

  //else decrement the hearts count
  if (foundThought.hearts > 0) {
    foundThought.hearts -= 1;
  }
  return foundThought;
}

export function updateThought(id, updatedThought) {
  const thought = thoughts.find((thought) => thought._id === String(id));
  if (!thought) return null;

  if (updatedThought.message) {
    thought.message = updatedThought.message;
  }

  thought.__v += 1;

  return thought;
}

export function removeThought(id) {
  const index = thoughts.findIndex((t) => t._id === String(id));
  if (index === -1) return null;

  // Ta ut objektet från arrayen
  const [removed] = thoughts.splice(index, 1);
  return removed; // returnera det borttagna objektet
}
