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

module.exports = router;