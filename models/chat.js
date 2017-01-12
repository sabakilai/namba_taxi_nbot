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
  data: {
    type: [{}]
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now,
    required: true
  }

});

module.exports = mongoose.model('Chat', chat);