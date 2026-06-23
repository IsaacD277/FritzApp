const { DataTypes } = require('sequelize');

const NoteModel = {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    userId: { type: DataTypes.INTEGER },
    description: { type: DataTypes.STRING, allowNull: true },
    timeRidden: { type: DataTypes.INTEGER, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
    eventDate: { type: DataTypes.DATE, allowNull: false }
};

module.exports = (sequelize) => sequelize.define('note', NoteModel);