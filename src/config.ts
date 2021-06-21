export interface AccountServiceConfig {
  port: number;
  dbname: string;
  email_imap_server: string;
  email_imap_port: number;
  fragpass_url: string;
}

const local: AccountServiceConfig = {
  port: 3000,
  dbname: "accsvc.db",
  email_imap_server: "imap-mail.outlook.com",
  email_imap_port: 993,
  fragpass_url: "https://fragpass.com/wp-json/fragpass/v1",
};

export default ((): AccountServiceConfig => {
  if (process.env.NODE_ENV == "local") {
    return local;
  }
  return local;
})();
