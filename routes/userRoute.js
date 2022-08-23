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

module.exports = router;
