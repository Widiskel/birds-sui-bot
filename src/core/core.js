import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { API } from "../api/api.js";
import { Helper } from "../utils/helper.js";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { Config } from "../../config/config.js";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";
import logger from "../utils/logger.js";

export class Core extends API {
  constructor(account, query, queryObj, proxy) {
    super(
      query,
      queryObj,
      proxy,
      "https://api.birds.dog",
      "https://birdx.birds.dog",
      "https://birdx.birds.dog/"
    );
    this.account = account;
    this.query = query;
    this.queryObj = queryObj;
    this.useOnchain = Config.USEONCHAINTX ?? false;
    this.preUnlockWormCd = false;
    this.preFeedingCd = false;
    this.stillHunting = false;
    this.BIRDSENUM = {
      PACKAGE_ID:
        "0x64254dd3675459aae82e063ed6276f99fe23616f75fdb0b683f5d2c6024a0bd7",

      BIRD_STORE_ID:
        "0x2d942791de55513d1cae2529acd14b64624919c1ee32dcf3d187c0dcd0c2c04f",
      BIRD_REG_ID:
        "0xbb3027323ed2192c41ca849c61a24cb328222ba332a036cdf82f1d2cc2ebe15e",
      BIRD_VERSION_ID:
        "0x41ee63984e12557a40329acdc6f77eaea2e59ccc19d9f5a4e8fdd1582f45d2ef",
      PACKAGE_ID_2:
        "0x59f4fd9b3928b8358ce60335d15b6b6848f094d0deb64238b0535a99e4e13e4a",
      BIRD_STORE_ID_2:
        "0xf0c180e15b51e8b61fa6b0d1c862d4f2daaa5001ea6c04b8972778a9c499131d",
      BIRD_REG_ID_2:
        "0x6bca295fb6cc0c7b9cf194f4aa84d7e611643f49a7c9bfd6d996f220b952107f",
      BIRD_VERSION_ID_2:
        "0xe22dc39f6a210c0d805e6e97b30bd114b3c7e9c604252022d194d6bb65c012ef",
      PACKAGE_ID_3:
        "0xf931d40c7b2e73df3fef29b295b9839fac6a27b71c625dc473545929ab7faf85",
      BIRD_REG_ID_3:
        "0x10b97d55f31bc3934b5ef2bc190e257eaf5ecec50d0361679f64304b4247f493",
      BIRD_VERSION_ID_3:
        "0x492cad9d4e89763250410a8b1fa3386c62556ae867b088a91843424334800bb1",
      PAYMENT_POOL_SUI:
        "0x2adc72feb0541bf76742b1fb8ac650854b9244fcff0abfa8d1dd9481b399cd62",
      MARKET_PACKAGE_ID:
        "0x97bd3876f24d934fa2f2b61673674eed9e8b0ae19f3ad148970e562e7a83703f",
      MARKET_VERSION:
        "0xbe7df39d1c6ed6063cd353d0dee3cfa7c12c4750150e6afe62f8e619447e905e",
      MARKET_NFT_PEG_VAULT:
        "0x7732ced77345bda8c826090f48a0c84ed41499e37bf77d14869dd1b95c25f8dd",
      PACKAGE_PREY:
        "0x144229c18a420c77196e6b768820f34a2caeeb6571d6ccd4e590eae2e268b88c",
      PREY_VERSION:
        "0x8f37af5c5d01e9bf0a6251d784dd1dfbb83d79ff1ff624ebfbbbe91bc6c31c86",
      PREY_BIRD_VAULT:
        "0xa3e144c748b1e222d2e6c15a26723a371c86c4860a92d660bc8379cfc16abe7a",
      PACKAGE_COMMON:
        "0x38dba0f0cf9a80c9b9debf580c82f89bb0de4577e6fb448b3ba2ee9e05d539bc",
      PACKAGE_COMMON_V2:
        "0x79e6fc5fca42f5de4f76e834c5a98fd3615acffdbe3174318f4374bd498d1e1f",
      VERSION_COMMON:
        "0x5d859833b5739664df20148ea1b1de1fe3ce82f832bfeb2472a23eb8a6707a4c",
      PACKAGE_TOKEN:
        "0xf81f4425196a7520875bc0deaca6c206f7516b960214bc6e52569b948409eb08",
      CALL_DEPOSIT_NFT:
        "0x717b63cfc521c24c358ea6f6d1c4e1c5468e112d7df73d408babc5b2c6622f02",
      PACKAGE_NFT:
        "0x356d0c33487d727fa31198d1ac9e082a5b57a89c6b56dd37fdf9d54db9d9f98d",
      POLICY_VAULT:
        "0xf769012cb5ac43c54ecc111fe4fc89e03e678f2a3fe71a9e635328fc3de5da42",
      CLT_VAULT:
        "0x99a57159f94e514b210f1528f49344dc0d00a75675778f12e8ac027cdc1c0449",
      USER_REG:
        "0x5cfc296be7f0b72fa086d05979aca44ab1f05270306eec5261163bd7b125cc67",
      BIRD_CLOCK: "0x06",
      CAPTCHA_SITE_KEY: "0x4AAAAAAAxZxbYxrxkqJ4jj",
    };
  }

