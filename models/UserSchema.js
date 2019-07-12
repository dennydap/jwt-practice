const
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt');

/* Schema Definnition */
const UserSchema = new mongoose.Schema({
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        }
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: new Date()
    }
})

/* Triggers */
UserSchema.pre('save', function (next) {
    var User = this;
    if (!User.isModified('password')) { return next() }
    bcrypt.hash(User.password, 10).then((hashedPassword) => {
        User.password = hashedPassword;
        next();
    })
})

/* Methods */
UserSchema.methods = {
    comparePassword: function (input, next) {
        bcrypt.compare(input, this.password, function (compareError, compareMatch) {
            compareError ? next(compareError) : next(null, compareMatch)
        })
    }
}

module.exports = mongoose.model("User", UserSchema)