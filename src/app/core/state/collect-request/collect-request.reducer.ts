import { createReducer, on } from '@ngrx/store';
import { CollectRequest } from '../../models/collect-request';
import { addCollectRequest, loadCollectRequestsSuccess, updateCollectRequest, deleteCollectRequest } from './collect-request.actions';

export interface CollectRequestState {
  requests: CollectRequest[];
}

export const initialState: CollectRequestState = {
  requests: [],
};

export const collectRequestReducer = createReducer(
  initialState,
  on(addCollectRequest, (state, { request }) => ({
    ...state,
    requests: [...state.requests, request],
  })),
  on(loadCollectRequestsSuccess, (state, { requests }) => ({
    ...state,
    requests,
  })),
  on(updateCollectRequest, (state, { request }) => ({
    ...state,
    requests: state.requests.map(req => req.id === request.id ? request : req),
  })),
  on(deleteCollectRequest, (state, { id }) => ({
    ...state,
    requests: state.requests.filter(req => req.id !== id),
  }))
);