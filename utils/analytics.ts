import { Pirsch, PirschNodeApiClient } from "pirsch";

export class Analytics {
  private readonly client: PirschNodeApiClient;

  constructor() {
    this.client = new Pirsch({
      hostname: Deno.env.get("PIRSCH_HOSTNAME")!,
      accessToken: Deno.env.get("PIRSCH_TOKEN")!,
      protocol: "https",
    });
  }

  public async pageView(req: Request) {
    try {
      await this.client.hit(
        this.client.hitFromRequest(this.toPirschRequest(req)),
      );
    } catch (err) {
      console.error("Error sending page view to Pirsch", err);
    }
  }

  public async event(
    req: Request,
    name: string,
    meta?: Record<string, string>,
    duration?: number,
  ) {
    try {
      await this.client.event(
        name,
        this.client.hitFromRequest(this.toPirschRequest(req)),
        duration,
        meta,
      );
    } catch (err) {
      console.error("Error sending event to Pirsch", err);
    }
  }

  private toPirschRequest(req: Request) {
    return {
      url: req.url,
      socket: {
        // NOTE: Using fly.io specific header to get client ip
        remoteAddress: req.headers.get("fly-client-ip"),
      },
      headers: {
        dnt: req.headers.get("dnt"),
        "user-agent": req.headers.get("user-agent"),
        "accept-language": req.headers.get("accept-language"),
        referer: req.headers.get("referer"),
      },
    };
  }
}
