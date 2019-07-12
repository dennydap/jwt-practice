const
    express = require('express'),
    jwt = require('jsonwebtoken'),
    dotenv = require('dotenv'),
    router = express.Router(),

    middleware = require('../middleware/middleware');

router.get('/', function (req, res, next) {
    res.status(200).json({
        success: true,
        message: "Hello, this is JWT Practice"
    })
})

router.get('/admin', middleware.protectedRoute, function (req, res, next) {
    res.status(200).json({
        success: true,
        message: "Hello Admin. Welcome to JWT Practice"
    })
})

module.exports = router;