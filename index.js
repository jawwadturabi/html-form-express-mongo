const mongoose = require("mongoose");
const dburi = "mongodb+srv://author:author123@cluster0-geoiq.mongodb.net/test?retryWrites=true";
const express = require("express");
const bodyParser = require("body-parser");
const app = express()
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
    firstName: String,
    lastName: String
});
var User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/addname", async (req, res) => {
    console.log("request is", req.body)
    var info= {
        firstName : req.body.firstName,
        lastName : req.body.lastName
    }
    var saveData = new User(info);
    await saveData.save()
        .then(item => {
            res.send(200, "Name saved to database");
            console.log("data is  : ", item)
        })
        .catch(err => {
            res.send(200, "Unable to save to database");
        });
});
app.listen(3000,()=>{
    console.log("server running")
})