export type EaCDistributedFileSystem<TType = unknown> = {
  CacheDBLookup?: string;

  CacheSeconds?: number;

  DefaultFile?: string;

  Extensions?: string[];

  Type: TType;

  UseCascading?: boolean;
};

export function isEaCDistributedFileSystem<TType = unknown>(
  type: TType,
  dfs: unknown,
): dfs is EaCDistributedFileSystem<TType> {
  const x = dfs as EaCDistributedFileSystem<TType>;

  return x && (!type || x.Type === type);
}
