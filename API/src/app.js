const express = require('express');
const app = express();
const sequelize = require('./common/database');
const noteRoutes = require('./note/routes');

sequelize.sync();

app.use(express.json());

app.get('/status', (req, res) => {
    res.json({
        status: 'Running',
        timestamp: new Date().toISOString()
    });
});

app.use('/note', noteRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));