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
        throw new Error(
          `Thought creation failed! User not found (username: ${body.username}).`
        );
      }

      const createdThought = await Thought.create(body);

      if (!createdThought) {
        throw new Error('Thought creation failed! Something went wrong.');
      }

      const updatedUser = await User.findOneAndUpdate(
        { username: body.username },
        { $push: { thoughts: createdThought._id } },
        { new: true }
      ).select('-__v');

      if (!updatedUser) {
        throw new Error('User update failed! Something went wrong.');
      }

      return res.json(createdThought);
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
        throw new Error(`Thought not found (ID: ${params.thoughtId}).`);
      }

      return res.json(thought);
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },

  async updateThought({ params, body }, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedThought) {
        throw new Error(
          `Thought update failed! Thought not found (ID: ${params.thoughtId}).`
        );
      }

      return res.json(updatedThought);
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },

  async deleteThought({ params }, res) {
    try {
      const deletedThought = await Thought.findOneAndDelete({
        _id: params.thoughtId,
      });

      if (!deletedThought) {
        throw new Error(
          `Thought delete failed! Thought not found (ID: ${params.thoughtId}).`
        );
      }

      const updatedUser = await User.findOneAndUpdate(
        { username: deletedThought.username },
        { $pull: { thoughts: params.thoughtId } },
        { new: true }
      ).select('-__v');

      if (!updatedUser) {
        throw new Error(
          `User update failed! User not found (username: ${deletedThought.username}).`
        );
      }

      return res.json({
        message: `Thought (ID: ${params.thoughtId}) deleted.`,
      });
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },

  async addReaction({ params, body }, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
      );

      if (!updatedThought) {
        throw new Error(
          `Reaction creation failed! Thought not found (ID: ${params.thoughtId})`
        );
      }

      return res.json(updatedThought);
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },

  async deleteReaction({ params }, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { _id: params.reactionId } } },
        { new: true }
      );

      if (!updatedThought) {
        throw new Error(
          `Reaction delete failed! Thought not found (ID: ${params.thoughtId})`
        );
      }

      return res.json(updatedThought);
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },
};

module.exports = thoughtController;
