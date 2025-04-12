import { HttpsProxyAgent } from "https-proxy-agent";
import { Helper } from "../utils/helper.js";
import logger from "../utils/logger.js";
import https from "https";
import fetch from "node-fetch";

export class API {
  constructor(query, user, proxy, url, origin, referer) {
    this.url = url;
    this.queryObj = user;
    this.origin = origin;
    this.referer = referer;
    this.ua = Helper.randomUserAgent();
    this.query = query;
    this.proxy = proxy;
  }

  async generateHeaders(token = this.query) {
    const headers = {
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
      "Content-Type": "application/json",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Site": "same-site",
      "Sec-Fetch-Mode": "cors",
      "User-Agent": this.ua,
      // Host: this.host,
      Origin: this.origin,
    };

    if (token) {
      headers.telegramAuth = `tma ${token}`;
    }

    return headers;
  }

  async fetch(
    endpoint,
    method = "GET",
    token,
    body = {},
    additionalHeader = {},
    customUrl = false
  ) {
    try {
      const url = customUrl ? endpoint : `${this.url}${endpoint}`;
      const headers = {
        ...(await this.generateHeaders(token)),
        ...additionalHeader,
      };

      logger.info(`${method} : ${url} ${this.proxy ? this.proxy : ""}`);
      logger.info(`Request Header : ${JSON.stringify(headers)}`);
      logger.info(`Request Body : ${JSON.stringify(body)}`);

      const options = {
        method,
        headers,
        agent: this.proxy
          ? new HttpsProxyAgent(this.proxy)
          : new https.Agent({ rejectUnauthorized: false }),
        body: method !== "GET" ? JSON.stringify(body) : undefined,
        Referer: this.referer,
      };
      const res = await fetch(url, options);

      const contentType = res.headers.get("Content-Type");
      let responseData;
      if (contentType && contentType.includes("application/json")) {
        responseData = await res.json();
      } else {
        responseData = {
          message: await res.text(),
        };
      }

      const data = {
        status: res.status,
        ...responseData,
      };

      logger.info(`Response : ${res.status} ${res.statusText}`);
      logger.info(
        `Response Data : ${JSON.stringify(responseData).substring(0, 1000)}...`
      );

      return data;
    } catch (err) {
      logger.error(`Error : ${err.message}`);
      if (err.response && err.response.status === 400) {
        const data = {
          status: err.response.status,
          ...(await err.response.json()),
        };
        return data;
      } else if (err.response && err.response.status === 429) {
        throw Error(`${err.response.status} - ${err.message}`);
      } else {
        if (
          err.response &&
          (err.response.status === 504 || err.response.status === 404)
        ) {
          console.error("DETECT API CHANGE.. EXIT");
          await process.exit();
        } else {
          throw err;
        }
      }
    }
  }
}
