const sequelize = require('../common/database');
const defineNote = require('../common/models/Note');
const Note = defineNote(sequelize);

exports.getNote = async (req, res) => {
    const note = await Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json({ success: true, data: note });
};

exports.getAllNotes = async (req, res) => {
    const notes = await Note.findAll();
    res.json({ success: true, data: notes });
};

exports.createNote = async (req, res) => {
    console.log(req.body)
    try {
        const { userId, createdAt, updatedAt, eventDate, description, timeRidden } = req.body;
        const note = await Note.create({
            "userId": userId,
            "createdAt": createdAt,
            "updatedAt": updatedAt,
            "eventDate": eventDate,
            "description": description,
            "timeRidden": timeRidden
        });
        res.status(201).json({
            success: true,
            data: note
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
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