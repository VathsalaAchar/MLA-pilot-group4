const express = require('express');
const router = express.Router();
const WeeklyTarget = require('../models/weeklytarget.model');

// GET: Retrieve all weeklytargets
router.get('/', async (req, res) => {
    try {
        const weeklytargets = await WeeklyTarget.find();
        res.json(weeklytargets);
    } catch (error) {
        res.status(400).json({ error: 'Error: ' + error.message });
    }
});

// POST: Create a new weekly target
router.post('/add', async (req, res) => {
    try {
        const {
            username,
            runningTarget,
            cyclingTarget,
            swimmingTarget,
            gymTarget,
            otherTarget,
            weekStartDate
        } = req.body;

        const existingWeeklyTarget = await WeeklyTarget.findOne({ username, weekStartDate });

        if (existingWeeklyTarget) {
            const updatedWeeklyTarget = await WeeklyTarget.findOneAndUpdate(
                { username, weekStartDate },
                { runningTarget, cyclingTarget, swimmingTarget, gymTarget, otherTarget },
                { new: true }
            );
            return res.status(200).json(updatedWeeklyTarget);
        } else {
            const newWeeklyTarget = new WeeklyTarget({
                username,
                runningTarget,
                cyclingTarget,
                swimmingTarget,
                gymTarget,
                otherTarget,
                weekStartDate
            });

            const savedWeeklyTarget = await newWeeklyTarget.save();
            return res.status(201).json(savedWeeklyTarget);
        }
    } catch (error) {
        res.status(400).json({ error: 'Error: ' + error.message });
    }
});

// PATCH: Update an existing weekly target
router.patch('/update', async (req, res) => {
    try {
        const {
            username,
            runningTarget,
            cyclingTarget,
            swimmingTarget,
            gymTarget,
            otherTarget,
            weekStartDate
        } = req.body;

        const existingWeeklyTarget = await WeeklyTarget.findOne({ username, weekStartDate });

        if (existingWeeklyTarget) {
            // If target exists, update it
            const updatedWeeklyTarget = await WeeklyTarget.findOneAndUpdate(
                { username, weekStartDate },
                { runningTarget, cyclingTarget, swimmingTarget, gymTarget, otherTarget },
                { new: true }
            );
            return res.status(200).json(updatedWeeklyTarget);
        } else {
            // If target doesn't exist, return a meaningful error message
            return res.status(404).json({ error: 'Weekly target not found for update. Create a new one instead.' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error: ' + error.message });
    }
});

module.exports = router;
