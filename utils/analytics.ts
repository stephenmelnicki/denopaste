import { Pirsch, PirschHit, PirschNodeApiClient } from "pirsch";
import { Analytics } from "@/utils/types.ts";

export const getAnalyticsInstance: () => Analytics = (() => {
  let analytics: Analytics;

  return function () {
    if (!analytics) {
      analytics = new Tracker();
    }

    return analytics;
  };
})();

class Tracker implements Analytics {
  private readonly client: PirschNodeApiClient;

  constructor() {
    this.client = new Pirsch({
      hostname: Deno.env.get("PIRSCH_HOSTNAME")!,
      accessToken: Deno.env.get("PIRSCH_TOKEN")!,
      protocol: "https",
    });
  }

  public async trackPageView(req: Request) {
    try {
      await this.client.hit(this.requestToPirschHit(req));
    } catch (err) {
      console.error("Error tracking page view", err);
    }
  }

  public async trackEvent(
    req: Request,
    name: string,
    meta?: Record<string, string>,
    duration?: number,
  ) {
    try {
      await this.client.event(
        name,
        this.requestToPirschHit(req),
        duration,
        meta,
      );
    } catch (err) {
      console.error("Error tracking event", err);
    }
  }

  private requestToPirschHit(req: Request): PirschHit {
    return {
      url: req.url,
      // NOTE: header is specific to fly.io - change as needed for your hosting provider.
      ip: req.headers.get("fly-client-ip") || "",
      user_agent: req.headers.get("user-agent") || "",
      accept_language: req.headers.get("accept-language") || undefined,
      sec_ch_ua: req.headers.get("sec-ch-ua") || undefined,
      sec_ch_ua_mobile: req.headers.get("sec-ch-ua-mobile") || undefined,
      sec_ch_ua_platform: req.headers.get("sec-ch-ua-platform") || undefined,
      sec_ch_ua_platform_version:
        req.headers.get("sec-ch-ua-platform-version") || undefined,
      sec_ch_width: req.headers.get("sec-ch-width") || undefined,
      sec_ch_viewport_width: req.headers.get("sec-ch-viewport-width") ||
        undefined,
      referrer: req.headers.get("referer") || undefined,
    };
  }
}
