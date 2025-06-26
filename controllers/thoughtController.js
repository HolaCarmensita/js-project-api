import { Thought } from '../models/Thoughts.js';
import mongoose from 'mongoose';

export const listAllThoughts = async (req, res) => {
  const sortBy = req.query.sortBy || 'createdAt';
  const sortDir = req.query.sortDir === 'ascending' ? 1 : -1;

  try {
    const thoughts = await Thought.find()
      .sort({ [sortBy]: sortDir })
      .populate('createdBy', '_id email');
    res.json(thoughts);
  } catch (error) {
    console.error('Mongoose error on listAllThoughts:', error);
    res.status(500).json({ error: 'Could not fetch thoughts from database' });
  }
};

export const getOneThought = async (req, res) => {
  const { id } = req.params;

  try {
    let thought = await Thought.findById(id);

    if (!thought) {
      return res.status(404).json({
        error: 'Thought not found',
        requestedId: id,
      });
    }
    thought = await thought.populate('createdBy', '_id email');
    res.json(thought);
  } catch (error) {
    console.error('Mongoose error on getOneThought:', error);
    res.status(400).json({ error: 'Invalid ID format or other error' });
  }
};

export const addThought = async (req, res) => {
  const { message } = req.body;

  // Validate message length
  if (!message || message.length < 4 || message.length > 140) {
    return res.status(400).json({
      error: 'Message is required and must be between 5 and 140 characters',
    });
  }

  try {
    const newThought = await Thought.create({
      message,
      createdBy: req.user._id,
      // likes and createdAt will be set by defaults in the model
    });

    const populatedThought = await newThought.populate(
      'createdBy',
      '_id email'
    );
    res.status(201).json(populatedThought);
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
  const userId = req.user?._id;

  try {
    const thought = await Thought.findById(id);

    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    if (userId) {
      const userIdStr = userId.toString();
      // Convert likedBy to array of strings for logic
      let likedByStrArr = thought.likedBy.map((id) => id.toString());
      console.log('Before toggle:', { userIdStr, likedBy: likedByStrArr });
      const hasLiked = likedByStrArr.includes(userIdStr);

      if (hasLiked) {
        likedByStrArr = likedByStrArr.filter((id) => id !== userIdStr);
        console.log('User unliked. After removal:', likedByStrArr);
      } else {
        likedByStrArr.push(userIdStr);
        console.log('User liked. After addition:', likedByStrArr);
      }
      thought.likes = likedByStrArr.length;
      console.log('Final likedBy and likes:', {
        likedBy: likedByStrArr,
        likes: thought.likes,
      });
      // Convert likedBy back to ObjectIds before saving
      thought.likedBy = likedByStrArr.map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      const updatedThought = await thought.save();
      const populatedThought = await updatedThought.populate(
        'createdBy',
        '_id email'
      );
      return res.status(200).json(populatedThought);
    }

    // Guests should not be able to like
    return res.status(401).json({ error: 'Authentication required to like' });
  } catch (error) {
    console.error('Error in likeThought:', error);
    res
      .status(500)
      .json({ error: 'Could not toggle like', details: error.message });
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

    // Kontrollera att den inloggade användaren äger tanken
    if (thought.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: 'You are not allowed to update this thought' });
    }

    thought.message = message;
    const updatedThought = await thought.save();
    const populatedThought = await updatedThought.populate(
      'createdBy',
      '_id email'
    );
    res.status(200).json(populatedThought);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Could not update thought', details: err.message });
  }
};

export const removeThought = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid thought ID format' });
    }

    const thought = await Thought.findById(id);

    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    if (thought.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: 'You are not allowed to delete this thought' });
    }

    await thought.deleteOne();
    res.status(200).json({ message: 'Thought deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Could not delete thought', details: err.message });
  }
};
