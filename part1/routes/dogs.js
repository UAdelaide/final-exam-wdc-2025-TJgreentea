// GET /api/dogs
app.get('/api/dogs', async (req, res) => {
    try {
      const pool = req.app.locals.pool;

      SELECT
          d.name         AS dog_name,
          d.size,
          u.username     AS owner_username
        FROM Dogs d
        JOIN Users u
          ON d.owner_id = u.user_id
      `);

      //
      res.json(rows);
    } catch (err) {
      console.error('Error in /api/dogs:', err);
      res.status(500).json({ error: err.message });
    }
  });
