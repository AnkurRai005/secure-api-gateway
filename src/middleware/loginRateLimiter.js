const loginAttempts = {};

const loginRateLimiter = (req, res, next) => {
    const ip = req.ip;
    const currentTime = Date.now();
    const windowSize = 60 * 1000;
    const maxAttempts = 5;

    if (!loginAttempts[ip]) {
        loginAttempts[ip] = [];
    }

    loginAttempts[ip] = loginAttempts[ip].filter(
        timestamp => currentTime - timestamp < windowSize
    );

    if (loginAttempts[ip].length > 0) {
        loginAttempts[ip].push(currentTime);
    } else {
        loginAttempts[ip] = [currentTime];
    }

    if (loginAttempts[ip].length > maxAttempts) {
        return res.status(429).json({
            success: false,
            message: "Too many login attempts. Try again later."
        });
    }

    next();
};

module.exports = loginRateLimiter;