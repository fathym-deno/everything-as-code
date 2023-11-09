import { EaCDetails } from '../../../EaCDetails.ts';
import { EaCCloudResourceDetails } from './EaCCloudResourceDetails.ts';

export type EaCCloudResourceAsCode = {
  Resources?: { [key: string]: EaCCloudResourceAsCode };
} & EaCDetails<EaCCloudResourceDetails>;
