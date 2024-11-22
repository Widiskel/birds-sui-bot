export class Config {
  static TELEGRAM_APP_ID = undefined; // YOUR APP ID EX : 324893724923
  static TELEGRAM_APP_HASH = undefined; // YOUR APP HASH EX: "aslkfjkalsjflkasf"
  static USEONCHAINTX = false; // SET TO TRUE IF YOU WANT TO USE ONCHAIN TX FOR CHECK IN AND UPGRADE
  static SKIPCOMMONWORM = true; // SET TO TRUE IF YOU DONT WANT TO UNLOCKING WORM WITH COMMON RARITY
  static USERWALLET = [
    ["suiprivkeyxxx", "accounts/query-akun1"],
    [
      "YOUR SUI PK EX: suiprivkeyxxxx",
      "YOUR ACCOUNTS FOLDER EX: accounts/query-akun2",
    ],
  ];
}
