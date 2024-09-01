import { EaCVertexDetails } from "../../eac/EaCVertexDetails.ts";

export type EaCDistributedFileSystemDetails<TType = unknown> = {
  CacheDBLookup?: string;

  CacheSeconds?: number;

  DefaultFile?: string;

  Extensions?: string[];

  Type: TType;

  UseCascading?: boolean;

  WorkerPath?: string;
} & EaCVertexDetails;

export function isEaCDistributedFileSystemDetails<TType = unknown>(
  type: TType,
  dfs: unknown,
): dfs is EaCDistributedFileSystemDetails<TType> {
  const x = dfs as EaCDistributedFileSystemDetails<TType>;

  return x && (!type || x.Type === type);
}
