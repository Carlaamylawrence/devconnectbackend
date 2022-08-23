const express = require("express");
const router = express.Router();
const con = require("../lib/db.connection");

router.get("/users", (req, res) => {
  try {
    con.query("SELECT * FROM users", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    // res.status(400).send(error);
  }
});

// ADD A USER
router.post("/users", (req, res) => {
  const {
    userRole,
    email,
    password,
    bio,
    location,
    availability,
    experience,
    technology,
    portUrl,
    githubUrl,
    projects,
  } = req.body;
  try {
    con.query(
      `INSERT INTO users (userRole,
    email,
    password,
    bio,
    location,
    availability,
    experience,
    technology,
    portUrl,
    githubUrl,
    projects) values ("${userRole}",${email}","${password}","${bio}","${location}","${availability}","${experience}","${technology}","${portUrl}", ${githubUrl}","${projects}")`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
        console.log("user added");
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// DELETE A USER
router.delete("/:id", (req, res) => {
  try {
    let sql = "Delete from users WHERE ?";
    let users = { user_id: req.params.id };
    con.query(sql, users, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
