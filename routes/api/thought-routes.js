const router = require('express').Router();
const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction
} = require('../../controllers/thought-controller');

// Set up GET all and POST at /api/users
router
  .route('/')
  .get(getAllThoughts)
  .post(createThought);

// Set up GET one, PUT, and DELETE at /api/users/:id
router
  .route('/:thoughtId')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

// POST and DELETE thoughts and reactions
router
  .route('/:thoughtId/reactions')
  .post(addReaction);

router
  .route('/:thoughtId/reactions/:reactId')
  .delete(removeReaction);
  
module.exports = router;