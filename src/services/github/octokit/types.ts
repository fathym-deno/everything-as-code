import { components } from "@octokit/openapi-types";
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export type ShortBranch = components["schemas"]["short-branch"];

export type ProtectedBranch = components["schemas"]["protected-branch"];

export type Branch = ShortBranch; // & ProtectedBranch;

export type RepositoryCreateInOrgParameters =
  RestEndpointMethodTypes["repos"]["createInOrg"]["parameters"];

export type RepositoryCreateForAuthenticatedUserParameters =
  RestEndpointMethodTypes["repos"]["createInOrg"]["parameters"];

export type NewRepository =
  | RepositoryCreateInOrgParameters
  | RepositoryCreateForAuthenticatedUserParameters;

export type Repository = components["schemas"]["repository"];
