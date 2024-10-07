const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const articleSchema = new Schema({
    author : {type : Schema.Types.ObjectId, ref : 'User', required : true},
    content : {type : String, required : true},
    createdDate : {type : Date, default : Date.now},
    updateDate : {type : Date, default : Date.now},
    title: {type : String, required : true},
    year : {type : Number},
    committee : {type : Number},
    course : {type : String}
});

articleSchema.pre('save', function(next) {
    this.updateDate = Date.now();
    next();
});

const Article = mongoose.model('Article', articleSchema);


module.exports = Article;