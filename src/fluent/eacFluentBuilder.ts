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
  eac?: IsFluentBuildable<TEaC>,
  handlers?: FluentBuilderHandlers
): FluentBuilder<TEaC> & SelectFluentMethods<TEaC, TEaC> {
  handlers = {
    ...handlers,
  };

  return fluentBuilder<TEaC>(eac, handlers) as FluentBuilder<TEaC> &
    SelectFluentMethods<TEaC, TEaC>;
}
