const express = require("express");
const router = express.Router();
const con = require("../lib/db.connection");
const middleware = require("../middleware/auth");

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

//ADD A PROJECT
router.post("/", middleware, (req, res) => {
  if (req.user.userRole === "client" || "admin") {
    try {
      let sql = `INSERT INTO projects (title, description, type, tech, email, postedBy) VALUES(? ,? , ? , ? , ?, ? );`;
      let { title, description, type, tech, email, postedBy } = req.body;
      // const date = new Date().toISOString().slice(0, 10);
      let project = {
        title: title,
        description: description,
        type: type,
        tech: tech,
        email: email,
        postedBy: postedBy,
      };
      con.query(
        sql,
        [
          project.title,
          project.description,
          project.type,
          project.tech,
          project.email,
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
  } else {
    res.send("not authorised");
  }
});

// UPDATE A PROJECT
router.patch("/updateitem/:id", middleware, (req, res) => {
  console.log(req.user.userRole);
  if (req.user.userRole === "admin") {
    // if (userRole === "client") {
    try {
      let sql = "SELECT * FROM projects WHERE ? ";
      // let project = {
      //    project_id: req.params.id
      //    };
      console.log(req.params.id);
      con.query(
        `SELECT * FROM projects WHERE  project_id = '${req.params.id}'`,
        (err, result) => {
          if (err) throw err;
          if (result.length === 0) {
            res.send(JSON.stringify("Project not found"));
          } else {
            let updateSql = `UPDATE projects SET ? WHERE project_id = '${req.params.id}'`;
            let updateProject = {
              title: req.body.title,
              description: req.body.description,
              type: req.body.type,
              tech: req.body.tech,
              email: req.body.email,
            };
            con.query(updateSql, updateProject, (err, updated) => {
              if (err) throw err;
              console.log(updated);
              res.send(JSON.stringify("Successfully updated Project"));
            });
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send("not client");
  }
});

// DELETE PROJECT
router.delete("/:id", middleware, (req, res) => {
  console.log(req.params.id);

  if (req.user.userRole === "client" || "admin") {
    try {
      let sql = `Delete from projects WHERE project_id = '${req.params.id}`;
      let project = { project_id: req.params.id };
      con.query(sql, project, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(JSON.stringify("Successfully deleted Project"));
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send("not authorised");
  }
});

module.exports = router;
