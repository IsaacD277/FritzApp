const router = require('express').Router();
const NoteController = require('./controller');

router.post('/', NoteController.createNote);
router.get('/', NoteController.getAllNotes);
router.get('/:id', NoteController.getNote);
router.patch('/:id', NoteController.updateNote);

module.exports = router;