import { createDefine } from "fresh";
import { type Database } from "./db.ts";

export interface State {
  title?: string;
  db: Database;
}

export const define = createDefine<State>();
