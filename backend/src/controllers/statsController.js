import Stats from '../models/Stats.js';

// Get stats
export const getStats = async (req, res) => {
  try {
    const stats = await Stats.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

// Update stats (admin only)
export const updateStats = async (req, res) => {
  try {
    console.log('Update stats request body:', req.body);
    console.log('User from request:', req.user);
    
    const { monthsExperience, uptimeGuarantee, projectsCompleted } = req.body;
    
    // Validate required fields
    if (!monthsExperience || !uptimeGuarantee || !projectsCompleted) {
      console.log('Missing fields:', { monthsExperience, uptimeGuarantee, projectsCompleted });
      return res.status(400).json({ error: 'All fields are required' });
    }

    let stats = await Stats.findOne();
    if (!stats) {
      stats = new Stats();
    }

    stats.monthsExperience = monthsExperience;
    stats.uptimeGuarantee = uptimeGuarantee;
    stats.projectsCompleted = projectsCompleted;

    await stats.save();
    
    console.log('Stats updated successfully:', stats);
    res.json({ message: 'Stats updated successfully', stats });
  } catch (error) {
    console.error('Error updating stats:', error);
    res.status(500).json({ error: 'Failed to update stats' });
  }
}; 