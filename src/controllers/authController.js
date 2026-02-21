const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../config/mockUsers');
const { saveRefreshToken } = require('../config/refreshStore');
const { isValidRefreshToken } = require('../config/refreshStore');

exports.login = (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
        );

        const refreshToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
        );

        saveRefreshToken(refreshToken);

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken
        });
    } catch (error) {
        next(error);
    }
};

exports.refreshToken = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Refresh Token Required"
        });
    }

    if (!isValidRefreshToken(refreshToken)) {
        return res.status(403).json({
            success: false,
            message: "Invalid refresh token"
        });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const newAccessToken = jwt.sign(
            { id: decoded.id, role: decoded.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
        );

        res.json({
            success: true,
            accessToken: newAccessToken
        });
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: "Refresh token expired or invalid"
        });
    }
};