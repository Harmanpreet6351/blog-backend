require("dotenv").config()
import express from "express";
import CommonRouter from "./routes"

const app = express();

app.use(express.json());

(async () => {
  app.get("/", (req, res) => {
    res.send("Hello World! from index.ts");
  });
  
  app.use("/api/v1", CommonRouter)

  app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
  });
})()