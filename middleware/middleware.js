const Middleware = {
    protectedRoute: function (req, res, next) {
        req.user ?
            next() :
            res.status(403).json({
                success: false,
                message: "You are not authorized to do the action."
            })
    }
}

module.exports = Middleware;