  async getWalletAddress() {
    await Helper.delay(1000, this.account, `Getting Wallet Address...`, this);
    this.client = new SuiClient({ url: getFullnodeUrl("mainnet") });
    const pkString = Config.USERWALLET.find(
      (item) => item[1] == this.account.accounts
    );
    // console.log(pkString);
    if (!pkString) {
      return false;
    } else {
      const privateKey = decodeSuiPrivateKey(pkString[0]);
      this.wallet = Ed25519Keypair.fromSecretKey(privateKey.secretKey);
      this.address = this.wallet.getPublicKey().toSuiAddress();
      await Helper.delay(
        1000,
        this.account,
        `Successfully Get Wallet Address ${this.address}...`,
        this
      );
      return true;
    }
  }

  async registerArchieve(data, scope) {
    await Helper.delay(
      1000,
      this.account,
      `User not registering to Birds Archive yet, Try to Register...`,
      this
    );
    let packageId;
    const tx = new Transaction();
    let args = [];
    if (scope == "mineBird") {
      packageId = `${this.BIRDSENUM.PACKAGE_ID}::bird_entries::register`;
      args.push(tx.object(this.BIRDSENUM.BIRD_REG_ID));
      args.push(tx.object(this.BIRDSENUM.BIRD_CLOCK));
      args.push(tx.object(this.BIRDSENUM.BIRD_VERSION_ID));
    } else if (scope == "depositNft") {
      packageId = `${this.BIRDSENUM.PACKAGE_COMMON_V2}::archieve::registerArch`;
      args.push(tx.object(this.BIRDSENUM.USER_REG));
    } else {
      packageId = `${this.BIRDSENUM.MARKET_PACKAGE_ID}::xbird_entries::register`;
      args.push(tx.object(this.BIRDSENUM.USER_REG));
    }

    if (scope == "depositNft") {
      await tx.moveCall({
        target: packageId,
        arguments: args,
        typeArguments: [`${this.BIRDSENUM.PACKAGE_NFT}::nft::NFT`],
      });
    } else {
      await tx.moveCall({
        target: packageId,
        arguments: args,
      });
    }
    // tx.setGasBudget(1000000n);
    await this.executeTx(tx);
    if (scope == "mineBird") {
      await this.mineBird(data);
    } else if (scope == "catchWorm") {
      await this.catchWormTx(data);
    } else if (scope == "feedWorm") {
      await this.feedBird(data);
    } else if (scope == "preyBird") {
      await this.preyBird(data);
    } else if (scope == "claimPreyReward") {
      await this.claimPreyBird(data);
    } else if (scope == "depositNft") {
      await this.depositWormNft(data);
    }
  }
  async checkUserArchieve(data, scope) {
    await Helper.delay(1000, this.account, `Checking User Assets...`, this);
    const userAssets = await this.client.getOwnedObjects({
      owner: this.address,
      options: {
        showType: true,
      },
    });
    let packageId;
    let arch;
    if (scope == "mineBird") {
      packageId = this.BIRDSENUM.PACKAGE_ID;
      arch = `${packageId}::bird::BirdArchieve`;
    } else if (scope == "depositNft") {
      packageId = this.BIRDSENUM.PACKAGE_COMMON_V2;
      arch = `${packageId}::archieve::Archieve<${this.BIRDSENUM.PACKAGE_NFT}::nft::NFT>`;
    } else {
      packageId = this.BIRDSENUM.PACKAGE_COMMON;
      arch = `${packageId}::archieve::UserArchieve`;
    }

    const haveNft = userAssets.data.find((item) => item.data.type == `${arch}`);

    if (haveNft != undefined) {
      logger.info("USER HAVE ARCHIEVE");
      return haveNft.data.objectId;
    } else {
      logger.info("USER DON'T HAVE ARCHIEVE");
      await this.registerArchieve(data, scope);
    }
  }

