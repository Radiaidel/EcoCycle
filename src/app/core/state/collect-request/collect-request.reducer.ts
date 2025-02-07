import { createReducer, on } from "@ngrx/store"
import type { CollectRequest } from "../../models/collect-request"
import * as CollectRequestActions from "./collect-request.actions"

export interface CollectRequestState {
  requests: CollectRequest[]
  loading: boolean
  error: any
  searchKeyword: string
}

export const initialState: CollectRequestState = {
  requests: [],
  loading: false,
  error: null,
  searchKeyword: "",
}

export const collectRequestReducer = createReducer(
  initialState,
  on(CollectRequestActions.loadCollectRequests, (state) => ({ ...state, loading: true })),
  on(CollectRequestActions.loadCollectRequestsSuccess, (state, { requests }) => ({
    ...state,
    requests,
    loading: false,
  })),
  on(CollectRequestActions.loadCollectRequestsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(CollectRequestActions.addCollectRequestSuccess, (state, { request }) => ({
    ...state,
    requests: [...state.requests, request],
  })),
  on(CollectRequestActions.updateCollectRequestSuccess, (state, { request }) => ({
    ...state,
    requests: state.requests.map((r) => (r.id === request.id ? request : r)),
  })),
  on(CollectRequestActions.deleteCollectRequestSuccess, (state, { id }) => ({
    ...state,
    requests: state.requests.filter((r) => r.id !== id),
  })),
  on(CollectRequestActions.setSearchKeyword, (state, { keyword }) => ({
    ...state,
    searchKeyword: keyword,
  })),
  on(CollectRequestActions.validateTotalWeightFailure, (state, { error }) => ({
    ...state,
    error,
  })),
)

