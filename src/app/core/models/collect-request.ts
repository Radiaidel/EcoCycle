import { CollectProcess } from "./collect-process.model";

export interface CollectRequest {
  id: string;
  userEmail: string;
  wasteType: string[];
  photos?: string[];
  estimatedWeight: number;
  address: string;
  preferredDate: Date;
  preferredTime: string;
  notes?: string;
  status: string;
  processDetails?: CollectProcess;
}