const express = require("express");
const router = express.Router();
const con = require("../lib/db.connection");

//GET ALL PROJECTS
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM projects", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    // res.status(400).send(error);
  }
});

//SINGLE PROJECTS
router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM projects where project_id= ${req.params.id} `,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.post("/", (req, res) => {
  try {
    let sql = `INSERT INTO projects (description, type, deadline, tech, postedBy) VALUES(? , ? , ? , ? , ? );`;
    let { description, type, deadline, tech, postedBy } = req.body;
    const date = new Date().toISOString().slice(0, 10);
    let project = {
      description: description,
      type: type,
      deadline: date,
      tech: tech,
      postedBy: postedBy,
    };
    con.query(
      sql,
      [
        project.description,
        project.type,
        project.deadline,
        project.tech,
        project.postedBy,
      ],
      (err, result) => {
        if (err) throw err;
        console.log(result);

        res.json({
          msg: "Project added Successfully",
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
});

router.patch("/:id", (req, res) => {
  try {
    let sql = "SELECT * FROM projects WHERE ? ";
    let project = { project_id: req.params.id };
    con.query(sql, project, (err, result) => {
      if (err) throw err;
      if (result.length !== 0) {
        let updateSql = `UPDATE projects SET ? WHERE id = ${req.params.id}`;
        let updateUser = {
          description: req.body.description,
          type: req.body.type,
          deadline: req.body.date,
          tech: req.body.tech,
          postedBy: req.body.postedBy,
        };
        con.query(updateSql, updateUser, (err, updated) => {
          if (err) throw err;
          res.send("Successfully updated Product");
        });
      } else {
        res.send("Product not found");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", (req, res) => {
  try {
    let sql = "Delete from users WHERE ?";
    let product = { product_id: req.params.id };
    con.query(sql, product, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
