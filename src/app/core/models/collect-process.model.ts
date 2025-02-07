export interface WasteDetail {
    type: string;
    realWeight: number;
  }
  
  export interface CollectProcess {
    requestId: string;
    wasteDetails: WasteDetail[];
    totalRealWeight: number;
    processPhotos?: string[];
    validationDate: string;
    collectorNotes?: string;
  }

  export interface CollectionData {
    wasteType: string[]
    actualWeight: number
    photos: string[]
    status: string
  }