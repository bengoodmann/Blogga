const express = require("express");

const DATABASE = require("./config/db");
const PORT = process.env.PORT || 3000;
const app = express();

DATABASE.sync().then(() => {
  console.log("Database synced successfully!");
  app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
  });
});
