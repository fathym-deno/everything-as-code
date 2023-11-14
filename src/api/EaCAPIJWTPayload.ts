export type EaCAPIJWTPayload = Record<string, unknown> & {
  JWT?: string;

  Username?: string;
};
