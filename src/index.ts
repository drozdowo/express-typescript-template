import express, { Request, Response } from "express";
import config from "../config.js";

let app = express();

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`);
});

app.get("/app", (req: Request, res: Response) => {
  res.send("Hello");
});
