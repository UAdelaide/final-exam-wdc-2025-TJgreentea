const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all walk requests (for walkers to view)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        wr.request_id,
        d.name           AS dog_name,
        wr.requested_time,
        wr.duration_minutes,
        wr.location,
        u.username       AS owner_username
      FROM WalkRequests wr
      JOIN Dogs d  ON wr.dog_id  = d.dog_id
      JOIN Users u ON d.owner_id = u.user_id
      WHERE wr.status = 'open'
    `); // SQL is now wrapped in backticks for a valid multiline string
    res.json(rows);
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).json({ error: 'Failed to fetch walk requests' });
  }
});

// POST a new walk request (from owner)
router.post('/', async (req, res) => {
  const { dog_id, requested_time, duration_minutes, location } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO WalkRequests
        (dog_id, owner_id, requested_time, duration_minutes, location, status)
      VALUES (?, ?, ?, ?, ?, 'open')
    `, [
      dog_id,
      req.session.user.user_id, // include owner_id from the session
      requested_time,
      duration_minutes,
      location
    ]); // Removed stray comma after VALUES
    res.status(201).json({ message: 'Walk request created', request_id: result.insertId });
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).json({ error: 'Failed to create walk request' });
  }
});

// POST an application to walk a dog (from walker)
router.post('/:id/apply', async (req, res) => {
  const requestId = req.params.id;
  const { walker_id } = req.body;

  try {
    await db.query(`
      INSERT INTO WalkApplications (request_id, walker_id)
      VALUES (?, ?)
    `, [requestId, walker_id]);

    await db.query(`
      UPDATE WalkRequests
      SET status = 'accepted'
      WHERE request_id = ?
    `, [requestId]);

    res.status(201).json({ message: 'Application submitted' });
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).json({ error: 'Failed to apply for walk' });
  }
});


router.get('/:dogs', async (req, res) =>{

  try {
    const ownerID= req.session.user.user_id;
    const [rows] = await db.query(`
      SELECT
        dog_id,name
        FROM Dogs
      WHERE owner_id = ?
    `, [ownerID]);
    res.json(rows);
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});



module.exports = router;
