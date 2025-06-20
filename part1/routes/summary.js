// GET /api/walkers/summary
app.get('/api/walkers/summary', async (req, res) => {
    try {
      const pool = req.app.locals.pool;

      const [rows] = await pool.query(`
        SELECT
          u.username               AS walker_username,
          COUNT(r.rating_id)       AS total_ratings,
          AVG(r.rating)            AS average_rating,
          COUNT(
            CASE
              WHEN a.status = 'accepted'
               AND wr.status = 'completed'
              THEN 1
              ELSE NULL
            END
          )                         AS completed_walks
        FROM Users u
        LEFT JOIN WalkApplications a
          ON u.user_id = a.walker_id
        LEFT JOIN WalkRequests wr
          ON a.request_id = wr.request_id
        LEFT JOIN WalkRatings r
          ON r.request_id = wr.request_id
         AND r.walker_id   = u.user_id
        WHERE u.role = 'walker'
        GROUP BY u.username
      `);

      res.json(rows);
    } catch (err) {
      console.error('Error in /api/walkers/summary:', err);
      res.status(500).json({ error: err.message });
    }
  });
