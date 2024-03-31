import { Db } from "@/utils/db.ts";
import { Analytics } from "@/utils/analytics.ts";

export interface State {
  db: Db;
  analytics: Analytics;
}

export type Paste = {
  id: string;
  contents: string;
  createdOn: string;
};
