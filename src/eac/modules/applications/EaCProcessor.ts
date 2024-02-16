export type EaCProcessor = {
  CacheControl?: string;
};

export function isEaCProcessor(details: unknown): details is EaCProcessor {
  const proc = details as EaCProcessor;

  return !!proc;
}
