const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {restrictTo} = require('../middleware/roleMiddleware');

router.get('/profile', protect, (req, res) => {
    res.json({
        message: "Access granted",
        user: req.user
    });
});

router.get('/admin', protect, restrictTo('admin'), (req, res) => {
    res.json({
        success: true,
        message: "Welcome Admin",
        user: req.user
    })
});

module.exports = router;