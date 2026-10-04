const pool =require("../config/db");

const getOwnerDashboard=async(req, res)=>{
    try{
        const ownerId= req.user.id;

        const store=await pool.query(
            "SELECT id, name FROM stores WHERE owner_id = $1",
      [ownerId]
        );

        if (store.rows.length === 0) {
      return res.status(404).json({ message: "No store found for this owner" });
    }

    const storeId=store.rows[0].id;

    const avg=await pool.query(
    "SELECT COALESCE(ROUND(AVG(rating), 1), 0) AS average FROM ratings WHERE store_id = $1",
      [storeId]
    );

const users = await pool.query(
      `SELECT u.name, u.email, r.rating
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = $1`,
      [storeId]
    );

res.json({
      storeName: store.rows[0].name,
      averageRating: avg.rows[0].average,
      ratings: users.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });

    }
};

module.exports={getOwnerDashboard};


