const express = require("express");
const cors = require("cors");
const server = express();
const mongoose = require("mongoose");
const error_handler = require("node-error-handler");
const productRoutes = require("./services/products");

server.use(express.json());
server.use(cors());

server.use(error_handler({ log: true, debug: true }));

const PORT = process.env.PORT || 3001;

//connect to database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => server.listen(PORT, () => console.log("connected to", PORT)));
