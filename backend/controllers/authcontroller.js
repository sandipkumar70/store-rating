const pool=require("../config/db");
const bcrypt= require("bcryptjs");
const jwt=require("jsonwebtoken");


const signup= async(req ,res)=>{
    try{
        const {name, email,address ,password} =req.body;

        if(!name || name.length<20 || name.length>60){
            return res.status(400).json({message:" Name should be between 20 and 60 "});
        }

        const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!email || !emailPattern.test(email)){
            return res.status(400).json({message:"your email is not correct"});

        }

        if(address && address.length>400){
            return res.status(400).json({message:"Address can not be  more than 400 characters"});
        }

        const passwordpattern=/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
        if(!password || !passwordpattern.test(password)){
            return res.status(400).json({
                message:"Password must be  8 to 16 characters  long and include at least 1 uppercase letter and 1 special character"
            });
        }
        
        const olduser= await pool.query("SELECT*FROM users WHERE email=$1", [email]);
        if(olduser.rows.length>0){
            return res.status(400).json({message:"This email is already registered"});
        }

        const hashedpassword=await bcrypt.hash(password ,10);

        await pool.query(
            "INSERT INTO users(name, email, password, address, role) VALUES ($1,$2,$3,$4,'user')",
            [name, email ,hashedpassword ,address]
        );

        res.status(201).json({message:" Signup done"});
    }
      catch(error){
        console.log(error);
        res.status(500).json({message:"Server error"});
      }
      
};

const login =async(req,res)=>{
    try{
        const{email,password}=req.body;

        const resul= await pool.query("SELECT *FROM users WHERE  email=$1",[email]);
        if(resul.rows.length===0){
            return res.status(400).json({message:"Email or password wrong"})
        }
        const user=resul.rows[0];
        

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Email or password wrong"});

        }

        const token =jwt.sign(
            {id: user.id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        );

        res.json({
            token:token,
            user:{id:user.id,name:user.name, email:user.email,role:user.role},

        });
    }

    catch(error){
    console.log(error);
    res.status(500).json({message:"Server error"});

    }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const passwordPattern = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
    if (!newPassword || !passwordPattern.test(newPassword)) {
      return res.status(400).json({
        message: "Password must be 8 to 16 characters long and include at least 1 uppercase letter and 1 special character",
      });
    }

    const result = await pool.query("SELECT password FROM users WHERE id = $1", [userId]);
    const user = result.rows[0];

   const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is wrong" });
    }

 const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, userId]);

    res.json({ message: "Password updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};




module.exports={signup,login, updatePassword};


