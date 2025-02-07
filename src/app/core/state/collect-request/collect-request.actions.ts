import { createAction, props } from '@ngrx/store';
import { CollectRequest } from '../../models/collect-request';

export const addCollectRequest = createAction(
  '[CollectRequest] Add Collect Request',
  props<{ request: CollectRequest }>()
);

export const loadCollectRequests = createAction(
  '[CollectRequest] Load Collect Requests',
  props<{ userEmail: string }>()
);

export const loadCollectRequestsSuccess = createAction(
  '[CollectRequest] Load Collect Requests Success',
  props<{ requests: CollectRequest[] }>()
);

export const updateCollectRequest = createAction(
  '[CollectRequest] Update Collect Request',
  props<{ request: CollectRequest }>()
);

export const deleteCollectRequest = createAction(
  '[CollectRequest] Delete Collect Request',
  props<{ id: string }>()
);