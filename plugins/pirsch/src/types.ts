export interface PirschPluginOptions {
  hostname?: string;
  id?: string;
  secret?: string;
  filter?: (req: Request) => boolean;
}
