import { Config } from "./config/config.js";
import { proxyList } from "./config/proxy_list.js";
import { Core } from "./src/core/core.js";
import { Telegram } from "./src/core/telegram.js";
import { Helper } from "./src/utils/helper.js";
import logger from "./src/utils/logger.js";
import twist from "./src/utils/twist.js";

async function operation(acc, query, queryObj, proxy) {
  const skipCommonWorm = Config.SKIPCOMMONWORM ?? true;
  try {
    const core = new Core(acc, query, queryObj, proxy);
    await core.getUserInfo(true);
    await core.getIncubateInfo(true);
    if (!core.incubate) {
      await core.upgradeEgg();
    } else {
      if (
        core.user.balance >= core.incubate.nextLevel.birds &&
        core.incubate.level != 35 &&
        (!Helper.isFuture(
          core.incubate.upgradedAt + core.incubate.duration * 60000 * 60
        ) ||
          core.incubate.status == "confirmed")
      ) {
        await core.confirmUpgrade();
        await core.upgradeEgg();
      }
    }
    await core.getWormInfo();
    if (core.worm && core.worm.status == "MINT_OPEN") {
      await core.catchWorm();
    }

    await core.joinEggBreaking(true);
    if (core.game) {
      while (core.game.turn != 0) {
        await core.breakEgg();
      }
      if (core.game.turn != undefined) await core.claimEggGame();
    }

    if (core.useOnchain) {
      if (Config.USERWALLET.length == 0) {
        throw Error(`Please Provide Wallet For Each Account`);
      }
      await core.initWallet();
      await core.presignedCheckIn();
      if (core.address) {
        await core.getLockedWorm();
        for (const item of core.lockedWorm) {
          await core.presignedUnlockWorm(item);
          if (core.preUnlockWormCd) break;
        }
        // await core.getOnChainWorm(true);
        // if (core.onChainWorm && !core.preUnlockWormCd) {
        //   for (const item of core.onChainWorm.filter(
        //     (item) => item.state == "pre_minted"
        //   )) {
        //     const data = await core.getWormDetails(item);
        //     if (!data) {
        //       break;
        //     }
        //     if (skipCommonWorm && item.rare === 0) {
        //       continue;
        //     }
        //     if (data.confirmed_at == null) {
        //       await core.depositWormNft(data);
        //     }
        //   }
        //   await core.getOnChainWorm();
        // }
      }

      if (core.incubate.level >= 21 && core.address) {
        await core.getPreyInfo();
        await core.getUnlockedWorm();
        let energy = core.hunt.hunting.energy ?? 0;
        let maxEnergy = core.hunt.hunt.maxEnergy;
        // console.log(energy);
        // console.log(maxEnergy);
        while (energy != maxEnergy && !core.preFeedingCd) {
          if (core.stillHunting) {
            await core.presignedClaim();
          }
          if (core.unlockedWorm.length == 0) break;
          for (const item of core.unlockedWorm) {
            if (!core.preFeedingCd) {
              await core.presignedFeeding(item);
              await core.getUnlockedWorm();
            } else {
              break;
            }
          }
          await core.getPreyInfo();
          energy = core.hunt.hunting.energy;
          maxEnergy = core.hunt.hunt.maxEnergy;
        }

        await core.presignedHunting();
      }
    }

    const delay = Helper.random(60000 * 30, 60000 * 60);
    await Helper.delay(
      delay,
      acc,
      `Account ${acc.id} Processing Complete, Restarting in ${Helper.msToTime(
        delay
      )}`,
      core
    );
    await operation(acc, query, queryObj, proxy);
  } catch (error) {
    if (error.message.includes("401")) {
      if (acc.type == "query") {
        await Helper.delay(
          1000,
          acc,
          `Error : ${error.message}, Query Is Expired, Please Get New Query`
        );
      } else {
        await Helper.delay(
          5000,
          acc,
          `Error : ${error.message}, Query Is Expired, Getting New Query in 5 Seconds`
        );
        const tele = new Telegram();
        await tele.useSession(acc.accounts, proxy);
        const user = await tele.client.getMe();
        user.type = "sessions";
        user.accounts = acc.accounts;
        user.id = user.id.value;
        const query = await tele
          .resolvePeer()
          .then(async () => {
            return await tele.initWebView();
          })
          .catch((err) => {
            throw err;
          });

        const queryObj = Helper.queryToJSON(query);
        await tele.disconnect();
        await Helper.delay(5000, user, `Successfully get new query`);
        await operation(user, query, queryObj, proxy);
      }
    } else if (error.message.includes("429")) {
      await Helper.delay(
        60000 * 5,
        acc,
        `Error : ${error.message}, Retrying after 5 Minutes`
      );
      await operation(acc, query, queryObj, proxy);
    } else {
      await Helper.delay(
        5000,
        acc,
        `Error : ${error.message}, Retrying after 5 Seconds`
      );
      await operation(acc, query, queryObj, proxy);
    }
  }
}

let init = false;
async function startBot() {
  return new Promise(async (resolve, reject) => {
    try {
      logger.info(`BOT STARTED`);

      const tele = await new Telegram();
      if (init == false) {
        await tele.init();
        init = true;
      }

      const accountList = Helper.getSession("accounts");
      const paramList = [];

      if (proxyList.length > 0) {
        if (accountList.length != proxyList.length) {
          reject(
            `You have ${accountList.length} Session but you provide ${proxyList.length} Proxy`
          );
        }
      }

      for (const acc of accountList) {
        const accIdx = accountList.indexOf(acc);
        const proxy = proxyList.length > 0 ? proxyList[accIdx] : undefined;
        if (!acc.includes("query")) {
          await tele.useSession("accounts/" + acc, proxy);
          tele.session = acc;
          const user = await tele.client.getMe();
          user.type = "sessions";
          user.accounts = "accounts/" + acc;
          user.id = user.id.value;
          const query = await tele
            .resolvePeer()
            .then(async () => {
              return await tele.initWebView();
            })
            .catch((err) => {
              throw err;
            });

          const queryObj = Helper.queryToJSON(query);
          await tele.disconnect();
          paramList.push([user, query, queryObj, proxy]);
        } else {
          let query = Helper.readQueryFile("accounts/" + acc + "/query.txt");
          let queryObj = Helper.queryToJSON(query);
          if (!queryObj.user) {
            queryObj = await Helper.queryToJSON(
              await Helper.launchParamToQuery(query)
            );
            query = await Helper.launchParamToQuery(query);
          }
          const user = queryObj.user;
          user.type = "query";
          user.accounts = "accounts/" + acc;
          user.firstName = user.first_name;
          user.lastName = user.last_name;
          paramList.push([user, query, queryObj, proxy]);
        }
      }

      const promiseList = paramList.map(async (data) => {
        await operation(data[0], data[1], data[2], data[3]);
      });

      await Promise.all(promiseList);

      resolve();
    } catch (error) {
      logger.info(`BOT STOPPED`);
      logger.error(JSON.stringify(error));
      reject(error);
    }
  });
}

(async () => {
  try {
    logger.clear();
    logger.info("");
    logger.info("Application Started");
    console.log("BIRDS SUI BOT");
    console.log();
    console.log("By : Widiskel");
    console.log("Follow On : https://github.com/Widiskel");
    console.log("Join Channel : https://t.me/skeldrophunt");
    console.log("Dont forget to run git pull to keep up to date");
    console.log();
    console.log();
    Helper.showSkelLogo();
    await startBot();
  } catch (error) {
    await twist.clear();
    await twist.clearInfo();
    console.log("Error During executing bot", error);
    await startBot();
  }
})();
