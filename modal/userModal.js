const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email : {type: String, require},
    username : {type: String, require},
    password : {type: String, require}
});

const User = mongoose.model('User', userSchema);


module.exports = User;