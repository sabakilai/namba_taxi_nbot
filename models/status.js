var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var status = new Schema({
  chat_id: {
    type: Number,
    required: true
  },
  order_id: {
    type: Number,
    required: true
  },
  status: {
    type: Number,
    required: true
  },
  api_url: {
    type: String,
    required: true
  }
},{
  timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Status', status);