  async mineBird(data) {
    try {
      await Helper.delay(
        1000,
        this.account,
        `Trying to do mineBird Transaction...`,
        this
      );
      const birdArhieve = await this.checkUserArchieve(data, "mineBird");

      const tx = new Transaction();
      const u8 = [
        tx.pure(
          bcs
            .vector(bcs.u8())
            .serialize(Buffer.from(data.signature, "hex"))
            .toBytes()
        ),
        tx.pure(
          bcs
            .vector(bcs.u8())
            .serialize(Buffer.from(data.message, "hex"))
            .toBytes()
        ),
        tx.object(this.BIRDSENUM.BIRD_STORE_ID),
      ];
      // console.log(u8);

      await tx.moveCall({
        target: `${this.BIRDSENUM.PACKAGE_ID}::bird_entries::mineBird`,
        arguments: [
          ...u8,
          tx.object(birdArhieve),
          tx.object(this.BIRDSENUM.BIRD_CLOCK),
          tx.object(this.BIRDSENUM.BIRD_VERSION_ID),
        ],
      });
      tx.setGasBudget(1500000n);

      const txRes = await this.executeTx(tx);
      await this.confirmCheckIn(data.token, txRes.digest);
    } catch (error) {
      throw error;
    }
  }

  async catchWormTx(data) {
    try {
      await Helper.delay(
        1000,
        this.account,
        `Trying to do catchWorm Transaction...`,
        this
      );
      const birdArhieve = await this.checkUserArchieve(data, "catchWorm");

      const tx = new Transaction();
      const u8 = [
        tx.pure(
          bcs
            .vector(bcs.u8())
            .serialize(Buffer.from(data.signature.data))
            .toBytes()
        ),
        tx.pure(
          bcs
            .vector(bcs.u8())
            .serialize(Buffer.from(data.message.data))
            .toBytes()
        ),
        tx.object(this.BIRDSENUM.BIRD_STORE_ID_2),
      ];
      // console.log(u8);

      await tx.moveCall({
        target: `${this.BIRDSENUM.PACKAGE_ID_2_2}::bird_entries::catchWorm`,
        arguments: [
          ...u8,
          tx.object(birdArhieve),
          tx.object(this.BIRDSENUM.BIRD_CLOCK),
          tx.object(this.BIRDSENUM.BIRD_VERSION_ID_2),
        ],
      });
      tx.setGasBudget(1500000n);

      await this.executeTx(tx);
      await Helper.delay(
        1000,
        this.account,
        `Successfuly to do catchWorm Transaction, Wait for Block Confirmation...`,
        this
      );
    } catch (error) {
      throw error;
    }
  }
  async depositWormNft(data) {
    try {
      await Helper.delay(
        3000,
        this.account,
        `Trying to do deposit on chain worm...`,
        this
      );
      const birdArhieve = await this.checkUserArchieve(data, "depositNft");

      const tx = new Transaction();
      const coin = tx.splitCoins(tx.gas, [data.fee]);
      // console.log(data);

      await tx.moveCall({
        target: `${this.BIRDSENUM.CALL_DEPOSIT_NFT}::entries::depositNft`,
        arguments: [
          tx.pure(
            bcs
              .vector(bcs.u8())
              .serialize(Uint8Array.from(Buffer.from(data.signature, "hex")))
              .toBytes()
          ),
          tx.pure(
            bcs
              .vector(bcs.u8())
              .serialize(Uint8Array.from(Buffer.from(data.msg, "hex")))
              .toBytes()
          ),
          tx.object(this.BIRDSENUM.MARKET_NFT_PEG_VAULT),
          tx.object(birdArhieve),
          tx.object(coin),
          tx.object(this.BIRDSENUM.VERSION_COMMON),
          tx.object(this.BIRDSENUM.BIRD_CLOCK),
        ],
      });
      tx.transferObjects([coin], this.address);
      tx.setGasBudget(5000000n);
      // console.log(tx);

      await this.executeTx(tx);
      await this.getOnChainWorm();
      await Helper.delay(
        5000,
        this.account,
        `Successfuly to do deposit Nft Transaction ${
          this.onChainWorm.filter((item) => item.state == "pre_minted").length
        } Left, Wait for Block Confirmation...`,
        this
      );
    } catch (error) {
      console.log(error);
      logger.info(JSON.stringify(error));
      await Helper.delay(5000, this.account, `Failed to Unlock Worm`, this);
    }
  }

