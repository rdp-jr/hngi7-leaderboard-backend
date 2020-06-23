const express = require("express");
const upload = require("express-fileupload");

const csv = require("csvtojson");
const csvPath = "./uploads/records.csv";

const app = express();

app.use(upload());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

app.post("/", (req, res) => {
  if (req.files) {
    console.log(req.files);
    const file = req.files.csv;
    file.name = 'records.csv'
    
    file.mv("./uploads/" + file.name, function (err, result) {
      if (err) {
        throw err;
      }
      // res.send({
      //   success: true,
      //   message: "File uploaded!"
      // })
      res.send("nice!");
      // return
    });
  }
});

app.get("/records", (req, res) => {
  csv()
    .fromFile(csvPath)
    .then((jsonArr) => {
      const retArr = jsonArr.map((record) => {
        if (record.points) {
          record.points = parseInt(record.points);
        } else {
          record.points = 0;
        }

        return record;
      });
      res.status(200).json(retArr);
    });
});


