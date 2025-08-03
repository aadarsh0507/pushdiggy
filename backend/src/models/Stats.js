import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
  monthsExperience: {
    type: String,
    required: true,
    default: '6+'
  },
  uptimeGuarantee: {
    type: String,
    required: true,
    default: '99.9%'
  },
  projectsCompleted: {
    type: String,
    required: true,
    default: '5+'
  }
}, { timestamps: true });

// Ensure only one stats document exists
statsSchema.statics.getStats = async function() {
  let stats = await this.findOne();
  if (!stats) {
    stats = await this.create({
      monthsExperience: '6+',
      uptimeGuarantee: '99.9%',
      projectsCompleted: '5+'
    });
  }
  return stats;
};

const Stats = mongoose.model('Stats', statsSchema);

export default Stats; 