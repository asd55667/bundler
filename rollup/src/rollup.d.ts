export type GraphOptions = {
  input: Entry;
  external: External;
  plugins: Plugin[];
};

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

type Entry = { [entryAlias: string]: string };
export type InputOption = string | string[] | Entry;

type External = (
  source: string,
  importer: string | undefined,
  isResolved: boolean
) => boolean | NullValue;
export type ExternalOption = (string | RegExp)[] | string | RegExp | External;

export interface RollupOptions extends InputOptions {
  // This is included for compatibility with config files but ignored by rollup.rollup
  output?: OutputOptions | OutputOptions[];
}

export type ObjectRule = ("*" | [string, unknown])[];

//
export interface OutputOptions {
  amd?: AmdOptions;
  assetFileNames?: string | ((chunkInfo: PreRenderedAsset) => string);
  banner?: string | AddonFunction;
  chunkFileNames?: string | ((chunkInfo: PreRenderedChunk) => string);
  compact?: boolean;
  // only required for bundle.write
  dir?: string;
  dynamicImportInCjs?: boolean;
  entryFileNames?: string | ((chunkInfo: PreRenderedChunk) => string);
  esModule?: boolean | "if-default-prop";
  experimentalMinChunkSize?: number;
  exports?: "default" | "named" | "none" | "auto";
  extend?: boolean;
  /** @deprecated Use "externalImportAttributes" instead. */
  externalImportAssertions?: boolean;
  externalImportAttributes?: boolean;
  externalLiveBindings?: boolean;
  // only required for bundle.write
  file?: string;
  footer?: string | AddonFunction;
  format?: ModuleFormat;
  freeze?: boolean;
  generatedCode?: GeneratedCodePreset | GeneratedCodeOptions;
  globals?: GlobalsOption;
  hashCharacters?: HashCharacters;
  hoistTransitiveImports?: boolean;
  importAttributesKey?: ImportAttributesKey;
  indent?: string | boolean;
  inlineDynamicImports?: boolean;
  interop?: InteropType | GetInterop;
  intro?: string | AddonFunction;
  manualChunks?: ManualChunksOption;
  minifyInternalExports?: boolean;
  name?: string;
  noConflict?: boolean;
  outro?: string | AddonFunction;
  paths?: OptionsPaths;
  plugins?: OutputPluginOption;
  preserveModules?: boolean;
  preserveModulesRoot?: string;
  reexportProtoFromExternal?: boolean;
  sanitizeFileName?: boolean | ((fileName: string) => string);
  sourcemap?: boolean | "inline" | "hidden";
  sourcemapBaseUrl?: string;
  sourcemapExcludeSources?: boolean;
  sourcemapFile?: string;
  sourcemapFileNames?: string | ((chunkInfo: PreRenderedChunk) => string);
  sourcemapIgnoreList?: boolean | SourcemapIgnoreListOption;
  sourcemapPathTransform?: SourcemapPathTransformOption;
  strict?: boolean;
  systemNullSetters?: boolean;
  validate?: boolean;
}

export interface RollupOutput {
  output: [OutputChunk, ...(OutputChunk | OutputAsset)[]];
}

export interface OutputChunk extends RenderedChunk {
  code: string;
  map: SourceMap | null;
  sourcemapFileName: string | null;
  preliminaryFileName: string;
}

export interface RenderedChunk extends PreRenderedChunk {
  dynamicImports: string[];
  fileName: string;
  implicitlyLoadedBefore: string[];
  importedBindings: {
    [imported: string]: string[];
  };
  imports: string[];
  modules: {
    [id: string]: RenderedModule;
  };
  referencedFiles: string[];
}

export interface PreRenderedChunk {
  exports: string[];
  facadeModuleId: string | null;
  isDynamicEntry: boolean;
  isEntry: boolean;
  isImplicitEntry: boolean;
  moduleIds: string[];
  name: string;
  type: "chunk";
}

export interface RenderedModule {
  readonly code: string | null;
  originalLength: number;
  removedExports: string[];
  renderedExports: string[];
  renderedLength: number;
}

export interface SourceMap {
  file: string;
  mappings: string;
  names: string[];
  sources: string[];
  sourcesContent?: string[];
  version: number;
  toString(): string;
  toUrl(): string;
}

export interface OutputAsset extends PreRenderedAsset {
  fileName: string;
  needsCodeReference: boolean;
}

export interface PreRenderedAsset {
  name: string | undefined;
  source: string | Uint8Array;
  type: "asset";
}

