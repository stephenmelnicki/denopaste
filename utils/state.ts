import { createDefine } from "fresh";

interface State {
  title?: string;
}

export const define = createDefine<State>();
