

function requireRole(role) {
    return (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: "You must be logged in to do that." }); //server does not know who you are
        }

        if (req.user.role !== role) {
            return res.status(403).json({ error: "You don't have permission to do that." }); // server knows but you dont have permissions
        }

        next();
    };
}

module.exports = requireRole;


