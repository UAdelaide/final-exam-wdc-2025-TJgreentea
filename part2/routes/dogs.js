const express=require('express');
const router=express.Router();
const db =require('../models/db');
router.get('/api/dogs', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT
          d.name         AS dog_name,
          d.size,
          u.username     AS owner_username
        FROM Dogs d
        JOIN Users u
          ON d.owner_id = u.user_id
      `);


      res.json(rows);
    } catch (err) {
      console.error('Error in /api/dogs:', err);
      res.status(500).json({ error: err.message });
    }
  });


   module.exports=router;