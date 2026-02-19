require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const {requestLogger} = require('./middleware/loggerMiddleware');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'API is running' });
});

app.use(requestLogger);
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);


app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});