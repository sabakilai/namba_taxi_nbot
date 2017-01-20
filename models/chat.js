var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chat = new Schema({
  state: {
    type: Number,
    required: true
  },
  chat_id: {
    type: Number,
    required: true
  },
  api_url: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: null
  },
  fare : {
    type: String,
    default: null
  },
  phone_number:{
    type: String,
    default: null
  },{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
  }
});

module.exports = mongoose.model('Chat', chat);