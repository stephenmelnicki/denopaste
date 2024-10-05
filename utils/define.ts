import { createDefine } from "fresh";

export interface State {
  title?: string;
  kv: Deno.Kv;
}

export const define = createDefine<State>();
