const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    front:{
        type: String,
        required: true,
    },
    back:{
        type: String,
        required: true,
    },
    level:{
        type: String,
        default: 1,
        required: false,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
      },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = Card = mongoose.model('card', CardSchema);