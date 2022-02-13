const { Thought, User } = require('../models');

const thoughtController = {
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find({}).select('-__v').sort({ _id: -1 });

      if (thoughts?.length === 0) {
        throw new Error('No thoughts found in the database.');
      }

      return res.json(thoughts);
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },

  async createThought({ body }, res) {
    try {
      const user = await User.findOne({ username: body.username });

      if (!user) {
        throw new Error('Creation failed! No user found with this username.');
      }

      const createdThought = await Thought.create(body);

      if (!createdThought) {
        throw new Error('Creation failed! Something went wrong.');
      }

      const updatedUser = await User.findOneAndUpdate(
        { username: body.username },
        { $push: { thoughts: createdThought._id } },
        { new: true }
      ).select('-__v');

      if (!updatedUser) {
        throw new Error('User update failed! Something went wrong.');
      }

      return res.json(updatedUser);
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },

  async getThoughtById({ params }, res) {
    try {
      const thought = await Thought.findOne({ _id: params.thoughtId }).select(
        '-__v'
      );

      if (!thought) {
        throw new Error('No user found with this ID.');
      }

      return res.json(thought);
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },

  updateThought(req, res) {},
  deleteThought(req, res) {},
  addReaction(req, res) {},
  deleteReaction(req, res) {},
};

module.exports = thoughtController;
