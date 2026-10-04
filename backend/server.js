const express=require("express");
const cors=require("cors");
require("dotenv").config();
const pool=require("./config/db");
const authroutes=require("./routes/authroutes");
const { verifyToken, checkRole } = require("./middleware/authMiddleware");
const storeRoutes = require("./routes/storeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

const app=express();


app.use(cors());
app.use(express.json());

app.use("/auth",authroutes);
app.use("/stores", storeRoutes);
app.use("/ratings", ratingRoutes);
app.use("/admin", adminRoutes);
app.use("/owner", ownerRoutes);

app.get("/admin-test", verifyToken, checkRole("admin"), (req, res) => {
  res.json({ message: "Welcome admin" });
});

app.get("/",(req,res)=>{
    res.send("Server  is running");

});


app.get("/test-db", async(req,res)=>{
    try{
        const result=await pool.query("SELECT NOW()");
        res.json(result.rows);

    }
     
    catch(error){
        res.status(500).json({message:"Database error"});
    }
});

app.listen(5000,()=>{
    console.log(("server is running"));
    
})
