const express = require('express');
const User = require('../models/User');
const Task = require('../models/Task');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// GET /api/users — List all users (Admin only)
router.get('/', auth, roleCheck('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/dashboard — Dashboard stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    let taskFilter = {};
    let projectFilter = {};

    if (req.user.role === 'member') {
      taskFilter.assignedTo = req.user._id;
      projectFilter.members = req.user._id;
    } else {
      // Admin: show tasks from projects they own
      const ownedProjects = await Project.find({ owner: req.user._id }).select('_id');
      const projectIds = ownedProjects.map(p => p._id);
      taskFilter.project = { $in: projectIds };
      projectFilter.owner = req.user._id;
    }

    // Task counts by status
    const taskCounts = await Task.aggregate([
      { $match: taskFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const counts = { new: 0, active: 0, completed: 0, failed: 0, total: 0 };
    taskCounts.forEach(tc => {
      counts[tc._id] = tc.count;
      counts.total += tc.count;
    });

    // Overdue tasks count
    const overdueCount = await Task.countDocuments({
      ...taskFilter,
      dueDate: { $lt: new Date() },
      status: { $nin: ['completed'] }
    });
    counts.overdue = overdueCount;

    // Project count
    const projectCount = await Project.countDocuments(projectFilter);

    // Recent tasks
    const recentTasks = await Task.find(taskFilter)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      taskCounts: counts,
      projectCount,
      recentTasks
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
