const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, '60D2DB614461D5182989B338489C82FFA92ECBB3C3FA68D2AE9F5B32DD942541');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = verifyToken;
