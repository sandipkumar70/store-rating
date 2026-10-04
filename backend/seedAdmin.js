require("dotenv").config();
const pool = require("./config/db");
const bcrypt = require("bcryptjs");

async function createAdmin() {
  try {
    // .env file se email aur password le rahe hain
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log("Please set ADMIN_EMAIL and ADMIN_PASSWORD in the .env file");
    } else {
      // pehle check kar rahe hain ki ye email pehle se hai ya nahi
      const existing = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [adminEmail]
      );

      if (existing.rows.length > 0) {
        console.log("Admin already exists");
      } else {
        // password ko hash kar rahe hain
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await pool.query(
          "INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, 'admin')",
          ["System Administrator Account", adminEmail, hashedPassword, "Head Office"]
        );

        console.log("Admin created successfully");
      }
    }
  } catch (error) {
    console.log(error);
  }

  // kaam khatam, script band kar do
  process.exit();
}

createAdmin();