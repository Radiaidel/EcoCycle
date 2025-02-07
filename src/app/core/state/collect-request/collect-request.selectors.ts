import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CollectRequestState } from "./collect-request.reducer";
import { CollectRequest } from "../../models/collect-request";

export const selectCollectRequestState = createFeatureSelector<CollectRequestState>("collectRequests");

export const selectAllCollectRequests = createSelector(selectCollectRequestState, (state) => state.requests);

export const selectCollectRequestsLoading = createSelector(selectCollectRequestState, (state) => state.loading);

export const selectCollectRequestsError = createSelector(selectCollectRequestState, (state) => state.error);

export const selectSearchKeyword = createSelector(selectCollectRequestState, (state) => state.searchKeyword);

export const selectFilteredCollectRequests = createSelector(
  selectAllCollectRequests,
  selectSearchKeyword,
  (requests, keyword) => {
    if (!keyword) return requests;
    return requests.filter((request) =>
      request.wasteType.some((type) => type.toLowerCase().includes(keyword.toLowerCase()))
    );
  }
);

export const selectCollectRequestById = (requestId: string) =>
  createSelector(selectAllCollectRequests, (requests: CollectRequest[]) => {
    return requests.find((request) => request.id === requestId) || null;
  });