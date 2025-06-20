app.get('/api/dogs', async (req, res) => {
    try {
      // get the pool you initialized on startup
      const pool = req.app.locals.pool;

      // fetch all dogs with their size and owner’s username
      const [rows] = await pool.query(`
        SELECT
          d.name         AS dog_name,
          d.size,
          u.username     AS owner_username
        FROM Dogs d
        JOIN Users u
          ON d.owner_id = u.user_id
      `);

      // return as JSON
      res.json(rows);
    } catch (err) {
      console.error('Error in /api/dogs:', err);
      res.status(500).json({ error: err.message });
    }
  });
