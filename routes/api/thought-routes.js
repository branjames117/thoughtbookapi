const router = require('express').Router();
const {
  getAllThoughts,
  createThought,
  getThoughtById,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} = require('../../controllers/thought-controller');

// GET /api/thoughts - returns list of all thoughts from all users
// POST /api/thoughts - creates new thought
router.route('/').get(getAllThoughts).post(createThought);

// GET /api/thoughts/:thoughtId - gets 1 thought by ID
// PUT /api/thoughts/:thoughtId - updates 1 thought by ID
// DELETE /api/thoughts/:thoughtId - deletes 1 thought by ID
router
  .route('/:thoughtId')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

// POST /api/thoughts/:thoughtId/reactions - adds reaction to thought
router.route('/:thoughtId/reactions').post(addReaction);

// DELETE /api/thoughts/:thoughtId/reactions/:reactionId - deletes reaction
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);

module.exports = router;
