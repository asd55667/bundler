export interface RollupLog {
  binding?: string;
  cause?: unknown;
  code?: string;
  exporter?: string;
  frame?: string;
  hook?: string;
  id?: string;
  ids?: string[];
  loc?: {
    column: number;
    file?: string;
    line: number;
  };
  message: string;
  meta?: any;
  names?: string[];
  plugin?: string;
  pluginCode?: unknown;
  pos?: number;
  reexporter?: string;
  stack?: string;
  url?: string;
}

export type RollupError = any;
export type RollupLog = any;
export type LogLevel = any;
export type Plugin = any;

export interface InputOptions {
  cache?: boolean | RollupCache;
  context?: string;
  experimentalCacheExpiry?: number;
  experimentalLogSideEffects?: boolean;
  external?: ExternalOption;
  input?: InputOption;
  logLevel?: LogLevelOption;
  makeAbsoluteExternalsRelative?: boolean | "ifRelativeSource";
  maxParallelFileOps?: number;
  moduleContext?:
    | ((id: string) => string | NullValue)
    | { [id: string]: string };
  onLog?: LogHandlerWithDefault;
  onwarn?: WarningHandlerWithDefault;
  perf?: boolean;
  plugins?: InputPluginOption;
  preserveEntrySignatures?: PreserveEntrySignaturesOption;
  preserveSymlinks?: boolean;
  shimMissingExports?: boolean;
  strictDeprecations?: boolean;
  treeshake?: boolean | TreeshakingPreset | TreeshakingOptions;
  watch?: WatcherOptions | false;
}

export interface RollupOptions extends InputOptions {
  // This is included for compatibility with config files but ignored by rollup.rollup
  output?: OutputOptions | OutputOptions[];
}
