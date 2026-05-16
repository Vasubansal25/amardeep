const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// POST /api/tasks — Create task (Admin only)
router.post('/', auth, roleCheck('admin'), [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('project').notEmpty().withMessage('Project is required'),
  body('dueDate').notEmpty().withMessage('Due date is required')
    .isISO8601().withMessage('Invalid date format'),
  body('description').optional().trim(),
  body('assignedTo').optional(),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('category').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { title, description, project, assignedTo, priority, category, dueDate } = req.body;

    // Verify project exists and user owns it
    const proj = await Project.findOne({ _id: project, owner: req.user._id });
    if (!proj) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    // If assigning to someone, verify they are registered and a member is created if needed
    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        return res.status(404).json({ message: 'Assigned user not found' });
      }
      if (assignedUser.role !== 'member') {
        return res.status(400).json({ message: 'Assigned user must be a member' });
      }
      if (!proj.members.some(m => m.toString() === assignedTo)) {
        proj.members.push(assignedTo);
        await proj.save();
      }
    }

    const task = new Task({
      title,
      description: description || '',
      project,
      assignedTo: assignedTo || null,
      assignedBy: req.user._id,
      priority: priority || 'medium',
      category: category || 'General',
      dueDate
    });

    await task.save();
    await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'assignedBy', select: 'name email' },
      { path: 'project', select: 'name' }
    ]);

    res.status(201).json({ task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/tasks — List tasks (with filters)
router.get('/', auth, async (req, res) => {
  try {
    const { project, status, assignedTo } = req.query;
    const filter = {};

    if (project) filter.project = project;
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;

    // If member, only show tasks assigned to them
    if (req.user.role === 'member') {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    console.error('List tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/tasks/:id — Get task detail
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('project', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Members can only see tasks assigned to them
    if (req.user.role === 'member' && 
        task.assignedTo?._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/tasks/:id — Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role === 'admin') {
      // Admin can update everything
      const { title, description, assignedTo, priority, category, dueDate, status } = req.body;
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (assignedTo !== undefined) {
        if (assignedTo) {
          const assignedUser = await User.findById(assignedTo);
          if (!assignedUser) {
            return res.status(404).json({ message: 'Assigned user not found' });
          }
          if (assignedUser.role !== 'member') {
            return res.status(400).json({ message: 'Assigned user must be a member' });
          }
          const project = await Project.findById(task.project);
          if (project && !project.members.some(m => m.toString() === assignedTo)) {
            project.members.push(assignedTo);
            await project.save();
          }
          task.assignedTo = assignedTo;
        } else {
          task.assignedTo = null;
        }
      }
      if (priority) task.priority = priority;
      if (category) task.category = category;
      if (dueDate) task.dueDate = dueDate;
      if (status) task.status = status;
    } else {
      // Member can only update status of tasks assigned to them
      if (task.assignedTo?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      if (req.body.status) {
        task.status = req.body.status;
      } else {
        return res.status(400).json({ message: 'Members can only update task status' });
      }
    }

    await task.save();
    await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'assignedBy', select: 'name email' },
      { path: 'project', select: 'name' }
    ]);

    res.json({ task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/tasks/:id — Delete task (Admin only)
router.delete('/:id', auth, roleCheck('admin'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify admin owns the project
    const project = await Project.findOne({ _id: task.project, owner: req.user._id });
    if (!project) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
