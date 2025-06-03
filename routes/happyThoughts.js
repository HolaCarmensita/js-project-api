import express from 'express';
import {
  listAllThoughts,
  getOneThought,
  addThought,
  likeThought,
  unLikeThought,
  updateThought,
  removeThought,
} from '../controllers/thoughtController.js';

const happyRouter = express.Router();

//KOMIHÅG ATT URL börjar med /api/thoughts
happyRouter.get('/', listAllThoughtsHandler);
happyRouter.get('/:id', getOneThoughtHandler);
happyRouter.post('/', addThoughtHandler);
happyRouter.post('/:id/likes', likeThoughtHandler);
happyRouter.delete('/:id/likes', unLikeThoughtHandler);
happyRouter.put('/:id', updatedThoughtHandler);
happyRouter.delete('/:id', removeThoughtHandler);

export default happyRouter;
