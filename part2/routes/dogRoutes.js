// routes/dogRoutes.js
const express = require('express');
const router  = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = req.app.locals.pool;  // your MySQL pool
    const [rows] = await pool.query(`
      SELECT
        d.dog_id,
        d.name,
        d.size,
        u.username AS owner_username
      FROM Dogs d
      JOIN Users u ON d.owner_id = u.user_id
    `);
    res.json(rows);  // [{ dog_id, name, size, owner_username }, …]
  } catch (err) {
    console.error('Error in GET /api/dogs:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
