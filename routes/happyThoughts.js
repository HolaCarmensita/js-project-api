import express from 'express';
import {
  getAllThoughts,
  getOneThought,
  addThought,
  incrementLike,
  decrementLike,
  updateThought,
  removeThought,
} from '../services/thoughtService.js';
import { findByPrefix } from '../services/untils';

const happyRouter = express.Router();

function listAllThoughtsHandler(req, res) {
  const allThoughts = getAllThoughts();
  res.json(allThoughts);
}

function getOneThoughtHandler(req, res) {
  const { id } = req.params;
  const thought = getOneThought(id);
  if (!thought) {
    const allIds = getAllThoughts().map((t) => t._id);
    const suggestion = findByPrefix(id, allIds, 4);

    return res.status(404).json({
      error: 'Thought not found',
      requestedId: id,
      suggestion: suggestion
        ? `Did you mean ${suggestion}?`
        : 'Could not find a suggested ID',
    });
  }
  return res.json(thought);
}

function addThoughtHandler(req, res) {
  const message = addThought(req.body);
  res.json(message);
}

function likeThoughtHandler(req, res) {
  const { id } = req.params;
  const addLike = incrementLike(id);

  if (!addLike) {
    return res
      .status(404)
      .json({ error: 'Thought not found, could not add your like' });
  }
  return res.json(addLike);
}

function unLikeThoughtHandler(req, res) {
  const { id } = req.params;
  const unLike = decrementLike(id);

  if (!unLike) {
    return res
      .status(404)
      .json({ error: 'Thought not found, could not unlike your like' });
  }
  return res.json(unLike);
}

function updatedThoughtHandler(req, res) {
  const { id } = req.params;
  const updatedThought = req.body;

  const updated = updateThought(id, updatedThought);

  if (!updated) {
    return res.status(404).json({ error: 'Thought not found' });
  }

  return res.json(updated);
}

function removeThoughtHandler(req, res) {
  const { id } = req.params;
  const removedThought = removeThought(id);

  if (!removedThought) {
    return res.status(404).json({ error: 'Thought not found' });
  }

  return res.json({
    message: `Thought: ${removedThought.message}, removed successfully`,
    removedThought: removedThought,
  });
}

//KOMIHÅG ATT URL börjar med /api/thoughts
happyRouter.get('/', listAllThoughtsHandler);
happyRouter.get('/:id', getOneThoughtHandler);
happyRouter.post('/', addThoughtHandler);
happyRouter.post('/:id/likes', likeThoughtHandler);
happyRouter.delete('/:id/likes', unLikeThoughtHandler);
happyRouter.put('/:id', updatedThoughtHandler);
happyRouter.delete('/:id', removeThoughtHandler);

export default happyRouter;