export type InputPluginOption = MaybePromise<
  Plugin | NullValue | false | InputPluginOption[]
>;

type NullValue = null | undefined | void;
type MaybeArray<T> = T | T[];
type MaybePromise<T> = T | Promise<T>;

export interface Plugin<A = any> extends OutputPlugin, Partial<PluginHooks> {
  // for inter-plugin communication
  api?: A;
}

export interface OutputPlugin
  extends Partial<{ [K in OutputPluginHooks]: PluginHooks[K] }>,
    Partial<{ [K in AddonHooks]: ObjectHook<AddonHook> }> {
  cacheKey?: string;
  name: string;
  version?: string;
}

export type PluginHooks = {
  [K in keyof FunctionPluginHooks]: ObjectHook<
    K extends AsyncPluginHooks
      ? MakeAsync<FunctionPluginHooks[K]>
      : FunctionPluginHooks[K],
    // eslint-disable-next-line @typescript-eslint/ban-types
    K extends ParallelPluginHooks ? { sequential?: boolean } : {}
  >;
};

export type OutputPluginHooks =
  | "augmentChunkHash"
  | "generateBundle"
  | "outputOptions"
  | "renderChunk"
  | "renderDynamicImport"
  | "renderError"
  | "renderStart"
  | "resolveFileUrl"
  | "resolveImportMeta"
  | "writeBundle";

export type AddonHooks = "banner" | "footer" | "intro" | "outro";

type ObjectHook<T, O = {}> =
  | T
  | ({ handler: T; order?: "pre" | "post" | null } & O);

export interface FunctionPluginHooks {
  augmentChunkHash: (
    this: PluginContext,
    chunk: RenderedChunk
  ) => string | void;
  buildEnd: (this: PluginContext, error?: Error) => void;
  buildStart: (this: PluginContext, options: NormalizedInputOptions) => void;
  closeBundle: (this: PluginContext) => void;
  closeWatcher: (this: PluginContext) => void;
  generateBundle: (
    this: PluginContext,
    options: NormalizedOutputOptions,
    bundle: OutputBundle,
    isWrite: boolean
  ) => void;
  load: LoadHook;
  moduleParsed: ModuleParsedHook;
  onLog: (
    this: MinimalPluginContext,
    level: LogLevel,
    log: RollupLog
  ) => boolean | NullValue;
  options: (
    this: MinimalPluginContext,
    options: InputOptions
  ) => InputOptions | NullValue;
  outputOptions: (
    this: PluginContext,
    options: OutputOptions
  ) => OutputOptions | NullValue;
  renderChunk: RenderChunkHook;
  renderDynamicImport: (
    this: PluginContext,
    options: {
      customResolution: string | null;
      format: InternalModuleFormat;
      moduleId: string;
      targetModuleId: string | null;
    }
  ) => { left: string; right: string } | NullValue;
  renderError: (this: PluginContext, error?: Error) => void;
  renderStart: (
    this: PluginContext,
    outputOptions: NormalizedOutputOptions,
    inputOptions: NormalizedInputOptions
  ) => void;
  resolveDynamicImport: ResolveDynamicImportHook;
  resolveFileUrl: ResolveFileUrlHook;
  resolveId: ResolveIdHook;
  resolveImportMeta: ResolveImportMetaHook;
  shouldTransformCachedModule: ShouldTransformCachedModuleHook;
  transform: TransformHook;
  watchChange: WatchChangeHook;
  writeBundle: (
    this: PluginContext,
    options: NormalizedOutputOptions,
    bundle: OutputBundle
  ) => void;
}

export type AsyncPluginHooks = Exclude<
  keyof FunctionPluginHooks,
  SyncPluginHooks
>;

type MakeAsync<Function_> = Function_ extends (
  this: infer This,
  ...parameters: infer Arguments
) => infer Return
  ? (this: This, ...parameters: Arguments) => Return | Promise<Return>
  : never;

export type ParallelPluginHooks = Exclude<
  keyof FunctionPluginHooks | AddonHooks,
  FirstPluginHooks | SequentialPluginHooks
>;

export type FirstPluginHooks =
  | "load"
  | "renderDynamicImport"
  | "resolveDynamicImport"
  | "resolveFileUrl"
  | "resolveId"
  | "resolveImportMeta"
  | "shouldTransformCachedModule";

export type SequentialPluginHooks =
  | "augmentChunkHash"
  | "generateBundle"
  | "onLog"
  | "options"
  | "outputOptions"
  | "renderChunk"
  | "transform";
