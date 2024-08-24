const express = require('express');
const router = express.Router();
const service = require('../services/school.services');

// Endpoint to get all schools
router.get('/', async (req, res) => {
    try {
        const schools = await service.getAllSchools();
        res.json(schools);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint to add a new school
router.post('/addSchool', async (req, res) => {
    try {
        const newSchool = req.body;
        const result = await service.addSchool(newSchool);
        res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Endpoint to list schools sorted by proximity
router.get('/listSchools', async (req, res) => {
    try {
        const { latitude, longitude } = req.query;
        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const schools = await service.getSchoolsByProximity(parseFloat(latitude), parseFloat(longitude));
        res.json(schools);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;