import {
  EverythingAsCode,
  FluentBuilder,
  fluentBuilder,
  FluentBuilderHandlers,
  IoCContainer,
  IsFluentBuildable,
  SelectFluentMethods,
} from './.deps.ts';

export function eacFluentBuilder<
  TEaC extends EverythingAsCode = EverythingAsCode
>(
  eac?: IsFluentBuildable<TEaC>
): FluentBuilder<TEaC> & SelectFluentMethods<TEaC, TEaC> {
  const handlers: FluentBuilderHandlers = {
    // async Compile(
    //   ioc?: IoCContainer,
    //   plugins?: EaCRuntimePlugin[]
    // ): Promise<IoCContainer> {
    //   const circsIoC = new IoCContainer();
    //   if (ioc) {
    //     ioc.CopyTo(circsIoC);
    //   }
    //   if (!plugins) {
    //     plugins = [];
    //   }
    //   plugins.push(new FathymDFSFileHandlerPlugin());
    //   plugins.push(new FathymEaCServicesPlugin());
    //   plugins.push(new FathymSynapticPlugin());
    //   await configureEaCIoC(circsIoC, this.Export(), plugins);
    //   return circsIoC;
    // }
  };

  return fluentBuilder<TEaC>(eac, handlers) as FluentBuilder<TEaC> &
    SelectFluentMethods<TEaC, TEaC>;
}
