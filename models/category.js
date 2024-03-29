var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema( {

    name: {type: String, required: true, maxlength: 100},
    description: {type: String, required: true, maxlength: 100}

});

//Virtual for Category's URL
CategorySchema
.virtual('url')
.get(function () {
    return '/catalog/category/' + this._id;
});

//Export Model

module.exports = mongoose.model('Category', CategorySchema);