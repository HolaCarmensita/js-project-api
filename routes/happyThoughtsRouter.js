import express from 'express';
import authenticateUser from '../middlewares/authenticateUser.js';

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
happyRouter.get('/', listAllThoughts);
happyRouter.get('/:id', getOneThought);
happyRouter.post('/', authenticateUser, addThought);
happyRouter.post('/:id/likes', likeThought);
happyRouter.delete('/:id/likes', unLikeThought);
happyRouter.put('/:id', updateThought);
happyRouter.delete('/:id', removeThought);

export default happyRouter;
