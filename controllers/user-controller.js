const { Types } = require('mongoose');
const { User } = require('../models');

const userController = {
  async getAllUsers(req, res) {
    try {
      const users = await User.find({})
        .populate({ path: 'thoughts', select: '-__v' })
        .populate({ path: 'friends', select: '-__v' })
        .select('-__v')
        .sort({ _id: -1 });

      if (!users) {
        throw new Error('No users found in the database.');
      }

      return res.json(users);
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },

  async createUser({ body }, res) {
    try {
      const createdUser = await User.create(body);

      if (!createdUser) {
        throw new Error('Creation failed! Something went wrong.');
      }

      return res.json(createdUser);
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },

  async getUserById({ params }, res) {
    try {
      const user = await User.findOne({ _id: params.userId })
        .populate({ path: 'thoughts', select: '-__v' })
        .populate({ path: 'friends', select: '-__v' })
        .select('-__v');

      if (!user) {
        throw new Error('No user found with this ID.');
      }

      return res.json(user);
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },

  async updateUser({ params, body }, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: params.userId },
        body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedUser) {
        throw new Error('Update failed! No user found with this ID.');
      }

      return res.json(updatedUser);
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },

  async deleteUser({ params }, res) {
    try {
      const deletedUser = await User.findOneAndDelete({ _id: params.userId });

      if (!deletedUser) {
        throw new Error('Delete failed! No user found with this ID.');
      }

      return res.json(deletedUser);
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },

  async addFriend({ params, body }, res) {
    try {
      // check that friend exists
      const friend = await User.findOne({ _id: params.friendId });

      if (!friend) {
        throw new Error('Add friend failed! No user found with this ID.');
      }

      // check if friend is already in user's friends list
      const checkedUser = await User.findOne({
        _id: params.userId,
        friends: {
          _id: Types.ObjectId(params.friendId),
        },
      });

      // if so, error out
      if (checkedUser) {
        throw new Error('Add friend failed! User already in friends list.');
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: friend._id } },
        { new: true }
      ).select('-__v');

      if (!updatedUser) {
        throw new Error('Add friend failed! No user found with this ID.');
      }

      return res.json(updatedUser);
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },

  async deleteFriend({ params }, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      ).select('-__v');

      if (!updatedUser) {
        throw new Error('Delete friend failed! No user found with this ID.');
      }

      return res.json(updatedUser);
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },
};

module.exports = userController;
