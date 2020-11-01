
const mongoose = require('mongoose');

const DiarySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  status: { type: String, enum: ['public', 'private'] , default: 'public'},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Diary', DiarySchema);