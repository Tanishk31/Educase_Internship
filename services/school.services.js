const db = require('../db');

// Function to get all schools
module.exports.getAllSchools = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM schools");
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Function to add a new school
module.exports.addSchool = async (schoolData) => {
    const { name, address, latitude, longitude } = schoolData;

    // Input validation
    if (!name || !address || !latitude || !longitude) {
        throw new Error('All fields are required.');
    }

    try {
        const result = await db.query("INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)", [name, address, latitude, longitude]);
        return result[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Function to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        0.5 - Math.cos(dLat) / 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        (1 - Math.cos(dLon)) / 2;

    return R * 2 * Math.asin(Math.sqrt(a));
};

// Function to get schools sorted by proximity
module.exports.getSchoolsByProximity = async (userLat, userLon) => {
    try {
        const [rows] = await db.query("SELECT * FROM schools");

        // Sort schools by distance to the user's location
        const sortedSchools = rows.map(school => ({
            ...school,
            distance: calculateDistance(userLat, userLon, school.latitude, school.longitude),
        })).sort((a, b) => a.distance - b.distance);

        return sortedSchools;
    } catch (err) {
        console.error(err);
        throw err;
    }
};