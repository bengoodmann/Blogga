const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet")
require("dotenv").config()

const DATABASE = require("./config/db");

const PORT = process.env.PORT || 3000;
const app = express();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(helmet())



app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/user", require("./routes/userRoute"))
app.use("/api/v1/post", require("./routes/postRoute"))


DATABASE.sync().then(() => {
  console.log("Database synced successfully!");
  app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
  });
});
