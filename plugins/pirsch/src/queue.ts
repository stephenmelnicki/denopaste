import { FreshContext } from "$fresh/server.ts";
import { Pirsch, PirschHit, PirschNodeApiClient } from "pirsch";
import { delay } from "$std/async/mod.ts";

const UPLOAD_DELAY = 1000;

export class Queue {
  private items: PirschHit[] = [];
  private uploading = false;

  private readonly client?: PirschNodeApiClient;

  constructor(hostname?: string, id?: string, secret?: string) {
    if (!hostname || !id || !secret) {
      return;
    }

    this.client = new Pirsch({
      hostname,
      clientId: id,
      clientSecret: secret,
    });
  }

  get length() {
    return this.items.length;
  }

  enqueue(request: Request, context: FreshContext) {
    this.items.push(this.createHit(request, context));

    if (!this.uploading) {
      this.uploading = true;
      setTimeout(this.upload.bind(this), UPLOAD_DELAY);
    }
  }

  private createHit(request: Request, context: FreshContext): PirschHit {
    return {
      url: request.url,
      ip: context.remoteAddr.hostname,
      user_agent: request.headers.get("user-agent")!,
      accept_language: request.headers.get("accept-language") || undefined,
      referrer: request.headers.get("referrer") || undefined,
    } as PirschHit;
  }

  private async upload() {
    while (this.length > 0) {
      const item = this.items.shift();

      try {
        if (this.client) await this.client.hit(item!);
      } catch (err) {
        console.error(err);
        await delay(UPLOAD_DELAY);
      }
    }

    this.uploading = false;
  }
}
