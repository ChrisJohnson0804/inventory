var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
    {
        name: {type: String, required: true, maxlength: 100},
        description: {type: String, required: true, maxlength: 300},
        price: {type: Number, required: true},
        count: {type: Number, required: true},
        category: [{type: Schema.Types.ObjectId, ref: 'Category'}]
    }

);

//Virtual for item's URL

ItemSchema
.virtual('url')
.get(function () {
    return '/catalog/item/' + this._id;
});

//Export Model
module.exports = mongoose.model('Item', ItemSchema);