const
    express = require('express'),
    jwt = require('jsonwebtoken'),
    dotenv = require('dotenv'),

    User = require('../models/UserSchema'),

    router = express.Router();

router.post('/auth', function (req, res, next) {
    User.find({
        email: req.body.email
    })
        .limit(1)
        .exec(function (findError, findSuccess) {
            findError ?
                res.status(500).json({
                    success: false,
                    message: 'Failed to find User data.',
                    error: findError,
                    result: null
                }) :
                findSuccess[0].comparePassword(req.body.password, function (compareError, compareMatch) {
                    compareMatch ?
                        res.status(200).json({
                            success: true,
                            message: 'User data successfully founded.',
                            error: null,
                            result: {
                                id: findSuccess[0]._id,
                                name: findSuccess[0].name,
                                token: jwt.sign({ userID: findSuccess[0]._id }, process.env.JWT_TOKEN_KEY)
                            }
                        }) :
                        res.status(400).json({
                            success: false,
                            message: 'Invalid Email/Password.',
                            error: null,
                            result: null
                        })
                })
        })
})

/* API for Testing Purposes only */
router.post('/create/user', function (req, res, next) {
    var newUser = new User();

    newUser.email = req.body.email;
    newUser.password = req.body.password;
    newUser.name.first = req.body.name.first;
    newUser.name.last = req.body.name.last;

    newUser.save(function (saveError, saveSuccess) {
        saveError ?
            res.status(500).json({
                success: false,
                message: "Saving user to database failed.",
                result: null,
                error: saveError
            }) :
            res.status(200).json({
                success: true,
                message: "Saving user to database success.",
                result: saveSuccess,
                error: null
            })
    })
})

module.exports = router;