export interface PasteDb {
  getPasteById(id: string): Paste | undefined;
  insertPaste(contents: string): string;
}

export interface Analytics {
  trackPageView(req: Request): Promise<void>;
  trackEvent(
    req: Request,
    name: string,
    meta?: Record<string, string>,
    duration?: number,
  ): Promise<void>;
}

export interface State {
  db: PasteDb;
  analytics: Analytics;
}

export type Paste = {
  id: string;
  contents: string;
  createdOn: string;
};
