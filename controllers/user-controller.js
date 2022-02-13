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
        return res.status(400).json({ message: 'No users found in database.' });
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
        return res
          .status(400)
          .json({ message: 'Something went wrong! User not created.' });
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
        return res.status(400).json({ message: 'No user found with this ID.' });
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
        return res
          .status(400)
          .json({ message: 'Update failed! No user found with this ID.' });
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
        return res
          .status(400)
          .json({ message: 'Delete failed! No user found with this ID.' });
      }

      return res.json(deletedUser);
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },

  async addFriend({ params, body }, res) {
    try {
      const friend = await User.findOne({ _id: params.friendId });

      if (!friend) {
        return res
          .status(400)
          .json({ message: 'Add friend failed! No user found with this ID.' });
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: friend._id } },
        { new: true }
      )
        .populate({ path: 'friends', select: '-__v' })
        .select('-__v');

      if (!updatedUser) {
        return res
          .status(400)
          .json({ message: 'Add friend failed! No user found with this ID.' });
      }

      return res.json(updatedUser);
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },

  async deleteFriend({ params }, res) {
    console.log(params.friendId);
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      )
        .populate({ path: 'friends', select: '-__v' })
        .select('-__v');

      if (!updatedUser) {
        return res.status(400).json({
          message: 'Delete friend failed! No user found with this ID.',
        });
      }

      return res.json(updatedUser);
    } catch ({ message }) {
      return res.status(500).json({ message });
    }
  },
};

module.exports = userController;
