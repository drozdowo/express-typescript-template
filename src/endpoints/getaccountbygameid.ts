import database from "../db/dbmanager";
import { Account } from "../models";

const CheckIfPreviousAccountUsed = async (
  gameid,
  user_id
): Promise<boolean> => {
  //Checks to see if the fragpass userid
  let data = await database.getQuery(
    `SELECT * from Account_Usage
    where user_id = ? and game_id = ?
    `,
    [user_id, gameid]
  );
  return data != null;
};

export default async (game_id: number, user_id: number) => {
  let data;
  //TODO: add a check here to see if they've used an account before, and then return those account details.
  if (await CheckIfPreviousAccountUsed(game_id, user_id)) {
    data = await database.getQuery(
      `SELECT
            a.username, a.password, a.steamid64, a.steamid3, b.name_short, a.id
        FROM
            Accounts a,
            Games b
        WHERE
            a.id == ( SELECT account_id from Account_Usage
        where user_id = ? and game_id = ?)
      AND
      b.app_id = ?`,
      [user_id, game_id, game_id]
    );
  } else {
    data = await database.getQuery(
      `SELECT
          a.username, a.password, a.steamid64, a.steamid3, b.name_short, a.id
      FROM
          Accounts a,
          Games b,
          AccountGamesMap c
      WHERE
          a.id == c.account_id
      AND
          c.game_id == b.id
      AND
          b.app_id == ?`,
      [game_id]
    );

    //now lets make a record in the useraccountmap table so we can give the user that same account in the future
    await database.runQuery(
      "INSERT OR REPLACE INTO Account_Usage VALUES(?, ?, ?, ?)",
      [user_id, game_id, data.id, new Date().toISOString()]
    );
  }

  return [
    {
      username: data["username"],
      password: data["password"],
      steamid64: data["steamid64"],
      steamid3: data["steamid3"],
    } as Account,
    data["name_short"],
  ];
};
