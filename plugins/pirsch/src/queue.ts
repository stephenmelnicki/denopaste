import { FreshContext } from "$fresh/server.ts";
import { Pirsch, PirschHit, PirschNodeApiClient } from "pirsch";
import { delay } from "$std/async/mod.ts";

const UPLOAD_DELAY = 1000;

function createHit(request: Request, context: FreshContext): PirschHit {
  return {
    url: request.url,
    ip: context.remoteAddr.hostname,
    dnt: request.headers.get("dnt"),
    user_agent: request.headers.get("user-agent")!,
    accept_language: request.headers.get("accept-language"),
    sec_ch_ua: request.headers.get("sec-ch-ua"),
    sec_ch_ua_mobile: request.headers.get("sec-ch-ua-mobile"),
    sec_ch_ua_platform: request.headers.get("sec-ch-ua-platform"),
    sec_ch_ua_platform_version: request.headers.get(
      "sec-ch-ua-platform-version",
    ),
    sec_ch_width: request.headers.get("sec-ch-width"),
    sec_ch_viewport_width: request.headers.get("sec-ch-viewport-width"),
    title: request.headers.get("title"),
    referrer: request.headers.get("referer"),
  } as PirschHit;
}

export class Queue {
  private items: PirschHit[] = [];
  private uploading = false;

  private readonly client?: PirschNodeApiClient;

  constructor(hostname?: string, clientId?: string, clientSecret?: string) {
    if (!hostname || !clientId || !clientSecret) {
      return;
    }

    this.client = new Pirsch({
      hostname,
      clientId,
      clientSecret,
    });
  }

  get length() {
    return this.items.length;
  }

  push(request: Request, context: FreshContext) {
    this.items.push(createHit(request, context));

    if (!this.uploading) {
      this.uploading = true;
      setTimeout(this.upload.bind(this), UPLOAD_DELAY);
    }
  }

  private async upload() {
    while (this.length > 0) {
      const item = this.items.shift();

      try {
        await this.client?.hit(item!);
      } catch (err) {
        console.error(err);
        await delay(UPLOAD_DELAY);
      }
    }

    this.uploading = false;
  }
}
