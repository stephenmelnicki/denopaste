import { FreshContext } from "fresh";

import { type State } from "../utils/define.ts";
import { getKvInstance } from "../data/mod.ts";

export async function handler(ctx: FreshContext<State>): Promise<Response> {
  ctx.state.kv = await getKvInstance();
  return await ctx.next();
}
