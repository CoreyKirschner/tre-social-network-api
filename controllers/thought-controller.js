const Thought = require('../models/thought');
const User = require('../models/user');

const getAllThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find({});
    res.json(thoughts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createThought = async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getThoughtById = async (req, res) => {
  try {
    const thought = await Thought.findOne({
      _id: req.params.thoughtId
    })
    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateThought = async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, {
      new: true,
      runValidators: true
    });

    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteThought = async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.thoughtId);

    if (!thought) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }

    res.json({ message: 'Thought successfully deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
};

const addReaction = async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body;

    // Check if the thought exists
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    // Add the reaction to the thought's reactions array
    thought.reactions.push({ reactionBody, username });
    await thought.save();

    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeReaction = async (req, res) => {
  try {
    const { thoughtId, reactId } = req.params;

    // Check if the thought exists
    const thought = await Thought.findById(thoughtId);

    if (!thought) {
      return res.status(404).json({ message: 'Thought not found'});
    }

    // Check if the reaction exists in the thought's reactions array
    const reactionIndex = thought.reactions.findIndex(reaction => reaction._id == reactId);
    if (reactionIndex === -1) {
      return res.status(404).json({ message: 'Reaction not found in the thought' });
    }

    // Remove the reaction from teh thought's reactions array
    thought.reactions.splice(reactionIndex, 1);
    await thought.save();

    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { getAllThoughts, getThoughtById, createThought, updateThought, deleteThought, addReaction, removeReaction };