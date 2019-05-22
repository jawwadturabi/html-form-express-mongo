const mongoose = require("mongoose");
const alert = require('alert-node');
const express = require("express");
const bodyParser = require("body-parser");
const app = express()
const dburi = "mongodb+srv://author:author123@cluster0-geoiq.mongodb.net/test?retryWrites=true";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(dburi, { useNewUrlParser: true }).catch(err => {
    console.log("error occured", err);
});
mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
})
mongoose.connection.on("connected", () => {
    console.log("Connected with database");
});

mongoose.connection.on("disconnected", () => {
    console.log("Disconnected with database.");
    process.exit(1);
});

var nameSchema = new mongoose.Schema({
    UserName: String,
    Password: 'String'
});
var User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/login", async (req, res) => {
    User.find({ UserName: req.body.UserName, Password: req.body.Password }).then(d => {
        if (d.length == 0) {
            alert("Signup First")
            res.sendFile(__dirname + "/index.html");
        }
        else {
            res.send("Login Successful")
            console.log("data is : ", d)
        }
    }).catch(e => {
        res.send("Something went wrong !")
        console.log("err is : ", e)
    })
})

app.post("/signup", async (req, res) => {
    var info = {
        UserName: req.body.UserName,
        Password: req.body.Password
    }
    var saveData = new User(info);
    await saveData.save()
        .then(item => {
            res.send("Signup Successfull");
            console.log("data is  : ", item)
        })
        .catch(err => {
            console.log("err is : ", err)
            res.send(200, "Unable to save to database");
        });
})
app.listen(process.env.Port || 4000, () => {
    console.log("server running")
})