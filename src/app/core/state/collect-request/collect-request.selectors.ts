import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CollectRequestState } from './collect-request.reducer';

export const selectCollectRequestState = createFeatureSelector<CollectRequestState>('collectRequests');

export const selectCollectRequests = createSelector(
  selectCollectRequestState,
  (state: CollectRequestState) => state?.requests || []  // Ensuring it defaults to an empty array if state is undefined
);
