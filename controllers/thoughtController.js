import { Thought } from '../models/Thoughts.js';

export const listAllThoughts = async (req, res) => {
  const sortBy = req.query.sortBy || 'createdAt';
  const sortDir = req.query.sortDir === 'ascending' ? 1 : -1;

  const page = Math.max(Number(req.query.page) || 1, 1); // min = 1
  const rawLimit = Number(req.query.limit) || 10;
  const limit = Math.min(Math.max(rawLimit, 1), 100); // mellan 1 och 100
  const skip = (page - 1) * limit;

  try {
    const totalCount = await Thought.countDocuments();

    const thoughts = await Thought.find()
      .sort({ [sortBy]: sortDir })
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      results: thoughts,
    });
  } catch (error) {
    console.error('Mongoose error on listAllThoughts:', error);
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

  // Validate message length
  if (!message || message.length < 5 || message.length > 140) {
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
      { $inc: { likes: 1 } }, // 💥 Mongoose "increment"
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

    if (thought.likes > 0) {
      thought.likes -= 1;
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
    const removedThought = await Thought.findByIdAndDelete(id);

    if (!removedThought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    res.json({
      message: `Thought: "${removedThought.message}" removed successfully`,
      removedThought,
    });
  } catch (error) {
    console.error('Mongoose error on removeThought:', error);
    res.status(400).json({
      error: 'Invalid ID format or other error',
      message: error.message,
    });
  }
};
