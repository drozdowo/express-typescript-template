import Account from "./account";

export default interface AccountGameReply {
  game_id: number;
  account: Account;
  game_name: string;
}
