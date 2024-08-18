import { EaCVertexDetails } from "../../eac/EaCVertexDetails.ts";

export type EaCDeviceDetails = {
  IsIoTEdge: boolean;
} & EaCVertexDetails;
