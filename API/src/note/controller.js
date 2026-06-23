const sequelize = require('../common/database');
const defineNote = require('../common/models/Note');
const Note = defineNote(sequelize);

function checkDateFormat(value) {
  // Matches strings like "2022-08-25T09:39:19.288Z"
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

  return typeof value === 'string' && isoDateRegex.test(value)
}

exports.getNote = async (req, res) => {
    const note = await Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.status(200).json({ success: true, data: note });
};

exports.getAllNotes = async (req, res) => {
    const notes = await Note.findAll();
    res.status(200).json({ success: true, data: notes });
};

exports.createNote = async (req, res) => {
    try {
        const { userId, eventDate, description, timeRidden } = req.body;
        if (typeof userId !== 'number') {
            throw new TypeError("userId must be a number");
        } 
        if (typeof eventDate !== 'string' || !checkDateFormat(eventDate)) {
            throw new TypeError("eventDate must be an ISO date string");
        }
        if (typeof timeRidden !== 'undefined') {
            if (typeof timeRidden !== 'number') {
                throw new TypeError("timeRidden must be a number");
            }
        }
        if (typeof description !== 'undefined') {
            if (typeof description !== 'string') {
                throw new TypeError("description must be a string");
            }
        }
        const note = await Note.create({
            "userId": userId,
            "createdAt": new Date(),
            "updatedAt": new Date(),
            "eventDate": eventDate ?? new Date(),
            "description": description,
            "timeRidden": timeRidden
        });
        res.status(201).json({
            success: true,
            data: note
        });
    } catch (err) {
        if (err instanceof TypeError) {
            res.status(400).json({ success: false, error: err.message });
        } else {
            res.status(500).json({ success: false, error: err.message });
        }
    }
};

exports.updateNote = async (req, res) => {
    const note = await Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    const updatableFields = ["description", "timeRidden", "eventDate"];
    for (const field of updatableFields) {
        const value = req.body[field];
        if (value !== undefined) {
            note[field] = value;
        }
    }
    note.updatedAt = new Date();
    await note.save();

    res.status(200).json({
        success: true,
        data: note
    });
}

exports.deleteNote = async (req, res) => {
    const note = await Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ error: 'No notes found for the provided `id`' });
    await note.destroy();

    res.status(204);
}