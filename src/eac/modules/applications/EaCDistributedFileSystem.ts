export type EaCDistributedFileSystem<TType = unknown> = {
  DefaultFile?: string;

  Type: TType;
};

export function isEaCDistributedFileSystem<TType = unknown>(
  type: TType,
  dfs: unknown,
): dfs is EaCDistributedFileSystem<TType> {
  const x = dfs as EaCDistributedFileSystem<TType>;

  return x && (!type || x.Type === type);
}
