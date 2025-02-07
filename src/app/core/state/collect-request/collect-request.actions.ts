import { createAction, props } from "@ngrx/store"
import type { CollectRequest } from "../../models/collect-request"

export const loadCollectRequests = createAction("[Collect Request] Load Collect Requests")
export const loadCollectRequestsSuccess = createAction(
  "[Collect Request] Load Collect Requests Success",
  props<{ requests: CollectRequest[] }>(),
)
export const loadCollectRequestsFailure = createAction(
  "[Collect Request] Load Collect Requests Failure",
  props<{ error: any }>(),
)

export const addCollectRequest = createAction(
  "[Collect Request] Add Collect Request",
  props<{ request: CollectRequest }>(),
)
export const addCollectRequestSuccess = createAction(
  "[Collect Request] Add Collect Request Success",
  props<{ request: CollectRequest }>(),
)
export const addCollectRequestFailure = createAction(
  "[Collect Request] Add Collect Request Failure",
  props<{ error: any }>(),
)

export const updateCollectRequest = createAction(
  "[Collect Request] Update Collect Request",
  props<{ request: CollectRequest }>(),
)
export const updateCollectRequestSuccess = createAction(
  "[Collect Request] Update Collect Request Success",
  props<{ request: CollectRequest }>(),
)
export const updateCollectRequestFailure = createAction(
  "[Collect Request] Update Collect Request Failure",
  props<{ error: any }>(),
)

export const deleteCollectRequest = createAction("[Collect Request] Delete Collect Request", props<{ id: string }>())
export const deleteCollectRequestSuccess = createAction(
  "[Collect Request] Delete Collect Request Success",
  props<{ id: string }>(),
)
export const deleteCollectRequestFailure = createAction(
  "[Collect Request] Delete Collect Request Failure",
  props<{ error: any }>(),
)

export const setSearchKeyword = createAction("[Collect Request] Set Search Keyword", props<{ keyword: string }>())

export const validateTotalWeight = createAction(
  "[Collect Request] Validate Total Weight",
  props<{ request: CollectRequest }>(),
)

export const validateTotalWeightSuccess = createAction("[Collect Request] Validate Total Weight Success")

export const validateTotalWeightFailure = createAction(
  "[Collect Request] Validate Total Weight Failure",
  props<{ error: string }>(),
)

