import express from 'express';
import authenticateUser from '../middlewares/authenticateUser.js';

import {
  listAllThoughts,
  getOneThought,
  addThought,
  likeThought,
  updateThought,
  removeThought,
} from '../controllers/thoughtController.js';

const happyRouter = express.Router();

//KOMIHÅG ATT URL börjar med /api/thoughts
happyRouter.get('/', listAllThoughts);
happyRouter.get('/:id', getOneThought);
happyRouter.post('/', authenticateUser, addThought);
happyRouter.post('/:id/likes', authenticateUser, likeThought);
happyRouter.put('/:id', authenticateUser, updateThought);
happyRouter.delete('/:id', authenticateUser, removeThought);

export default happyRouter;
