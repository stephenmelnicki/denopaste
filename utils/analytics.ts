import { FreshContext } from "fresh";
import { Pirsch, PirschHit, PirschNodeApiClient } from "pirsch";

export const getAnalytics: () => Analytics = (() => {
  let analytics: Analytics;

  return function () {
    if (!analytics) {
      analytics = new Tracker();
    }

    return analytics;
  };
})();

interface Analytics {
  trackPageView(req: Request, ctx: FreshContext): Promise<void>;
  trackEvent(
    req: Request,
    ctx: FreshContext,
    name: string,
    meta?: Record<string, string>,
    duration?: number,
  ): Promise<void>;
}

class Tracker implements Analytics {
  private readonly client: PirschNodeApiClient;

  constructor() {
    this.client = new Pirsch({
      hostname: Deno.env.get("PIRSCH_HOSTNAME")!,
      accessToken: Deno.env.get("PIRSCH_TOKEN")!,
      protocol: "https",
    });
  }

  public async trackPageView(req: Request, ctx: FreshContext) {
    try {
      await this.client.hit(this.requestToPirschHit(req, ctx));
    } catch (err) {
      console.error("Error tracking page view", err);
    }
  }

  public async trackEvent(
    req: Request,
    ctx: FreshContext,
    name: string,
    meta?: Record<string, string>,
    duration?: number,
  ) {
    try {
      await this.client.event(
        name,
        this.requestToPirschHit(req, ctx),
        duration,
        meta,
      );
    } catch (err) {
      console.error("Error tracking event", err);
    }
  }

  private getClientIp(req: Request, ctx: FreshContext): string {
    const forwardedFor = req.headers.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(/\s*,\s*/)[0];
    } else {
      return (ctx.info.remoteAddr as Deno.NetAddr).hostname;
    }
  }

  private requestToPirschHit(req: Request, ctx: FreshContext): PirschHit {
    return {
      url: req.url,
      ip: this.getClientIp(req, ctx),
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
