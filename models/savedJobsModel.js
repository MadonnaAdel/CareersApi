const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SavedJobSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
      }
      
});
SavedJobSchema.statics.countSavedJobsByUser = async function (userId) {
    try {
        const count = await this.countDocuments({ userId });
        return count;
    } catch (err) {
        throw err;
    }
};

const SavedJobModel = mongoose.model('SavedJob', SavedJobSchema);
module.exports = SavedJobModel;
