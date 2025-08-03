import AboutStats from '../models/AboutStats.js';

// Get about stats
export const getAboutStats = async (req, res) => {
  try {
    const stats = await AboutStats.getAboutStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching about stats:', error);
    res.status(500).json({ error: 'Failed to fetch about stats' });
  }
};

// Update about stats (admin only)
export const updateAboutStats = async (req, res) => {
  try {
    const { yearsOfExcellence, projectsDelivered, uptimeGuarantee } = req.body;
    
    // Validate required fields
    if (!yearsOfExcellence || !projectsDelivered || !uptimeGuarantee) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    let stats = await AboutStats.findOne();
    if (!stats) {
      stats = new AboutStats();
    }

    stats.yearsOfExcellence = yearsOfExcellence;
    stats.projectsDelivered = projectsDelivered;
    stats.uptimeGuarantee = uptimeGuarantee;

    await stats.save();
    
    res.json({ message: 'About stats updated successfully', stats });
  } catch (error) {
    console.error('Error updating about stats:', error);
    res.status(500).json({ error: 'Failed to update about stats' });
  }
}; 