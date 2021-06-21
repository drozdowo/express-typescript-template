import database from "../db/dbmanager";
import EmailAccount from "../models/email";
import CONFIG from "../config";
import imaps from "imap-simple";

export default async (
  account_name: string,
  ip_address: string
): Promise<string[]> => {
  return new Promise<string[]>(async (resolve, reject) => {
    let email: EmailAccount = await database.getQuery(
      `SELECT
                    a.email, a.email_password, a.password
                FROM
                    Accounts a
                WHERE
                    a.username == ?`,
      [account_name]
    );

    let config = {
      imap: {
        user: email.email,
        password: email.email_password,
        host: CONFIG.email_imap_server,
        port: CONFIG.email_imap_port,
        tls: true,
        authTimeout: 3000,
      },
    };
    imaps.connect(config).then((connection) => {
      return connection.openBox("JUNK", () => {
        var searchCriteria = ["UNSEEN"];

        var fetchOptions = {
          bodies: ["HEADER", "TEXT"],
          markSeen: false,
        };
        return connection
          .search(searchCriteria, fetchOptions)
          .then(function (results) {
            var code = results.map(function (res) {
              let body: string = res.parts.filter(function (part) {
                return part.which === "TEXT";
              })[0].body;
              if (body.includes(ip_address)) {
                //includes their IP address, lets regex it for the code
                let match = body
                  .match(
                    `Here is the Steam Guard code you need to login to account ${account_name}:\r\n\r\n[A-Z0-9]{5}\r\n`
                  )[0]
                  .match("[A-Z0-9]{5}")[0];
                return match;
              }
            });
            resolve([code[0], email.password]);
          });
      });
    });
  });
};
