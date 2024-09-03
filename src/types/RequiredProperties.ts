import { RemoveIndexSignature } from "jsr:@fathym/common@0.2.50";
import { EaCDistributedFileSystemDetails } from "../modules/dfs/EaCDistributedFileSystemDetails.ts";
import { IsRequiredProperty } from "./IsRequiredProperty.ts";
import { EaCDistributedFileSystemAsCode } from "../modules/dfs/EaCDistributedFileSystemAsCode.ts";
import { EverythingAsCodeDFS } from "../modules/dfs/EverythingAsCodeDFS.ts";
import { EverythingAsCode } from "../azure/.deps.ts";
import { EverythingAsCodeApplications } from "../modules/applications/EverythingAsCodeApplications.ts";

export type RequiredProperties<T> = {
  [
    K in keyof RemoveIndexSignature<T> as IsRequiredProperty<
      RemoveIndexSignature<T>,
      K
    > extends true ? K
      : never
  ]: NonNullable<T[K]>;
};

type t = RequiredProperties<
  RemoveIndexSignature<EaCDistributedFileSystemDetails>
>;
type tt = RequiredProperties<
  RemoveIndexSignature<EaCDistributedFileSystemAsCode>
>;
type ttt = RequiredProperties<
  RemoveIndexSignature<EverythingAsCodeApplications>
>;
