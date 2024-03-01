export type EaCApplicationResolverConfiguration = {
  AllowedMethods?: string[];

  IsPrivate?: boolean;

  IsTriggerSignIn?: boolean;

  PathPattern: string;

  Priority: number;

  UserAgentRegex?: string;
};
