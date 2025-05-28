import express from 'express';
import {
  getAllThoughts,
  addThought,
  incrementLike,
  decrementLike,
  updateThought,
  removeThought,
} from '../services/thoughtService.js';

const happyRouter = express.Router();

function listAllThoughtsHandler(req, res) {
  const allThoughts = getAllThoughts();
  res.json(allThoughts);
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

//KOMIHÅG ATT URL börjar med /api/thoughts
happyRouter.get('/', listAllThoughtsHandler);
happyRouter.post('/', addThoughtHandler);
happyRouter.post('/:id/like', likeThoughtHandler);
happyRouter.patch('/:id/unlike', unLikeThoughtHandler);

export default happyRouter;
