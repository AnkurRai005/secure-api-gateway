exports.requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const timestamp = new Date().toISOString();
        const user = req.user ? `User ID: ${req.user.id}` : "Unauthenticated";

        console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - ${user} -  ${duration}ms`);
    });
    next();
};