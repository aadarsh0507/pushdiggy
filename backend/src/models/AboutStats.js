import mongoose from 'mongoose';

const aboutStatsSchema = new mongoose.Schema({
  yearsOfExcellence: {
    type: String,
    required: true,
    default: '1+'
  },
  projectsDelivered: {
    type: String,
    required: true,
    default: '5+'
  },
  uptimeGuarantee: {
    type: String,
    required: true,
    default: '99.9%'
  }
}, { timestamps: true });

// Ensure only one about stats document exists
aboutStatsSchema.statics.getAboutStats = async function() {
  let stats = await this.findOne();
  if (!stats) {
    stats = await this.create({
      yearsOfExcellence: '1+',
      projectsDelivered: '5+',
      uptimeGuarantee: '99.9%'
    });
  }
  return stats;
};

const AboutStats = mongoose.model('AboutStats', aboutStatsSchema);

export default AboutStats; 