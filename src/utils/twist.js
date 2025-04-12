import { Twisters } from "twisters";
import logger from "./logger.js";
import { Core } from "../core/core.js";

class Twist {
  constructor() {
    /** @type  {Twisters}*/
    this.twisters = new Twisters();
  }

  /**
   * @param {string} acc
   * @param {Core} core
   * @param {string} msg
   * @param {string} delay
   */
  log(msg = "", acc = "", core = new Core(), delay) {
    // console.log(acc);
    if (delay == undefined) {
      logger.info(`${acc.id} - ${msg}`);
      delay = "-";
    }

    const user = core.user ?? {};
    const balance = user.balance ?? "-";

    this.twisters.put(acc.id, {
      text: `
================= Account ${acc.id} =============
Name         : ${acc.firstName ?? "Unamed"} ${acc.lastName ?? ""} 
Balance      : ${balance} BIRDS

Status : ${msg}
Delay : ${delay}
==============================================`,
    });
  }
  /**
   * @param {string} msg
   */
  info(msg = "") {
    this.twisters.put(2, {
      text: `
==============================================
Info : ${msg}
==============================================`,
    });
    return;
  }

  clearInfo() {
    this.twisters.remove(2);
  }

  async clear(acc) {
    // await this.twisters.remove(acc);
    await this.twisters.flush();
  }
}
export default new Twist();
