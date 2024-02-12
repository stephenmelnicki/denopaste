import { delay } from "$std/async/mod.ts";
import { PirschHit, PirschNodeApiClient } from "pirsch";

export class Queue {
  private readonly client: PirschNodeApiClient;
  private items: PirschHit[] = [];
  private uploading = false;

  private static readonly UPLOAD_DELAY = 1000;

  constructor(client: PirschNodeApiClient) {
    this.client = client;
  }

  get length() {
    return this.items.length;
  }

  enqueue(item: PirschHit) {
    this.items.push(item);

    if (!this.uploading) {
      this.uploading = true;
      setTimeout(this.upload.bind(this), Queue.UPLOAD_DELAY);
    }
  }

  private async upload() {
    while (this.length > 0) {
      const item = this.items.shift();

      try {
        console.log("Uploading hit...");
        await this.client.hit(item!);
        console.log("done.");
      } catch (err) {
        console.error(err);
        await delay(Queue.UPLOAD_DELAY);
      }
    }

    this.uploading = false;
  }
}
