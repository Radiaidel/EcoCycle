import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CollectRequestService } from '../../services/collect-request.service';
import { loadCollectRequests, loadCollectRequestsSuccess, addCollectRequest, updateCollectRequest, deleteCollectRequest } from './collect-request.actions';

@Injectable()
export class CollectRequestEffects {
  constructor(
    private actions$: Actions,
    private collectRequestService: CollectRequestService
  ) {}

  loadCollectRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCollectRequests),
      mergeMap(({ userEmail }) =>
        this.collectRequestService.getRequestsByUserEmail(userEmail).pipe(
          map(requests => loadCollectRequestsSuccess({ requests })),
          catchError(() => of({ type: '[CollectRequest] Load Collect Requests Failure' }))
        )
      )
    )
  );

  addCollectRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCollectRequest),
      mergeMap(({ request }) =>
        this.collectRequestService.addRequest(request).pipe(
          map(() => loadCollectRequests({ userEmail: request.userEmail })),
          catchError(() => of({ type: '[CollectRequest] Add Collect Request Failure' }))
        )
      )
    )
  );

  updateCollectRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCollectRequest),
      mergeMap(({ request }) =>
        this.collectRequestService.updateRequest(request).pipe(
          map(() => loadCollectRequests({ userEmail: request.userEmail })),
          catchError(() => of({ type: '[CollectRequest] Update Collect Request Failure' }))
        )
      )
    )
  );

  deleteCollectRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCollectRequest),
      mergeMap(({ id }) =>
        this.collectRequestService.deleteRequest(id).pipe(
          map(() => loadCollectRequests({ userEmail: this.collectRequestService.getRequestById(id)?.userEmail || '' })),
          catchError(() => of({ type: '[CollectRequest] Delete Collect Request Failure' }))
        )
      )
    )
  );
}