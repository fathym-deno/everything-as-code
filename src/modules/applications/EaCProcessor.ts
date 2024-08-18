export type EaCProcessor<TType = unknown> = {
  CacheControl?: Record<string, string>;

  ForceCache?: boolean;

  Type: TType;
};

export function isEaCProcessor<TType = unknown>(
  type: TType,
  proc: unknown,
): proc is EaCProcessor {
  const x = proc as EaCProcessor;

  return x && (!type || x.Type === type);
}
