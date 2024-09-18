import { createDefine } from "fresh";
import PasteDatabase from "../data/mod.ts";

export interface State {
  title?: string;
  db: PasteDatabase;
}

export const define = createDefine<State>();
