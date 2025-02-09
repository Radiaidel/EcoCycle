import { createAction, props } from '@ngrx/store';

export const updatePoints = createAction(
  '[Points] Update Points',
  props<{ userEmail: string; points: number }>()
);

export const updatePointsSuccess = createAction(
  '[Points] Update Points Success',
  props<{ userEmail: string; totalPoints: number }>()
);

export const updatePointsFailure = createAction(
  '[Points] Update Points Failure',
  props<{ error: string }>()
);

export const convertPoints = createAction(
  '[Points] Convert Points',
  props<{ userEmail: string; points: number }>()
);

export const convertPointsSuccess = createAction(
  '[Points] Convert Points Success',
  props<{ userEmail: string; remainingPoints: number; voucher: string }>()
);

export const convertPointsFailure = createAction(
  '[Points] Convert Points Failure',
  props<{ error: string }>()
);

// point.actions.ts
export const loadVouchersSuccess = createAction(
    '[Points] Load Vouchers Success',
    props<{ vouchers: { [key: string]: number } }>()
  );
