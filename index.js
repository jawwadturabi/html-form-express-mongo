const mongoose = require("mongoose");
// const http = require("http");
// const fs = require("fs")
const dburi = "mongodb+srv://author:author123@cluster0-geoiq.mongodb.net/test?retryWrites=true";
const express = require("express");
const bodyParser = require("body-parser");
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const path = require("path")
// const queryString = require("querystring")
// var publicPath = path.join(__dirname, '../public')
// app.use(express.static(publicPath))
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
// var userDetail = new mongoose.Schema(
//         {
//                 Name: { type: [String], required: true },
        
//             },
//             { collection: "form" }
//         );
//         var model = new mongoose.model("form", userDetail);
//         app.use("/", (req, res) => {
//                 res.sendFile(__dirname + "/js.html");
//             });
//             app.post("/addname", (req, res) => {
//                     var myData = new model(req.body);
//                     myData.save()
//                         .then(item => {
//             res.send("item saved to database");
//         })
//         .catch(err => {
//                 res.status(400).send("unable to save to database");
//         });
// });

// app.get("/",(req,res)=>{
    //     res.render("js.html")
    // })
    
    //  async function h() {
//     value = document.getElementById("name").value
//     alert(value)
//     var info = {
    //         Name: value
    //     }
    //     var saveData = new model(info);
    // await saveData.save((err, mydata) => {
        //         if (err) {
            //             console.log("error is:", err);
            //         }
            //         else {
                //             console.log("save data is : ", mydata)
                //             return
                //         }
                //     })
                //     alert("data is saved " +value)
// }

// http.createServer(async (req, res) => {
//     if (req.url === "/") {
//         res.writeHead(200, { "Content-Type": "text/html" });
//         fs.createReadStream("./index.html", "UTF-8").pipe(res)
//     }
//     else if (req.method === "POST") {
//         var data ="";
//         req.on("data", (chunk) => {
//             data += chunk
//         })
//         await req.on("close", (chunk) => {
//             var formData = queryString.parse(data)
//             console.log("data is : ", formData)
//             res.end("data saved")
//         })
        
//     }
// }).listen(3000, () => {
//     console.log("server running")
// });