const pool=require("../config/db");

const addStore=async(req ,res)=>{
    try{
        const{name,email,address,owner_id}=req.body;
        
        if(!name || name.length<20 || name.length>60){
            return res.status(400).json({message:"Name should be between 20 and 60 characters"});

        }
        
        const emailPattern= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!email || !emailPattern.test(email)) {
      return res.status(400).json({ message: "Email is not correct" });
    }

    if (address && address.length > 400) {
      return res.status(400).json({ message: "Address cannot be more than 400 characters" });
    }

    await pool.query(
        "INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4)",
        [name,email,address,owner_id]
    );

    res.status(201).json({message:"Store added"});

    }
    catch (error){
        console.log(error);
        res.status(500).json({message:"Server error"});
    }
};



const getStores = async (req, res) => {
  try {
    const search = req.query.search || "";
    const sort = req.query.sort === "address" ? "s.address" : "s.name";
    const order = req.query.order === "desc" ? "DESC" : "ASC";
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT s.id, s.name, s.email, s.address,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS overall_rating,
        (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = $1) AS my_rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.name ILIKE $2 OR s.address ILIKE $2
       GROUP BY s.id
       ORDER BY ${sort} ${order}`,
      [userId, "%" + search + "%"]
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports={addStore,getStores};