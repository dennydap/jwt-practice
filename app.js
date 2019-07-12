const
    express = require('express'),
    jwt = require('jsonwebtoken'),
    dotenv = require('dotenv').config(),
    mongoose = require('mongoose'),
    app = express(),

    User = require('./models/UserSchema'),

    APIRoutes = require('./routes/api'),
    RootRoutes = require('./routes/root')

app.use(require('body-parser').json());
app.use(function (req, res, next) {
    try {
        const JWTToken = req.headers.authorization.split(" ")[1];
        jwt.verify(JWTToken, process.env.JWT_TOKEN_KEY, function (verifyError, payload) {
            console.log(payload);
            payload ?
                User.findById(payload.result.id).then((userFound) => {
                    req.user = userFound;
                    next();
                }) :
                next();
        })
    } catch (errorCaught) {
        next();
    }
});

app.use('/', RootRoutes);
app.use('/api', APIRoutes);

mongoose.connect('mongodb://localhost:27017/jwtpractice',
    {
        useNewUrlParser: true,
        useCreateIndex: true,
    }, function (mongoError) {
        mongoError ?
            console.log('MongoDB fails to start because of: ' + mongoError) :
            console.log('MongoDB starts in port 27017');
    });

app.listen("3000" || process.env.PORT, () => {
    console.log("Application running in port 3000")
})