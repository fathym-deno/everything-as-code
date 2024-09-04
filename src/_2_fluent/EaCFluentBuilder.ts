import { jsonMapSetClone } from "../src.deps.ts";
import {
  configureEaCIoC,
  EaCRuntimePlugin,
  EverythingAsCode,
  FathymDFSFileHandlerPlugin,
  FathymEaCServicesPlugin,
  FathymSynapticPlugin,
  IoCContainer,
  ValueType,
} from "./.deps.ts";
import { EaCFluentBuilderProxy } from "./EaCFluentBuilderProxy.ts";
import { SelectEaCFluentMethods } from "./types/SelectEaCFluentMethods.ts";

export function eacFluentBuilder<
  TEaC extends EverythingAsCode = EverythingAsCode,
>(eac?: TEaC): EaCFluentBuilder<TEaC> & SelectEaCFluentMethods<TEaC, TEaC> {
  return new EaCFluentBuilder<TEaC>([], eac) as
    & EaCFluentBuilder<TEaC>
    & SelectEaCFluentMethods<TEaC, TEaC>;
}

export class EaCFluentBuilder<
  TEaC extends EverythingAsCode,
> extends EaCFluentBuilderProxy<TEaC> {
  // @ts-ignore Purposefully return super, but this breaks super call for derived classes
  constructor(keyDepth?: string[], eac?: TEaC) {
    const check = super(keyDepth, eac) as unknown as this;

    return check;
  }

  public async Compile(
    ioc?: IoCContainer,
    plugins?: EaCRuntimePlugin[],
  ): Promise<IoCContainer> {
    const circsIoC = new IoCContainer();

    if (ioc) {
      ioc.CopyTo(circsIoC);
    }

    if (!plugins) {
      plugins = [];
    }

    plugins.push(new FathymDFSFileHandlerPlugin());

    plugins.push(new FathymEaCServicesPlugin());

    plugins.push(new FathymSynapticPlugin());

    await configureEaCIoC(circsIoC, this.Export(), plugins);

    return circsIoC;
  }

}
