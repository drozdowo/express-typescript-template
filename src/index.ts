//Config Stuff
import CONFIG from "./config";
import initDatabase from "./db/dbmanager";

//Express Stuff
import express, { Application, Request, Response } from "express";

var bodyParser = require("body-parser");
let app = express();
app.use(bodyParser.json());

//imports
import endpoint from "./endpoints";

app.listen(CONFIG.port, async () => {
  console.log(`[Initializing FragPass Account Service...]`);
  console.log(`[Initializing Database Connection...]`);
  await initDatabase.initDatabase();
  //if db doesnt exist.. lets seed the tables:
  // console.log('[Seeding Database...');
  // await initDatabase.seedDatabase();
  console.log(`[Initializing endpoints...]`);
  configureExpress(app);

  console.log(
    `[[FragPass Account Service Successfully Initialied on Port ${CONFIG.port}]`
  );
});

const configureExpress = (app: Application) => {
  app.use("/api", endpoint);
};
