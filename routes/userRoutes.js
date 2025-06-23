import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/Users.js';
import authenticateUser from '../middlewares/authenticateUser.js';
import crypto from 'crypto';
import { signup, login, logout } from '../controllers/userController.js';

const userRoutes = express.Router();

userRoutes.post('/signup', signup);
userRoutes.post('/login', login);
userRoutes.post('/logout', authenticateUser, logout);

export default userRoutes;
