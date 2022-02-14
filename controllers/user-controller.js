const { Types } = require('mongoose');
const { User, Thought } = require('../models');

const userController = {
  async getAllUsers(req, res) {
    try {
      const users = await User.find({})
        .populate({ path: 'thoughts', select: '-__v' })
        .populate({ path: 'friends', select: '-__v' })
        .select('-__v')
        .sort({ _id: -1 });

      if (users?.length === 0) {
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
        throw new Error('User creation failed! Something went wrong.');
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
        throw new Error(`User not found (ID: ${params.userId}).`);
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
        throw new Error(
          `User update failed! User not found (ID: ${params.userId}).`
        );
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
        throw new Error(
          `User delete failed! User not found (ID: ${params.userId}).`
        );
      }

      // delete user's associated thoughts
      await Thought.deleteMany({
        username: deletedUser.username,
      });

      // delete user from all other user's friends list
      await User.updateMany(
        {
          friends: {
            _id: Types.ObjectId(params.userId),
          },
        },
        {
          $pull: { friends: params.userId },
        }
      );

      return res.json({
        message: `User (ID: ${params.userId}) and associated thoughts deleted.`,
      });
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },

  async addFriend({ params }, res) {
    try {
      // check that friend exists
      const friend = await User.findOne({ _id: params.friendId });

      if (!friend) {
        throw new Error(
          `Add friend failed! Friend not found (ID: ${params.friendId}).`
        );
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
        throw new Error(
          `Add friend failed! Friend (ID: ${params.friendId}) already in friends list of user (ID: ${params.userId}).`
        );
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: friend._id } },
        { new: true }
      )
        .populate({ path: 'friends', select: '-__v' })
        .select('-__v');

      if (!updatedUser) {
        throw new Error(
          `Add friend failed! User not found (ID: ${params.userId}).`
        );
      }

      return res.json({
        message: `Friend (ID: ${params.friendId}) added to friends list of user (ID ${params.userId}).`,
      });
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
        throw new Error(
          `Delete friend failed! User not found (ID: ${params.userId}).`
        );
      }

      return res.json({
        message: `Friend (ID: ${params.friendId}) removed from friends list of user (ID ${params.userId}).`,
      });
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },
};

module.exports = userController;
