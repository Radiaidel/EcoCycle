import { createSelector } from "@ngrx/store";

export const selectVoucherByEmail = (email: string) => createSelector(
    (state: any) => state.points.vouchers,
    (vouchers) => vouchers[email]?.toString() || ''
  );