import express, { urlencoded } from "express";
import knex from "knex";
import axios from "axios";

const conn = knex({
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "Admin@123",
    database: "axios_DB",
  },
});
conn.raw("use axios_DB").then(() => {
  console.log("data connected");
});

const app = express();
const port = 3000;

app.use(urlencoded({ extended: true }));
app.use(express.json());

app.get("/getAlldata", async (req, res) => {
  try {
    const result = await conn.select("*").from("user");
    console.log("result", result);

    res.status(200).json({
      message: "data fetched",
      result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
app.get("/getdata", async (req, res) => {
  const result = await axios.get("http://localhost:3000/getAlldata");
  res.status(201).json({
    message: "data fetched through getAlldata",
    result,
  });
});

// used two apis for the same functionality, but went on circular json error
app.post("/addAlldata", async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };
    const result = await conn("user").insert(data);
    console.log("result", result);

    res.status(200).json({
      message: "data inserted",
      result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
app.post("/adddata", async (req, res) => {
  try {
    const result = await axios.post("http://localhost:3000/addAlldata", data);
    res.status(201).json({
      message: "data inserted through addAlldata",
      result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// using axios and post in a single way
let count = 0;
app.post("/adddata", async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };
  let result;

  if (count > 0) {
    result = await conn("user").insert(data);
    return res.status(200).json({
      message: "data inserted successfully through adddata",
      data: result,
    });
  } else {
    count = count + 1;
    result = await axios.post("http://localhost:3000/adddata", data);
    return res.status(200).json({
      message: "data inserted successfully through adddata",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at: http://localhost:${port}`);
});
