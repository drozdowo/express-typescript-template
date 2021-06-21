import axios, { AxiosResponse } from "axios";
import { Router, Request, Response } from "express";
import config from "../config";
import { Account, AccountGameReply } from "../models";

import AccountByGameId from "./getaccountbygameid";
import SteamGuardCodeByAccount from "./getsteamguardcodebyaccount";

let route = Router();

route.get("/AccountByGameId/:gameid", async (req: Request, res: Response) => {
  let gameid = parseInt(req.params.gameid);
  let token = req.headers.authorization;
  if (token == null) {
    res.status(401).send({ error: "Invalid Token Provided." });
    return;
  }
  //TODO: add error handling here
  let userid: number = (
    await axios.get(`${config.fragpass_url}/user-info`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    })
  ).data;
  let [info, game_name] = await AccountByGameId(gameid, userid);
  let reply: AccountGameReply = {
    account: info,
    game_id: gameid,
    game_name,
  };
  res.status(200).send(reply);
});

route.post("/SteamGuardByAccountName", async (req: Request, res: Response) => {
  let code: string[] = await SteamGuardCodeByAccount(
    req.body.username,
    req.body.ip_address
  );
  res.status(200).send({
    code: code[0],
    username: req.body.username,
    password: code[1],
  });
});

export default route;
