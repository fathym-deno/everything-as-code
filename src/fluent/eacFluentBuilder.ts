import {
  EverythingAsCode,
  fluentBuilder,
  FluentBuilder,
  FluentBuilderMethodsHandlers,
  FluentBuilderRoot,
  SelectFluentMethods,
} from './.deps.ts';
import { EverythingAsCodeTags } from './EverythingAsCodeTags.ts';

export function eacFluentBuilder<TEaC extends EverythingAsCode>(
  model?: TEaC,
  handlers?: FluentBuilderMethodsHandlers
): FluentBuilder<TEaC> &
  SelectFluentMethods<FluentBuilderRoot<EverythingAsCodeTags<TEaC>>, TEaC> {
  return fluentBuilder<EverythingAsCodeTags<TEaC>>(model, handlers);
}
