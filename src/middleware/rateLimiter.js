const requestStore = {};

const rateLimiter = (req, res, next) => {
    const userId = req.user.id;

    const currentTime = Date.now();
    const windowSize = 60 * 1000;
    const maxRequests = 5;

    if (!requestStore[userId]) {
        requestStore[userId] = [];
    }

    requestStore[userId] = requestStore[userId].filter(
        timestamp => currentTime - timestamp < windowSize
    );

    if (requestStore[userId].length > 0) {
        requestStore[userId].push(currentTime);
    } else {
        requestStore[userId] = [currentTime];
    }

    if (requestStore[userId].length > maxRequests) {
        return res.status(429).json({
            error: "Too many requests",
            retryAfter: 60
        });
    }


    next();
};

module.exports = rateLimiter;