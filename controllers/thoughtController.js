import express from 'express';
import { Thought } from '../models/Thoughts';

export const listAllThoughts = async (req, res) => {
  try {
    const sortBy = req.query.sortBy || 'createdAt';
    const sortDir = req.query.sortDir === 'ascending' ? 1 : -1;

    const thoughts = await Thought.find()
      .sort({ [sortBy]: sortDir }) // <– dynamisk sortering
      .limit(20);

    res.json(thoughts);
  } catch (error) {
    console.error('Mongoose error:', error);
    res.status(500).json({ error: 'Could not fetch thoughts from database' });
  }
};

// function getOneThoughtHandler(req, res) {
//   const { id } = req.params;
//   const thought = getOneThought(id);
//   if (!thought) {
//     const allIds = getAllThoughts().map((t) => t._id);
//     const suggestion = findByPrefix(id, allIds, 4);

//     return res.status(404).json({
//       error: 'Thought not found',
//       requestedId: id,
//       suggestion: suggestion
//         ? `Did you mean ${suggestion}?`
//         : 'Could not find a suggested ID',
//     });
//   }
//   return res.json(thought);
// }

// function addThoughtHandler(req, res) {
//   const message = addThought(req.body);
//   res.json(message);
// }

// function likeThoughtHandler(req, res) {
//   const { id } = req.params;
//   const addLike = incrementLike(id);

//   if (!addLike) {
//     return res
//       .status(404)
//       .json({ error: 'Thought not found, could not add your like' });
//   }
//   return res.json(addLike);
// }

// function unLikeThoughtHandler(req, res) {
//   const { id } = req.params;
//   const unLike = decrementLike(id);

//   if (!unLike) {
//     return res
//       .status(404)
//       .json({ error: 'Thought not found, could not unlike your like' });
//   }
//   return res.json(unLike);
// }

// function updatedThoughtHandler(req, res) {
//   const { id } = req.params;
//   const updatedThought = req.body;

//   const updated = updateThought(id, updatedThought);

//   if (!updated) {
//     return res.status(404).json({ error: 'Thought not found' });
//   }

//   return res.json(updated);
// }

// function removeThoughtHandler(req, res) {
//   const { id } = req.params;
//   const removedThought = removeThought(id);

//   if (!removedThought) {
//     return res.status(404).json({ error: 'Thought not found' });
//   }

//   return res.json({
//     message: `Thought: ${removedThought.message}, removed successfully`,
//     removedThought: removedThought,
//   });
// }
