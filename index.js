const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/profile-picture", (req, res) => {
  var img = fs.readFileSync("profile-pic.jpg");
  res.writeHead(200, { "Content-type": "image/jpg" });
  res.end(img, "binary");
});

const URL = `mongodb://root:akshansh1998@localhost:27017/user-account?authSource=admin`;
mongoose.connect(URL);
const connection = mongoose.connection;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  interests: String,
  email: String,
});
const User = mongoose.model("User", userSchema);

connection
  .once("open", () => {
    console.log("Connected to MongoDB successfully");
  })
  .on("error", (err) => {
    console.log(err);
  });

app.post("/update-profile", (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let interests = req.body.interests;
  User
    .findOneAndUpdate({email},{ name, email, interests },{new:true})
    .then((e) => {
      res.json({
        status:"200",
        msg:"Record Updated"
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/get-profile", (req, res) => {
  const email = req.query.email;
  User.find({ email })
    .then((e) => {
      if (e && e.length) {
        res.json({
          id:e[0]._id,
          name: e[0].name,
          interests: e[0].interests,
          email: e[0].email,
        });
      } else {
        res.json({
          data:[]
        });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(3000, () => {
  console.log(`app running on http://localhost:3000`);
});
