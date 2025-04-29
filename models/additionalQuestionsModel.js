const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const additionalQuestionsSchema = new Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', 
    required: true
  },
  FirstQuestion: { type: String,   required: true},
  SecondQuestion: { type: String ,   required: true},
  ThirdQuestion: { type: String ,   required: true},
  FourthQuestion: { type: String,  required: true }
  ,
});

module.exports = mongoose.model('additionalQuestions', additionalQuestionsSchema);

