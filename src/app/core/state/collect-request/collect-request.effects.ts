import { Injectable } from "@angular/core"
import {  Actions, createEffect, ofType } from "@ngrx/effects"
import { of } from "rxjs"
import { catchError, map, mergeMap, withLatestFrom } from "rxjs/operators"
import * as CollectRequestActions from "./collect-request.actions"
import  { CollectRequestService } from "../../services/collect-request.service"
import  { Store } from "@ngrx/store"
import { selectAllCollectRequests } from "./collect-request.selectors"


@Injectable()
export class CollectRequestEffects {
  loadCollectRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectRequestActions.loadCollectRequests),
      mergeMap(() =>
        this.collectRequestService.getAllRequests().pipe(
          map((requests) => CollectRequestActions.loadCollectRequestsSuccess({ requests })),
          catchError((error) => of(CollectRequestActions.loadCollectRequestsFailure({ error }))),
        ),
      ),
    ),
  )

  addCollectRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectRequestActions.addCollectRequest),
      mergeMap(({ request }) =>
        this.collectRequestService.addRequest(request).pipe(
          map((newRequest) => CollectRequestActions.addCollectRequestSuccess({ request: newRequest })),
          catchError((error) => of(CollectRequestActions.addCollectRequestFailure({ error }))),
        ),
      ),
    ),
  )

  updateCollectRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectRequestActions.updateCollectRequest),
      mergeMap(({ request }) =>
        this.collectRequestService.updateRequest(request).pipe(
          map((updatedRequest) => CollectRequestActions.updateCollectRequestSuccess({ request: updatedRequest })),
          catchError((error) => of(CollectRequestActions.updateCollectRequestFailure({ error }))),
        ),
      ),
    ),
  )

  deleteCollectRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectRequestActions.deleteCollectRequest),
      mergeMap(({ id }) =>
        this.collectRequestService.deleteRequest(id).pipe(
          map(() => CollectRequestActions.deleteCollectRequestSuccess({ id })),
          catchError((error) => of(CollectRequestActions.deleteCollectRequestFailure({ error }))),
        ),
      ),
    ),
  )

  constructor(
    private actions$: Actions,
    private collectRequestService: CollectRequestService,
    private store: Store,
  ) {}
}

