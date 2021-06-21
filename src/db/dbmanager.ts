import sqlite3, { Database } from "sqlite3";
import CONFIG from "../config";

class DatabaseManager {
  database: Database;

  initDatabase = async (): Promise<Database> => {
      return new Promise<void>(async (resolve, reject) => {
        if (!this.database) {
            this.database = await new sqlite3.Database(CONFIG.dbname, (err) => {
              //check to see if the db opened okay
              if (!err) {
                //
              } else {
                //Close otherwise
                console.log("- Failed to initialize database. Exiting -");
                reject();
                process.exit(1);
              }
            });
      
            //Do whatever starting processes we need here
          }
          resolve(this.database);
      });
  };

  seedDatabase = async (): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        if (!this.database){
            console.log("[Cannot seed database before initialiation.[");
            reject();
        } else {
            //create accounts table
            await this.runQuery(`CREATE TABLE "Accounts" (
              "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
              "username"	TEXT NOT NULL UNIQUE,
              "password"	TEXT NOT NULL,
              "email"	TEXT NOT NULL
          );`, []);
          //create games table
          await this.runQuery(`CREATE TABLE "Games" (
            "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
            "name"	TEXT NOT NULL UNIQUE
        );`, []);
        //create games map
        await this.runQuery(`CREATE TABLE "AccountGamesMap" (
          "account_id"	INTEGER NOT NULL UNIQUE,
          "games"	TEXT,
          "usable"	INTEGER NOT NULL DEFAULT 1,
          PRIMARY KEY("account_id")
        )`, []);
          //create account usage table
          await this.runQuery(`CREATE TABLE "Account_Usage" (
            "user_id"	INTEGER NOT NULL,
            "game_id"	INTEGER NOT NULL,
            "account_id"	INTEGER NOT NULL,
            "datetime"	TEXT NOT NULL
          )`, []);


          resolve();
        }
    })
  }

  runQuery = async (query: string, params: Array<any>): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.database.run(query, params, (err, rows) => {
        if (!err) {
          resolve(rows);
        }
        reject(err);
      });
    });
  };

  getQuery = async (query: string, params: Array<any>): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.database.get(query, params, (err, rows) => {
        if (!err) {
          resolve(rows);
        }
        reject(err);
      });
    });
  };

  getAll = async (query: string, params: Array<any>): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.database.all(query, params, (err, rows) => {
        if (!err) {
          resolve(rows);
        }
        reject(err);
      });
    });
  };
}

let dbconn: DatabaseManager;

export default (() => {
  if (!dbconn) {
    dbconn = new DatabaseManager();
  }
  return dbconn;
})();
