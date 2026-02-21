let refreshToken = [];

exports.saveRefreshToken = (token) => {
    refreshToken.push(token);
};

exports.isValidRefreshToken = (token) => {
    return refreshToken.includes(token);
};