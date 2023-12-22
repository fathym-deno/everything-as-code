import { Handlers, PageProps } from "$fresh/server.ts";
import { EaCCreateForm } from "@fathym/atomic";
import { EverythingAsCodeState } from "../../src/eac/EverythingAsCodeState.ts";
import { fathymDenoKv } from "../../configs/fathym-deno-kv.config.ts";
import { redirectRequest } from "@fathym/common";
import { waitForStatus } from "../../src/utils/eac/waitForStatus.ts";
import { loadEaCSvc } from "../../configs/eac.ts";
import { EaCStatusProcessingTypes } from "../../src/api/models/EaCStatusProcessingTypes.ts";
import { FathymEaC } from "../../src/FathymEaC.ts";

type EnterprisePageData = {};

export const handler: Handlers<
  EnterprisePageData | null,
  EverythingAsCodeState
> = {
  async GET(_req, ctx) {
    const data: EnterprisePageData = {};

    return ctx.render(data);
  },

  async POST(req, ctx) {
    const formData = await req.formData();

    const newEaC: FathymEaC = {
      EnterpriseLookup: ctx.state.EaC?.EnterpriseLookup || crypto.randomUUID(),
      Details: {
        Name: formData.get("name") as string,
        Description: formData.get("description") as string,
      },
    };

    const eacSvc = await loadEaCSvc(
      newEaC.EnterpriseLookup!,
      ctx.state.Username!,
    );

    const createResp = await eacSvc.Create(newEaC, 60);

    const status = await waitForStatus(
      eacSvc,
      createResp.EnterpriseLookup,
      createResp.CommitID,
    );

    if (status.Processing == EaCStatusProcessingTypes.COMPLETE) {
      await fathymDenoKv.set(
        ["User", ctx.state.Username!, "Current", "EaC"],
        createResp.EnterpriseLookup,
      );

      return redirectRequest("/dashboard");
    } else {
      return redirectRequest(
        `/dashboard?error=${
          encodeURIComponent(
            status.Messages["Error"] as string,
          )
        }&commitId=${createResp.CommitID}`,
      );
    }
  },
};

export default function Enterprise({
  data,
}: PageProps<EnterprisePageData | null, EverythingAsCodeState>) {
  return <EaCCreateForm action="" />;
}
