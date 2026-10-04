const pooo=require("../config/db");
const pool = require("../config/db");

const submitRating= async(req ,res)=>{
    try{
        const {store_id,rating }=req.body;
        const userId=req.user.id;

        if(!store_id || !rating || rating<1 || rating>5){
            return res.status(400).json({message:"Rating must be between 1 and 5"});
        }

        await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, store_id)
       DO UPDATE SET rating = $3`,
      [userId, store_id, rating]
    );

     res.json({ message: "Rating saved" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });

    }
};

module.exports={submitRating};