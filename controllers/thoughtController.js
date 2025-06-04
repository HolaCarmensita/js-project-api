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

export const getOneThought = async (req, res) => {
  const { id } = req.params;

  try {
    const thought = await Thought.findById(id);

    if (!thought) {
      return res.status(404).json({
        error: 'Thought not found',
        requestedId: id,
      });
    }
    res.json(thought);
  } catch (error) {
    console.error('Mongoose error on getOneThought:', error);
    res.status(400).json({ error: 'Invalid ID format or other error' });
  }
};

export const addThought = async (req, res) => {
  const { message } = req.body;
  try {
    const newThought = await Thought.create({ message });
    res.status(201).json(newThought);
  } catch (error) {
    console.error('Mongoose error on addThought:', error);
    if (error.name === 'ValidationError') {
      res
        .status(400)
        .json({ error: 'Validation failed', details: error.errors });
    } else {
      res.status(400).json({ error: 'Could not add your thought' });
    }
  }
};

export const likeThought = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      { $inc: { hearts: 1 } }, // 💥 Mongoose "increment"
      { new: true } // returnera det uppdaterade dokumentet
    );

    if (!updatedThought) {
      return res
        .status(404)
        .json({ error: 'Thought not found, could not add your like' });
    }

    res.json(updatedThought);
  } catch (error) {
    console.error('Mongoose error on likeThought:', error);
    res.status(400).json({ error: 'Invalid ID format or other error' });
  }
};

export const unLikeThought = async (req, res) => {
  const { id } = req.params;

  try {
    const thought = await Thought.findById(id);

    if (!thought) {
      return res
        .status(404)
        .json({ error: 'Thought not found, could not unlike' });
    }

    if (thought.hearts > 0) {
      thought.hearts -= 1;
      await thought.save();
    }

    res.json(thought);
  } catch (error) {
    console.error('Mongoose error on unLikeThought:', error);
    res.status(400).json({ error: 'Invalid ID format or other error' });
  }
};

export const updateThought = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  try {
    const thought = await Thought.findById(id);

    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    thought.message = message;
    await thought.save(); // kör validering och sparar ändringarna

    res.json(thought);
  } catch (error) {
    console.error('Mongoose error on updateThought:', error);
    res.status(400).json({
      error: 'Invalid input or ID format',
      message: error.message,
    });
  }
};

export const removeThought = async (req, res) => {
  const { id } = req.params;

  try {
    const thought = await Thought.findById(id);

    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    await thought.deleteOne(); // eller await Thought.findByIdAndDelete(id);

    res.json({
      message: `Thought: "${thought.message}" removed successfully`,
      removedThought: thought,
    });
  } catch (error) {
    console.error('Mongoose error on removeThought:', error);
    res.status(400).json({
      error: 'Invalid ID format or other error',
      message: error.message,
    });
  }
};
