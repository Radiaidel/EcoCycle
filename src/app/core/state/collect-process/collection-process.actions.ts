import { createAction, props } from "@ngrx/store"
import type { CollectionData } from "../../models/collect-process.model"
import { CollectRequest } from "../../models/collect-request";
import { CollectProcess } from "../../models/collect-process.model";


export const loadCollectionProcess = createAction("[Collection Process] Load")
export const nextStep = createAction("[Collection Process] Next Step")
export const previousStep = createAction("[Collection Process] Previous Step")
export const updateMaterialType = createAction(
  "[Collection Process] Update Material Type",
  props<{ materialType: string }>(),
)
export const updateActualWeight = createAction("[Collection Process] Update Actual Weight", props<{ weight: number }>())
export const addPhotos = createAction("[Collection Process] Add Photos", props<{ photos: string[] }>())
export const validateTransaction = createAction("[Collection Process] Validate Transaction")
export const rejectTransaction = createAction("[Collection Process] Reject Transaction")
export const saveToLocalStorage = createAction("[Collection Process] Save To LocalStorage")
export const loadFromLocalStorage = createAction(
  "[Collection Process] Load From LocalStorage",
  props<{ data: CollectionData }>(),
)

export const validateCollectRequest = createAction(
    '[Collect] Validate Request',
    props<{ requestId: string; processDetails: CollectProcess }>()
  );
  
  export const validateCollectRequestSuccess = createAction(
    '[Collect] Validate Request Success',
    props<{ request: CollectRequest }>()
  );
  
  export const validateCollectRequestFailure = createAction(
    '[Collect] Validate Request Failure',
    props<{ error: any }>()
  );
