const pool=require("../config/db");
const bcrypt=require("bcryptjs");


const getDashboard=async(req, res)=>{
    try{
        const users=await  pool.query("SELECT COUNT(*) FROM users");
        const stores = await pool.query("SELECT COUNT(*) FROM stores");
        const ratings = await pool.query("SELECT COUNT(*) FROM ratings");

        
        res.json({
            totalUsers:users.rows[0].count,
            totalStores:stores.rows[0].count,
            totalRatings: ratings.rows[0].count,
        });
    }

    catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
    }
};

const getUsers = async (req, res) => {
  try {
    const name = req.query.name || "";
    const email = req.query.email || "";
    const address = req.query.address || "";
    const role = req.query.role || "";

    const allowed = ["name", "email", "address", "role"];
    const sort = allowed.includes(req.query.sort) ? req.query.sort : "name";
    const order = req.query.order === "desc" ? "DESC" : "ASC";

    const result= await pool.query(
        `SELECT id, name, email, address, role FROM users
        WHERE name ILIKE $1
        AND EMAIL ILIKE $2
        AND COALESCE(address,'') ILIKE $3
        AND role LIKE $4 
        ORDER BY ${sort} ${order}`,
        ["%" + name + "%", "%" + email + "%", "%" + address + "%", "%" + role + "%"]
    );

res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }

};


const addUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    if (!name || name.length < 20 || name.length > 60) {
      return res.status(400).json({ message: "Name should be between 20 and 60 characters" });
    }

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      return res.status(400).json({ message: "Email is not correct" });
    }

    if (address && address.length > 400) {
      return res.status(400).json({ message: "Address cannot be more than 400 characters" });
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
    if (!password || !passwordPattern.test(password)) {
      return res.status(400).json({
        message: "Password must be 8 to 16 characters long and include at least 1 uppercase letter and 1 special character",
      });
    }

    if (role !== "admin" && role !== "user" && role !== "owner") {
      return res.status(400).json({ message: "Role must be admin, user or owner" });
    }


    const oldUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (oldUser.rows.length > 0) {
      return res.status(400).json({ message: "This email is already registered" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5)",
      [name, email, hashedPassword, address, role]
    );


    res.status(201).json({ message: "User added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


const getUserById = async (req, res) => {
  try {
    const id = req.params.id;


    const result = await pool.query(
      "SELECT id, name, email, address, role FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    if (user.role === "owner") {
      const rating = await pool.query(
        `SELECT COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating
         FROM stores s
         LEFT JOIN ratings r ON r.store_id = s.id
         WHERE s.owner_id = $1`,
        [id]
      );
      user.rating = rating.rows[0].rating;
    }

     res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports={ getDashboard, getUsers,addUser,getUserById };