  async feedBird(data) {
    try {
      await Helper.delay(
        1000,
        this.account,
        `Trying to do feedBird Transaction...`,
        this
      );
      const birdArhieve = await this.checkUserArchieve(data, "feedBird");
      const tx = new Transaction();

      await tx.moveCall({
        target: `${this.BIRDSENUM.PACKAGE_PREY}::entries::feedWorm`,
        arguments: [
          tx.pure(
            bcs
              .vector(bcs.u8())
              .serialize(Buffer.from(data.signature, "hex"))
              .toBytes()
          ),
          tx.pure(
            bcs
              .vector(bcs.u8())
              .serialize(Buffer.from(data.message, "hex"))
              .toBytes()
          ),
          tx.object(data.wormAddress),
          tx.object(this.BIRDSENUM.PREY_BIRD_VAULT),
          tx.object(birdArhieve),
          tx.object(this.BIRDSENUM.PREY_VERSION),
        ],
      });
      tx.setGasBudget(1500000n);

      const txRes = await this.executeTx(tx);
      await this.confirmFeeding(data.token, txRes.digest);
    } catch (error) {
      throw error;
    }
  }
  async preyBird(data) {
    try {
      await Helper.delay(
        1000,
        this.account,
        `Trying to do preyBird Transaction...`,
        this
      );
      const birdArhieve = await this.checkUserArchieve(data, "preyBird");
      const tx = new Transaction();
      await tx.moveCall({
        target: `${this.BIRDSENUM.PACKAGE_PREY}::entries::preyBird`,
        arguments: [
          tx.pure(
            bcs
              .vector(bcs.u8())
              .serialize(Buffer.from(data.signature, "hex"))
              .toBytes()
          ),
          tx.pure(
            bcs
              .vector(bcs.u8())
              .serialize(Buffer.from(data.message, "hex"))
              .toBytes()
          ),
          tx.object(this.BIRDSENUM.PREY_BIRD_VAULT),
          tx.object(birdArhieve),
          tx.object(this.BIRDSENUM.PREY_VERSION),
        ],
      });
      tx.setGasBudget(1500000n);

      const txRes = await this.executeTx(tx);
      await this.confirmHunt(data.token, txRes.digest);
    } catch (error) {
      throw error;
    }
  }
  async claimPreyBird(data) {
    try {
      await Helper.delay(
        1000,
        this.account,
        `Trying to do Claim Prey Reward Transaction...`,
        this
      );
      const birdArhieve = await this.checkUserArchieve(data, "claimPreyReward");
      const tx = new Transaction();
      await tx.moveCall({
        target: `${this.BIRDSENUM.PACKAGE_PREY}::entries::claimPreyReward`,
        arguments: [
          tx.pure(
            bcs
              .vector(bcs.u8())
              .serialize(Buffer.from(data.signature, "hex"))
              .toBytes()
          ),
          tx.pure(
            bcs
              .vector(bcs.u8())
              .serialize(Buffer.from(data.message, "hex"))
              .toBytes()
          ),
          tx.object(this.BIRDSENUM.PREY_BIRD_VAULT),
          tx.object(birdArhieve),
          tx.object(this.BIRDSENUM.PREY_VERSION),
        ],
      });
      tx.setGasBudget(1500000n);

      const txRes = await this.executeTx(tx);
      await this.confirmClaimPrey(data.token, txRes.digest);
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {Transaction} tx
   */
  async executeTx(tx) {
    try {
      await Helper.delay(1000, this.account, `Executing Tx ...`, this);
      logger.info(await tx.toJSON());
      const txRes = await this.client.signAndExecuteTransaction({
        signer: this.wallet,
        transaction: tx,
      });
      await Helper.delay(
        3000,
        this.account,
        `Tx Executed : ${`https://suivision.xyz/txblock/${txRes.digest}`}`,
        this
      );
      return txRes;
    } catch (error) {
      if (error.message.includes("No valid gas coins")) {
        this.useOnchain = false;
        await Helper.delay(
          5000,
          this.account,
          `${error.message}, Please fill up your SUI`,
          this
        );
      } else {
        throw error;
      }
    }
  }

  async getUserInfo(msg = false) {
    try {
      if (msg)
        await Helper.delay(
          1000,
          this.account,
          `Getting Game Information...`,
          this
        );

      const res = await this.fetch(`/user`, "GET");

      if (res.status == 200) {
        this.user = res;
        if (msg)
          await Helper.delay(
            1000,
            this.account,
            `Successfully Get User Information`,
            this
          );
      } else {
        throw Error(
          `Failed To Get Game Information : ${res.status} - ${res.message}`
        );
      }
    } catch (error) {
      throw error;
    }
  }
  async getIncubateInfo(msg = false) {
    try {
      if (msg)
        await Helper.delay(
          1000,
          this.account,
          `Getting Incubation Information...`,
          this
        );

      const res = await this.fetch(`/minigame/incubate/info`, "GET");

      if (res.status != 400) {
        this.incubate = res;
        if (msg)
          await Helper.delay(
            1000,
            this.account,
            `Successfully Get Incubation Information`,
            this
          );
      } else {
        if (msg) await Helper.delay(1000, this.account, res.message, this);
      }
    } catch (error) {
      throw error;
    }
  }

  async upgradeEgg() {
    try {
      await Helper.delay(2000, this.account, `Try To Upgrading Egg...`, this);

      const res = await this.fetch(`/minigame/incubate/upgrade`, "GET");

      if (res.status == 200) {
        this.incubate = res;

        await Helper.delay(
          2000,
          this.account,
          `Successfully Start Incubating Egg`,
          this
        );
      } else {
        await Helper.delay(1000, this.account, res.message, this);
      }
    } catch (error) {
      throw error;
    }
  }
  async confirmUpgrade() {
    try {
      await Helper.delay(1000, this.account, `Confirming Upgrade...`, this);

      const res = await this.fetch(
        `/minigame/incubate/confirm-upgraded`,
        "POST"
      );

      if (res.status == 200) {
        await Helper.delay(
          1000,
          this.account,
          `Successfully Confirming Upgrade`,
          this
        );
      } else {
        await Helper.delay(1000, this.account, res.message, this);
      }
    } catch (error) {
      throw error;
    }
  }
  async getWormInfo() {
    try {
      await Helper.delay(1000, this.account, `Getting Worm Info...`, this);

      const res = await this.fetch(
        `https://worm.birds.dog/worms/mint-status`,
        "GET",
        undefined,
        undefined,
        {
          Authorization: `tma ${this.query}`,
        },
        true
      );

      if (res.status == 200) {
        this.worm = res.data;

        await Helper.delay(
          1000,
          this.account,
          `Successfully Get Worm Mint Information`,
          this
        );
      } else {
        await Helper.delay(1000, this.account, res.message, this);
      }
    } catch (error) {
      throw error;
    }
  }
  async getPreyInfo() {
    try {
      await Helper.delay(
        1000,
        this.account,
        `Getting User Preying Information...`,
        this
      );

      const res = await this.fetch(
        `https://wallet.birds.dog/tasks/hunt-info`,
        "GET",
        undefined,
        undefined,
        {
          Authorization: `tma ${this.query}`,
        },
        true
      );

      if (res.status == 200) {
        this.hunt = res;

        await Helper.delay(
          1000,
          this.account,
          `Successfully Get Preying Information`,
          this
        );
      } else {
        await Helper.delay(1000, this.account, res.message, this);
      }
    } catch (error) {
      throw error;
    }
  }
  async getUnlockedWorm() {
    try {
      await Helper.delay(
        1000,
        this.account,
        `Getting User Unlocked Worm Information...`,
        this
      );

      const res = await this.fetch(
        ` https://wallet.birds.dog/tasks/worms-info?address=${this.address}`,
        "GET",
        undefined,
        undefined,
        {
          Authorization: `tma ${this.query}`,
        },
        true
      );

      if (res.status == 200) {
        this.unlockedWorm = await Object.keys(res)
          .filter((key) => key !== "status")
          .map((key) => res[key]);

        await Helper.delay(
          1000,
          this.account,
          `Successfully Get User Unlocked Worm Information`,
          this
        );
      } else {
        await Helper.delay(1000, this.account, res.message, this);
      }
    } catch (error) {
      throw error;
    }
  }
  async presignedCheckIn() {
    try {
      if (this.address) {
        await Helper.delay(
          1000,
          this.account,
          `Trying to Pre Signed CheckIn...`,
          this
        );

        const res = await this.fetch(
          `https://wallet.birds.dog/tasks/presigned-checkin`,
          "POST",
          undefined,
          {
            type: "0x1",
            address: this.address,
          },
          {
            Authorization: `tma ${this.query}`,
          },
          true
        );

        if (res.status == 200) {
          await Helper.delay(
            1000,
            this.account,
            `Successfully Pre Signed Check In`,
            this
          );
          await this.mineBird(res);
        } else {
          await Helper.delay(1000, this.account, res.message, this);
        }
      } else {
        await Helper.delay(
          3000,
          this.account,
          `Cannot Get Wallet Address Skipping...`,
          this
        );
      }
    } catch (error) {
      await Helper.delay(3000, this.account, error.message, this);
    }
  }
  async presignedFeeding(worm) {
    try {
      if (this.address) {
        await Helper.delay(
          2000,
          this.account,
          `Trying to Pre Signed Feeding...`,
          this
        );

        const res = await this.fetch(
          `https://wallet.birds.dog/tasks/presigned-feeding`,
          "POST",
          undefined,
          {
            address: this.address,
            wallet: {},
            wormType: worm.type,
          },
          {
            Authorization: `tma ${this.query}`,
          },
          true
        );

        if (res.status == 200) {
          await Helper.delay(
            1000,
            this.account,
            `Successfully Pre Signed Feeding`,
            this
          );
          await this.feedBird(res);
        } else {
          await Helper.delay(
            1000,
            this.account,
            `Feeding - ${res.message ? res.message : res.status}`,
            this
          );
          if (res.message) {
            if (res.message.includes("HUNT_NOT_AVAILABLE")) {
              this.stillHunting = true;
            }
          }
          this.preFeedingCd = true;
        }
      } else {
        await Helper.delay(
          3000,
          this.account,
          `Cannot Get Wallet Address Skipping...`,
          this
        );
      }
    } catch (error) {
      await Helper.delay(3000, this.account, error.message, this);
    }
  }
  async presignedUnlockWorm(worm) {
    try {
      if (this.address) {
        await Helper.delay(
          1000,
          this.account,
          `Trying to Pre Unlocked Worm with ID ${worm.uid} (${worm.type})...`,
          this
        );

        const res = await this.fetch(
          `https://market.birds.dog/swaps/deposit/nft/create-req`,
          "POST",
          undefined,
          {
            receiver: this.address,
            xids: [worm.uid],
          },
          {
            Authorization: `tma ${this.query}`,
          },
          true
        );

        if (res.status == 200) {
          await Helper.delay(
            1000,
            this.account,
            `Successfully Pre Unlock Worm With id ${worm.uid} (${worm.type}) Worm is Now pre_minted`,
            this
          );
        } else {
          await Helper.delay(
            3000,
            this.account,
            `${res.status} - ${Helper.msToTime(
              Helper.getTimeLeftISO(res.unlockAt)
            )}`,
            this
          );
          this.preUnlockWormCd = true;
        }
      } else {
        await Helper.delay(
          3000,
          this.account,
          `Cannot Get Wallet Address Skipping...`,
          this
        );
      }
    } catch (error) {
      await Helper.delay(3000, this.account, error.message, this);
    }
  }
  async getOnChainWorm(msg = false) {
    try {
      if (this.address) {
        if (msg)
          await Helper.delay(
            1000,
            this.account,
            `Trying to Get On Chain Worm`,
            this
          );

        const res = await this.fetch(
          `https://market.birds.dog/storages/on-chain?owner=${this.address}&page=1&perPage=20`,
          "GET",
          undefined,
          undefined,
          {
            Authorization: `tma ${this.query}`,
          },
          true
        );

        if (res.status == 200) {
          this.onChainWorm = res.data.nfts;
          if (msg)
            await Helper.delay(
              1000,
              this.account,
              `Successfully Get On Chain Worm`,
              this
            );
        } else {
          await Helper.delay(
            3000,
            this.account,
            `${res.status} - ${Helper.msToTime(
              Helper.getTimeLeftISO(res.unlockAt)
            )}`,
            this
          );
          this.preUnlockWormCd = true;
        }
      } else {
        await Helper.delay(
          3000,
          this.account,
          `Cannot Get Wallet Address Skipping...`,
          this
        );
      }
    } catch (error) {
      await Helper.delay(3000, this.account, error.message, this);
    }
  }
  async getWormDetails(worm) {
    try {
      if (this.address) {
        await Helper.delay(
          1000,
          this.account,
          `Get Worm Details of On Chain Worm id ${worm.xid}`,
          this
        );

        const res = await this.fetch(
          `https://market.birds.dog/swaps/deposit/nft/details?xid=${worm.xid}`,
          "GET",
          undefined,
          undefined,
          {
            Authorization: `tma ${this.query}`,
          },
          true
        );

        if (res.status == 200) {
          await Helper.delay(
            1000,
            this.account,
            `Successfully Get On Chain Worm Details with id ${worm.xid}`,
            this
          );
          return res.data;
        } else {
          await Helper.delay(
            3000,
            this.account,
            `${res.status} - ${Helper.msToTime(
              Helper.getTimeLeftISO(res.unlockAt)
            )}`,
            this
          );
          return undefined;
        }
      } else {
        await Helper.delay(
          3000,
          this.account,
          `Cannot Get Wallet Address Skipping...`,
          this
        );
      }
    } catch (error) {
      await Helper.delay(3000, this.account, error.message, this);
      return undefined;
    }
  }
  async presignedClaim() {
    try {
      if (this.address) {
        await Helper.delay(
          1000,
          this.account,
          `Trying to Pre Signed Claim Preying Reward...`,
          this
        );

        const res = await this.fetch(
          `https://wallet.birds.dog/tasks/presigned-claim`,
          "POST",
          undefined,
          { type: 4, address: this.address, wallet: {} },
          {
            Authorization: `tma ${this.query}`,
          },
          true
        );

        if (res.status == 200) {
          await Helper.delay(
            1000,
            this.account,
            `Successfully Pre Signed Claim Preying Reward`,
            this
          );
          await this.claimPreyBird(res);
        } else {
          await Helper.delay(
            3000,
            this.account,
            `${res.status} - ${Helper.msToTime(
              Helper.getTimeLeftISO(res.unlockAt)
            )}`,
            this
          );
        }
      } else {
        await Helper.delay(
          3000,
          this.account,
          `Cannot Get Wallet Address Skipping...`,
          this
        );
      }
    } catch (error) {
      await Helper.delay(3000, this.account, error.message, this);
    }
  }
  async presignedHunting() {
    try {
      if (this.address) {
        await Helper.delay(
          1000,
          this.account,
          `Trying to Pre Signed Hunting...`,
          this
        );

        const res = await this.fetch(
          `https://wallet.birds.dog/tasks/presigned-hunting`,
          "POST",
          undefined,
          {
            type: 3,
            address: this.address,
            wallet: {},
          },
          {
            Authorization: `tma ${this.query}`,
          },
          true
        );

        if (res.status == 200) {
          await Helper.delay(
            1000,
            this.account,
            `Successfully Pre Signed Hunting`,
            this
          );
          await this.preyBird(res);
        } else {
          const timeRemaining = Helper.getTimeLeftISO(res.unlockAt);

          if (timeRemaining == 0) {
            await Helper.delay(
              3000,
              this.account,
              `Hunt/Prey is finished try to claim...`,
              this
            );
            await this.presignedClaim();
          } else {
            await Helper.delay(
              3000,
              this.account,
              `${res.status} - ${Helper.msToTime(timeRemaining)}`,
              this
            );
          }
        }
      } else {
        await Helper.delay(
          3000,
          this.account,
          `Cannot Get Wallet Address Skipping...`,
          this
        );
      }
    } catch (error) {
      await Helper.delay(3000, this.account, error.message, this);
    }
  }
  async initWallet() {
    if (await this.getWalletAddress()) {
      await Helper.delay(1000, this.account, `Wallet Initialized...`, this);
    } else {
      await Helper.delay(
        3000,
        this.account,
        `Wallet Not Setted Correctly, Skipping...`,
        this
      );
    }
  }
  async confirmCheckIn(token, hash) {
    try {
      if (this.address) {
        await Helper.delay(
          1000,
          this.account,
          `Trying to Confirm CheckIn...`,
          this
        );

        const res = await this.fetch(
          `https://wallet.birds.dog/tasks/confirm-checkin`,
          "POST",
          undefined,
          { txHash: hash, token: token },
          {
            Authorization: `tma ${this.query}`,
          },
          true
        );

        if (res.status == 200) {
          await this.getUserInfo();
          await Helper.delay(3000, this.account, `Successfully Check In`, this);
        } else {
          await Helper.delay(1000, this.account, res.message, this);
        }
      } else {
        await Helper.delay(
          3000,
          this.account,
          `Cannot Get Wallet Address Skipping...`,
          this
        );
      }
    } catch (error) {
      throw error;
    }
  }
  async confirmFeeding(token, hash) {
    try {
      if (this.address) {
        await Helper.delay(
          1000,
          this.account,
          `Trying to Confirm Feeding...`,
          this
        );

        const res = await this.fetch(
          `https://wallet.birds.dog/tasks/confirm-feed`,
          "POST",
          undefined,
          { txHash: hash, token: token },
          {
            Authorization: `tma ${this.query}`,
          },
          true
        );

        if (res.status == 200) {
          await this.getPreyInfo();
          await this.getUnlockedWorm();
          await Helper.delay(3000, this.account, `Successfully Feeding`, this);
        } else {
          await Helper.delay(1000, this.account, res.message, this);
        }
      } else {
        await Helper.delay(
          3000,
          this.account,
          `Cannot Get Wallet Address Skipping...`,
          this
        );
      }
    } catch (error) {
      throw error;
    }
  }
  async confirmHunt(token, hash) {
    try {
      if (this.address) {
        await Helper.delay(
          1000,
          this.account,
          `Trying to Confirm Hunting...`,
          this
        );

        const res = await this.fetch(
          `https://wallet.birds.dog/tasks/confirm-hunt`,
          "POST",
          undefined,
          { txHash: hash, token: token },
          {
            Authorization: `tma ${this.query}`,
          },
          true
        );

        if (res.status == 200) {
          await this.getPreyInfo();
          await this.getUserInfo();
          await Helper.delay(
            3000,
            this.account,
            `Successfully Start Hunting`,
            this
          );
        } else {
          await Helper.delay(
            1000,
            this.account,
            `Successfully Start Hunting - ${res.status}`,
            this
          );
        }
      } else {
        await Helper.delay(
          3000,
          this.account,
          `Cannot Get Wallet Address Skipping...`,
          this
        );
      }
    } catch (error) {
      throw error;
    }
  }
  async confirmClaimPrey(token, hash) {
    try {
      if (this.address) {
        await Helper.delay(
          1000,
          this.account,
          `Trying to Confirm Claim Preying Reward...`,
          this
        );

        const res = await this.fetch(
          `https://wallet.birds.dog/tasks/confirm-claim`,
          "POST",
          undefined,
          { txHash: hash, token: token },
          {
            Authorization: `tma ${this.query}`,
          },
          true
        );

        if (res.status == 200) {
          await this.getPreyInfo();
          await this.getUserInfo();
          await Helper.delay(
            3000,
            this.account,
            `Successfully Claim Preying Reward`,
            this
          );
          this.stillHunting = false;
        } else {
          await Helper.delay(1000, this.account, res.message, this);
        }
      } else {
        await Helper.delay(
          3000,
          this.account,
          `Cannot Get Wallet Address Skipping...`,
          this
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async catchWorm() {
    try {
      await Helper.delay(1000, this.account, `Trying To Catch Worm...`, this);

      const res = await this.fetch(
        `https://worm.birds.dog/worms/mint`,
        "POST",
        undefined,
        undefined,
        {
          Authorization: `tma ${this.query}`,
        },
        true
      );

      if (res.status == 200) {
        await Helper.delay(1000, this.account, `${res.message}...`, this);
      } else {
        await Helper.delay(1000, this.account, res.message, this);
      }
    } catch (error) {
      throw error;
    }
  }
  async getLockedWorm() {
    try {
      await Helper.delay(1000, this.account, `Getting Locked Worm...`, this);

      const res = await this.fetch(
        ` https://worm.birds.dog/worms/me?page=1&perPage=50&status=locked`,
        "GET",
        undefined,
        undefined,
        {
          Authorization: `tma ${this.query}`,
        },
        true
      );

      if (res.status == 200) {
        this.lockedWorm = res.data;
        await Helper.delay(
          1000,
          this.account,
          `Successfully Get Locked Worm...`,
          this
        );
      } else {
        await Helper.delay(1000, this.account, res.message, this);
      }
    } catch (error) {
      throw error;
    }
  }

  async joinEggBreaking(msg = false) {
    try {
      if (msg)
        await Helper.delay(
          1000,
          this.account,
          `Trying To Join Egg Breaking Game...`,
          this
        );

      const res = await this.fetch(`/minigame/egg/join`, "GET");

      if (res.status == 200) {
        const res2 = await this.fetch(`/minigame/egg/turn`, "GET");
        this.game = res2;
        if (msg)
          await Helper.delay(
            1000,
            this.account,
            `Successfully Join Egg Breaking Game`,
            this
          );
      } else {
        await Helper.delay(1000, this.account, res.message, this);
      }
    } catch (error) {
      throw error;
    }
  }
  async breakEgg() {
    try {
      await Helper.delay(1000, this.account, `Beaking Egg...`, this);
      const res = await this.fetch(`/minigame/egg/play`, "GET");

      if (res.status == 200) {
        await this.joinEggBreaking();
        await Helper.delay(
          1000,
          this.account,
          `Successfully Breaking Egg Got ${res.result} BIRDS, Total : ${this.game.total}, ${res.turn} Left`,
          this
        );
      } else {
        await Helper.delay(1000, this.account, res.message, this);
      }
    } catch (error) {
      throw error;
    }
  }
  async claimEggGame() {
    try {
      await Helper.delay(
        1000,
        this.account,
        `Claiming Egg Game Reward...`,
        this
      );
      const res = await this.fetch(`/minigame/egg/claim`, "GET");

      if (res.status == 200) {
        await this.getUserInfo();
        await Helper.delay(
          1000,
          this.account,
          `Successfully Claiming Game Reward ${this.game.total}`,
          this
        );
      } else {
        await Helper.delay(1000, this.account, res.message, this);
      }
    } catch (error) {
      throw error;
    }
  }
  async getTask(msg = false) {
    try {
      if (msg) await Helper.delay(1000, this.account, `Getting Task...`, this);
      const res = await this.fetch(`/project`, "GET");

      if (res.status == 200) {
        this.task = res;
        await Helper.delay(1000, this.account, `Successfully Get Task`, this);
      } else {
        await Helper.delay(1000, this.account, res.message, this);
      }
    } catch (error) {
      throw error;
    }
  }
  async getUserTask(msg = false) {
    try {
      if (msg)
        await Helper.delay(1000, this.account, `Getting User Task...`, this);
      const res = await this.fetch(`/user-join-task`, "GET");

      if (res.status == 200) {
        this.userTask = res;
        await Helper.delay(
          1000,
          this.account,
          `Successfully Get User Task`,
          this
        );
      } else {
        await Helper.delay(1000, this.account, res.message, this);
      }
    } catch (error) {
      throw error;
    }
  }
  async startJoinTask(task) {
    try {
      await Helper.delay(
        1000,
        this.account,
        `Start And Join Task ${task.title}...`,
        this
      );
      const body = {
        taskId: task._id,
        channelId: task.channelId,
        // slug: task.slug,
        // point: task.point,
      };
      const res = await this.fetch(
        `/project/join-task`,
        "POST",
        undefined,
        body
      );

      if (res.status == 200) {
        await Helper.delay(1000, this.account, res.msg, this);
      } else {
        await Helper.delay(1000, this.account, res.message, this);
      }
    } catch (error) {
      throw error;
    }
  }
}
