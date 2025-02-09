import { createReducer, on } from '@ngrx/store';
import * as PointActions from './point.actions';

export interface PointState {
  userPoints: { [key: string]: number };
  vouchers: { [key: string]: number }; 
  error: string | null;
  loading: boolean;
}

export const initialState: PointState = {
  userPoints: {},
    vouchers: {},
  error: null,
  loading: false
};

export const pointReducer = createReducer(
  initialState,
  on(PointActions.updatePoints, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(PointActions.updatePointsSuccess, (state, { userEmail, totalPoints }) => ({
    ...state,
    userPoints: {
      ...state.userPoints,
      [userEmail]: totalPoints
    },
    loading: false
  })),
  on(PointActions.updatePointsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
//   on(PointActions.convertPointsSuccess, (state, { userEmail, remainingPoints }) => ({
//     ...state,
//     userPoints: {
//       ...state.userPoints,
//       [userEmail]: remainingPoints
//     }
//   })),
//   on(PointActions.convertPointsSuccess, (state, { userEmail, remainingPoints, voucher }) => ({
//     ...state,
//     userPoints: {
//       ...state.userPoints,
//       [userEmail]: remainingPoints
//     },
//     vouchers: {
//       ...state.vouchers,
//       [userEmail]: parseInt(voucher)
//     }
//   }))

  on(PointActions.loadVouchersSuccess, (state, { vouchers }) => ({
    ...state,
    vouchers
  })),
  on(PointActions.convertPointsSuccess, (state, { userEmail, remainingPoints, voucher }) => ({
    ...state,
    userPoints: {
      ...state.userPoints,
      [userEmail]: remainingPoints
    },
    vouchers: {
      ...state.vouchers,
      [userEmail]: parseInt(voucher)
    }
  }))
);