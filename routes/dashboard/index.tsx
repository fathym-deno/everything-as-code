import { Handlers, PageProps } from "$fresh/server.ts";
import { redirectRequest } from "@fathym/common";
import { jwtConfig } from "../../configs/jwt.config.ts";
import { EverythingAsCodeState } from "../../src/eac/EverythingAsCodeState.ts";

interface JWTPageData {
  jwt?: string;
}

export const handler: Handlers<JWTPageData | null, EverythingAsCodeState> = {
  GET(_, ctx) {
    return redirectRequest("/dashboard/jwt");
  },
};
