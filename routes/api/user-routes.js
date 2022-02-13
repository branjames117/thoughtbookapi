const router = require('express').Router();
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
} = require('../../controllers/user-controller');

// GET /api/users - returns list of all users
// POST /api/users - creates new user
router.route('/').get(getAllUsers).post(createUser);

// GET /api/users/:userId - gets 1 user by ID
// PUT /api/users/:userId - updates 1 user by ID
// DELETE /api/users/:userId - deletes 1 user by ID
router.route('/:userId').get(getUserById).put(updateUser).delete(deleteUser);

// POST /api/users/:userId/friends/:friendId - adds friend to user's list
// DELETE /api/users/:userId/friends/:friendId - deletes friend
router.route('/:userId/friends/:friendId').post(addFriend).delete(deleteFriend);

module.exports = router;
