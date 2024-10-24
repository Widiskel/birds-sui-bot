# Birds SUI BOT

## Table Of Contents

- [Birds SUI BOT](#birds-sui-bot)
  - [Table Of Contents](#table-of-contents)
  - [Birds SUI Airdrop](#birds-sui-airdrop)
  - [Join My Telegram Channel](#join-my-telegram-channel)
  - [Prerequisite](#prerequisite)
  - [BOT FEATURE](#bot-feature)
  - [Setup \& Configure BOT](#setup--configure-bot)
    - [Linux \& MAC OS](#linux--mac-os)
    - [Windows](#windows)
  - [Update Bot](#update-bot)
  - [Setup Accounts](#setup-accounts)
  - [Session Troubleshoot](#session-troubleshoot)
  - [Query Troubleshoot](#query-troubleshoot)
  - [Note](#note)
  - [CONTRIBUTE](#contribute)
  - [SUPPORT](#support)

## Birds SUI Airdrop

**AIRDROP** : 
Birds (SUI NETWORK)
https://t.me/birdx2_bot/birdx?startapp=5703822759
🐦🐦 Chirp chirp, boost your BIRDS with X and earn a 10% bonus from friends.

📌 Task :
- Complete Social Media Task
- Upgrade Egg
- Invite
- Daily

## Join My Telegram Channel
```
                                                          
                      ...                                 
                     .;:.                                 
                    .;ol,.                                
                   .;ooc:'                                
            ..    .;ooccc:'.    ..                        
          .',....'cdxlccccc;.....,'.                      
         .;;..'';clolccccccc:,''..;;.                     
        ':c'..':cccccccccccccc;...'c:.                    
       ':cc,.'ccccccccccccccccc:..;cc:'                   
    ...:cc;.':cccccccccccccccccc:..:cc:...                
   .;';cc;.':;;:cccccccccccccc:;;;'.;cc,,;.               
  .cc':c:.',.....;cccccccccc;.....,..:c:'c:               
  ,x:'cc;.,'     .':cccccc:'.     ',.;cc':x'              
  lO,'cc;.;,       .;cccc:.       ,;.;cc';0l              
 .o0;.;c;.,:'......',''''''......':,.;c;.:0l.             
 .lxl,.;,..;c::::;:,.    .,:;::::c;..,;.,oxl.             
 .lkxOl..  ..'..;::'..''..'::;..'..  ..c0xkl.             
  .cKMx.        .;c:;:cc:;:c:.        .xMKc.              
    ;KX:         ;o::l:;cc;o:.        ;KK;                
     :KK:.       ,d,cd,'ol'o:       .:0K:                 
      ;0NOl:;:loo;. ... .. .;ldlc::lkN0:                  
       .lONNNKOx0Xd,;;'.,:,lKKkk0XNN0o.                   
         .','.. .lX0doooodOXd.  .','.                     
                 .,okkddxkd;.                             
                    'oxxd;.                               
   ........................................                              
   .OWo  xNd lox  xxl Ald   xoc dakkkkkxsx.              
   .OWo  o0W cXW  dM0 MMN   lNK laddKMNkso.               
   .kMKoxsNN oWX  dW0 MMMWO lWK    axM0   .                
   .OMWXNaMX dM0  kM0 MMKxNXKW0    axMk   .                 
   .OMk  dWK oWX XWdx Mxx  XMMO    akMx   .                 
   'OWo  dM0 'kNNXNNd DMD   OWk    aoWd   .                 
   ........................................

```           
                                              
                                              

Anyway i create new telegram channel just for sharing bot or airdrop, join here
[**https://t.me/skeldrophunt**](https://t.me/skeldrophunt).

## Prerequisite

- Git
- Node JS
- TELEGRAM_APP_ID & TELEGRAM_APP_HASH Get it from [Here](https://my.telegram.org/auth?to=apps) (REQUIRED IF YOU WANT USE SESSIONS)

## BOT FEATURE

- Multi Account With Proxy Support
- Support Telegram Sessions and Telegram Query
- Auto Upgrade Egg
- Auto Mint Worm
- Auto Egg Breaking Game
- Auto Daily Check In Onchain (Required Some SUI on Your Wallet)
- Auto Upgrade Bird Onchain (SOON WHEN MY EGG BECOMING A BIRD HEHE)

## Setup & Configure BOT

### Linux & MAC OS

1. clone project repo
   ```
   git clone https://github.com/Widiskel/birds-sui-bot
   ```
   and cd to project dir
   ```
   cd birds-sui-bot
   ```
2. Run
   ```
   npm install && npm i telegram@2.22.2 && npm run setup 
   ```
3. Configure Bot config (including APP ID & HASH if you want to use session)
   ```
   nano config/config.js
   ```
4. (If You Use Proxy) To configure the app, run
   ```
   nano config/proxy_list.js
   ```
   and add your proxy list there, use http proxy
5. to start the app run
   ```
   npm run start
   ```

### Windows

1. Open your `Command Prompt` or `Power Shell`.
2. Clone project repo
   ```
   git clone https://github.com/Widiskel/birds-sui-bot
   ```
   and cd to project dir
   ```
   cd birds-sui-bot
   ```
3. Run
   ```
   npm install && npm i telegram@2.22.2 && npm run setup
   ```
4. Navigate to `birds-sui-bot` directory.
5. Navigate to `config` folder and open `config.js` to configure bot also `proxy_list.js` to configure proxy.
6. Now back to the `birds-sui-bot` folder
7.  To start the app open your `Command Prompt` or `Power Shell` again and run
    ```
    npm run start
    ```

## Update Bot

To update bot follow this step :

1. run
   ```
   git stash && git pull && npm install
   ```
2. start the bot.

## Setup Accounts

1. Run bot `npm run start`
2. Choose option `1` to create account
3. Choose account type `Query` or `Sessions`
4. `Session` Type
   1. Enter Account Name
   2. Enter your phone number starting with countrycode ex : `+628xxxxxxxx`
   3. You will be asked for verification code and password (if any)
   4. Start The bot Again after account creation complete
5. `Query` Type
   1. Enter Account Name
   2. Enter Telegram Query (you can get query by opening bot app on browser > inspect element > storage / application > session storage > telegram init params > copy tg web app data value)
   3. Start The bot Again after account creation complete
6. after bot started choose option 3 start bot

## Session Troubleshoot

If you asked to enter phone number again after sessions creation, it mean session not initialized correctly, try to delete the created sessions.

Example Case

- example you already have 1 session (sessionA) and all good when you run bot. After that you create another session, but when you run bot, the bot asked to enter phone number again, so the problem is on (sessionB), to fix it just remove the `accounts/sessionB` folder and re create it or just delete all folder inside `accounts` directory with prefix `sessions-`.

## Query Troubleshoot

if your bot get eror, with some error code `401` it mean your query expired, go get new query and run bot again and choose option `4` for query modification.

## Note

Config files is adjustable, modify the `config/config.js`, there some adjustable parameter 
```js
export class Config {
  static TELEGRAM_APP_ID = undefined; // YOUR APP ID EX : 324893724923
  static TELEGRAM_APP_HASH = undefined; // YOUR APP HASH EX: "aslkfjkalsjflkasf" WATCH THE ""
  static USEONCHAINTX = false; // SET To TRUE IF YOU WANT TO USE ONCHAIN TX FOR CHECK IN AND UPGRADE
  static USERWALLET = [
    [
      "YOUR SUI PK EX: 'suiprivkeyxxxx'",
      "YOUR ACCOUNTS FOLDER EX: 'accounts/query-akun1",
    ],
    [
      "YOUR SUI PK EX: 'suiprivkeyxxxx'",
      "YOUR ACCOUNTS FOLDER EX: 'accounts/query-akun2",
    ],
  ]; 
  // THIS IS OPTIONAL BUT IF YOU USE ONCHAIN THEN YOU NEED TO SET UP THIS, MAKE SURE YOU WRITE WITH CORRECT FORMAT, IF YOU JUST WANT TO USE ONCHAIN ON SOME ACCOUNT, YOU CAN JUST PROVIDE PK AND ACOUNTS FOLDER FOR THAT ACC
}

```

Don't use bot with `session` type if you using telegram account that bought from someone because it can make your telegram account deleted. instead of using `session` type, use `query` type.

This bot can use Telegram Query and Telegram Sessions. if you want to use sessions, and ever use one of my bot that use telegram sessions, you can just copy the `accounts` folder to this bot. Also for the telegram APP ID and Hash you can use it from another bot. If you want to use Telegram Query, get your query manually.

## CONTRIBUTE

Feel free to fork and contribute adding more feature thanks. To get original unencrypted code just Join my channel and DM me, original code (index.js and src folder) are Obfuscated during build

## SUPPORT

want to support me for creating another bot ?
**star** my repo or buy me a coffee on

EVM : `0x1f0ea6e0b3590e1ab6c12ea0a24d3d0d9bf7707d`

SOLANA : `3tE3Hs7P2wuRyVxyMD7JSf8JTAmEekdNsQWqAnayE1CN`
