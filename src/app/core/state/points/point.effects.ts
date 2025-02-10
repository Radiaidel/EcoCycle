import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as PointActions from './point.actions';
import { UserService } from '../../services/user.service';

@Injectable()
export class PointEffects {
    private POINTS_KEY = 'user_points';
    private VOUCHERS_KEY = 'user_vouchers';


    updatePoints$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PointActions.updatePoints),
            mergeMap(({ userEmail, points }) => {
                try {
                    console.log("Effect updatePoints démarré", { userEmail, points });

                    const storedPoints = localStorage.getItem(this.POINTS_KEY);
                    let pointsData: { [key: string]: number } = storedPoints ? JSON.parse(storedPoints) : {};
                    const totalPoints = (pointsData[userEmail] || 0) + points;
                    pointsData[userEmail] = totalPoints;
                    localStorage.setItem(this.POINTS_KEY, JSON.stringify(pointsData));

                    return this.userService.updateUser({
                        email: userEmail,
                        points: totalPoints
                    }).pipe(
                        map(() => PointActions.updatePointsSuccess({ userEmail, totalPoints })),
                        catchError(error => of(PointActions.updatePointsFailure({
                            error: 'Erreur lors de la mise à jour des points'
                        })))
                    );
                } catch (error) {
                    return of(PointActions.updatePointsFailure({
                        error: 'Erreur lors de la mise à jour des points'
                    }));
                }
            })
        )
    );
    convertPoints$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PointActions.convertPoints),
            mergeMap(({ userEmail, points }) => {
                try {
                    // Gestion des points
                    const storedPoints = localStorage.getItem(this.POINTS_KEY);
                    if (!storedPoints) {
                        return of(PointActions.convertPointsFailure({ error: 'Aucun point trouvé' }));
                    }
    
                    let pointsData = JSON.parse(storedPoints);
                    if (!pointsData[userEmail] || pointsData[userEmail] < points) {
                        return of(PointActions.convertPointsFailure({ error: 'Points insuffisants' }));
                    }
    
                    // Calcul du voucher
                    let voucher = '';
                    if (points === 500) voucher = '350';
                    else if (points === 200) voucher = '120';
                    else if (points === 100) voucher = '50';
    
                    if (!voucher) {
                        return of(PointActions.convertPointsFailure({ error: 'Montant invalide' }));
                    }
    
                    // Mise à jour des points
                    const remainingPoints = pointsData[userEmail] - points;
                    pointsData[userEmail] = remainingPoints;
                    localStorage.setItem(this.POINTS_KEY, JSON.stringify(pointsData));
    
                    // Gestion des vouchers - Additionner au lieu de remplacer
                    const storedVouchers = localStorage.getItem(this.VOUCHERS_KEY);
                    let vouchersData = storedVouchers ? JSON.parse(storedVouchers) : {};
                    
                    // Additionner le nouveau voucher à l'existant
                    vouchersData[userEmail] = (vouchersData[userEmail] || 0) + parseInt(voucher);
                    
                    localStorage.setItem(this.VOUCHERS_KEY, JSON.stringify(vouchersData));
    
                    return this.userService.updateUser({
                        email: userEmail,
                        points: remainingPoints
                    }).pipe(
                        map(() => PointActions.convertPointsSuccess({
                            userEmail,
                            remainingPoints,
                            voucher: vouchersData[userEmail].toString() // Retourner le total des vouchers
                        })),
                        catchError(error => of(PointActions.convertPointsFailure({
                            error: 'Erreur lors de la conversion'
                        })))
                    );
    
                } catch (error) {
                    return of(PointActions.convertPointsFailure({ error: 'Erreur lors de la conversion' }));
                }
            })
        )
    );
    // convertPoints$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(PointActions.convertPoints),
    //         mergeMap(({ userEmail, points }) => {
    //             try {
    //                 const storedPoints = localStorage.getItem(this.POINTS_KEY);
    //                 if (!storedPoints) {
    //                     return of(PointActions.convertPointsFailure({ error: 'Aucun point trouvé' }));
    //                 }

    //                 let pointsData = JSON.parse(storedPoints);
    //                 if (!pointsData[userEmail] || pointsData[userEmail] < points) {
    //                     return of(PointActions.convertPointsFailure({ error: 'Points insuffisants' }));
    //                 }

    //                 let voucher = '';
    //                 if (points === 500) voucher = '350';
    //                 else if (points === 200) voucher = '120';
    //                 else if (points === 100) voucher = '50';

    //                 if (!voucher) {
    //                     return of(PointActions.convertPointsFailure({ error: 'Montant invalide' }));
    //                 }

    //                 const remainingPoints = pointsData[userEmail] - points;
    //                 pointsData[userEmail] = remainingPoints;
    //                 localStorage.setItem(this.POINTS_KEY, JSON.stringify(pointsData));

    //                 return this.userService.updateUser({
    //                     email: userEmail, points: remainingPoints
    //                 }).pipe(
    //                     map(() => PointActions.convertPointsSuccess({
    //                         userEmail,
    //                         remainingPoints,
    //                         voucher
    //                     })),
    //                     catchError(error => of(PointActions.convertPointsFailure({
    //                         error: 'Erreur lors de la conversion'
    //                     })))
    //                 );
    //             } catch (error) {
    //                 return of(PointActions.convertPointsFailure({ error: 'Erreur lors de la conversion' }));
    //             }
    //         })
    //     )
    // );
    // convertPoints$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(PointActions.convertPoints),
    //         mergeMap(({ userEmail, points }) => {
    //             try {
    //                 // Gestion des points
    //                 const storedPoints = localStorage.getItem(this.POINTS_KEY);
    //                 if (!storedPoints) {
    //                     return of(PointActions.convertPointsFailure({ error: 'Aucun point trouvé' }));
    //                 }

    //                 let pointsData = JSON.parse(storedPoints);
    //                 if (!pointsData[userEmail] || pointsData[userEmail] < points) {
    //                     return of(PointActions.convertPointsFailure({ error: 'Points insuffisants' }));
    //                 }

    //                 // Calcul du voucher
    //                 let voucher = '';
    //                 if (points === 500) voucher = '350';
    //                 else if (points === 200) voucher = '120';
    //                 else if (points === 100) voucher = '50';

    //                 if (!voucher) {
    //                     return of(PointActions.convertPointsFailure({ error: 'Montant invalide' }));
    //                 }

    //                 // Mise à jour des points
    //                 const remainingPoints = pointsData[userEmail] - points;
    //                 pointsData[userEmail] = remainingPoints;
    //                 localStorage.setItem(this.POINTS_KEY, JSON.stringify(pointsData));

    //                 // Sauvegarde du voucher
    //                 const storedVouchers = localStorage.getItem(this.VOUCHERS_KEY);
    //                 let vouchersData = storedVouchers ? JSON.parse(storedVouchers) : {};
    //                 vouchersData[userEmail] = parseInt(voucher);
    //                 localStorage.setItem(this.VOUCHERS_KEY, JSON.stringify(vouchersData));

    //                 return this.userService.updateUser({
    //                     email: userEmail,
    //                     points: remainingPoints
    //                 }).pipe(
    //                     map(() => PointActions.convertPointsSuccess({
    //                         userEmail,
    //                         remainingPoints,
    //                         voucher
    //                     })),
    //                     catchError(error => of(PointActions.convertPointsFailure({
    //                         error: 'Erreur lors de la conversion'
    //                     })))
    //                 );
    //             } catch (error) {
    //                 return of(PointActions.convertPointsFailure({ error: 'Erreur lors de la conversion' }));
    //             }
    //         })
    //     )
    // );

    // Nouvel effet pour charger les vouchers au démarrage
    loadVouchers$ = createEffect(() =>
        this.actions$.pipe(
            ofType('@ngrx/effects/init'),
            map(() => {
                const storedVouchers = localStorage.getItem(this.VOUCHERS_KEY);
                const vouchersData = storedVouchers ? JSON.parse(storedVouchers) : {};
                return PointActions.loadVouchersSuccess({ vouchers: vouchersData });
            })
        )
    );
    constructor(
        private actions$: Actions,
        private userService: UserService
    ) { }
}