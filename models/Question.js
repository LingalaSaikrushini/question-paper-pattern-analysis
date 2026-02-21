const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  marks: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);
