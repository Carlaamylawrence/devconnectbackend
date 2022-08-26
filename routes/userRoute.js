const express = require("express");
const router = express.Router();
const con = require("../lib/db.connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware/auth");

//ALL USERS
router.get("/", (req, res) => {
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

//SINGLE USER
router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM users where id= ${req.params.id} `,
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

// LOGIN
router.post("/login", (req, res) => {
  console.log(req.body);
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      email: req.body.email,
    };
    con.query(sql, user, async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.status(400).json({
          status: "error",
          msg: "Email Not Found",
        });
      } else {
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        console.log(req.body.password, result[0].password);
        if (!isMatch) {
          res.status(400).json({
            status: "error",
            msg: "Password Incorrect",
          });
          console.log(isMatch);
        } else {
          // The information the should be stored inside token
          const payload = {
            user: {
              id: result[0].id,
              userRole: result[0].userRole,
              email: result[0].email,
              bio: result[0].bio,
              location: result[0].location,
              availability: result[0].availability,
              experience: result[0].experience,
              technology: result[0].technology,
              portUrl: result[0].portUrl,
              githubUrl: result[0].githubUrl,
              projects: result[0].projects,
            },
          };
          // Creating a token and setting expiry date
          jwt.sign(
            payload,
            process.env.jwtSecret,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;

              res.json({
                msg: "Login Successful",
                user: payload.user,
                token: token,
              });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// REGISTER
router.post("/register", (req, res) => {
  try {
    let sql = `INSERT INTO users(userRole, email, password, bio, location, availability, experience, technology, portUrl, githubUrl, projects) VALUES(? , ? , ? , ? , ? , ?, ? , ? , ? , ? , ?);`;
    let {
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
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    let user = {
      userRole: userRole,
      email: email,
      password: hash,
      bio: bio,
      location: location,
      availability: availability,
      experience: experience,
      technology: technology,
      portUrl: portUrl,
      githubUrl: githubUrl,
      projects: projects,
    };
    con.query(
      sql,
      [
        user.userRole,
        user.email,
        user.password,
        user.bio,
        user.location,
        user.availability,
        user.experience,
        user.technology,
        user.portUrl,
        user.githubUrl,
        user.projects,
      ],
      (err, result) => {
        if (err) throw err;
        console.log(result);
        // res.json(`User ${(user.fullname, user.email)} created successfully`);
        res.json({
          msg: "Regitration Successful",
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// router.patch("/:id", (req, res) => {
//   try {
//     let sql = "SELECT * FROM users WHERE ? ";
//     let user = { id: req.params.id };
//     con.query(sql, user, (err, result) => {
//       if (err) throw err;
//       if (result.length !== 0) {
//         let updateSql = `UPDATE users SET ? WHERE id = ${req.params.id}`;
//         const salt = bcrypt.genSaltSync(10);
//         const hash = bcrypt.hashSync(password, salt);
//           let password=hash
//         let updateUser = {
//           userRole: req.body.userRole,
//           email: req.body.email,
//           password: hash,
//           bio: req.body.bio,
//           location: req.body.location,
//           availability: req.body.availability,
//           experience: req.body.experience,
//           technology: req.body.technology,
//           portUrl: req.body.portUrl,
//           githubUrl: req.body.githubUrl,
//           projects: req.body.projects,
//         };
//         con.query(updateSql, updateUser, (err, updated) => {
//           if (err) throw err;
//           res.send("Successfully updated user");
//         });
//       } else {
//         res.send("user not found");
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

router.patch("/:id", middleware, (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      id: req.params.id,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      if (result.length !== 0) {
        let updateSql = `UPDATE users SET ? WHERE id = ${req.params.id}`;
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.password, salt);
        let updateUser = {
          userRole: req.body.userRole,
          email: req.body.email,
          password: hash,
          bio: req.body.bio,
          location: req.body.location,
          availability: req.body.availability,
          experience: req.body.experience,
          technology: req.body.technology,
          portUrl: req.body.portUrl,
          githubUrl: req.body.githubUrl,
          projects: req.body.projects,
        };
        con.query(updateSql, updateUser, (err, updated) => {
          if (err) throw err;
          console.log(updated);
          res.send("Successfully Updated");
        });
      } else {
        res.send("User not found");
      }
    });
  } catch (error) {
    console.log(error);
  }
});
// DELETE A USER
router.delete("/:id", middleware, (req, res) => {
  try {
    let sql = "Delete from users WHERE ?";
    let users = { id: req.params.id };
    con.query(sql, users, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/users/verify", (req, res) => {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({
        msg: "Unauthorized Access!",
      });
    } else {
      res.status(200);
      res.send(decodedToken);
      console.log(error);
    }
  });
});

module.exports = router;
