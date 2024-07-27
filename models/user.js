const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Define the User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    aadharCardNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
});


//password with hash password+salt
userSchema.pre('save', async function(next){

    const person = this;
    //Hash the password only if it has been modified (or is new)
    if(!person.isModified('password')) return next();

    try{
        //Hash password generation
        const salt = await bcrypt.genSalt(10);

        //Hash password
        const hasedPassword = await bcrypt.hash(person.password, salt);

        //Override the plain password with the hashed one
        person.password = hasedPassword;

        next(); //proceed now save in db
    }catch(err){
        return next(err);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        //Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }

    //akash ---> wedfghjksdfghjkrtyui
    //login ---> gupta

    //wedfghjksdfghjkrtyui  ---> extract salt
    //salt + gupta  ---> hash ---> erghjkdfghjrtyucvbgh

}

//Create User model
const User = mongoose.model('User', userSchema);
module.exports = User;