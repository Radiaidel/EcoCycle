import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {  provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { collectRequestReducer } from './core/state/collect-request/collect-request.reducer';
import { CollectRequestEffects } from './core/state/collect-request/collect-request.effects';
import { pointReducer } from './core/state/points/point.reducer';
import { userReducer, UserState } from './core/state/user/user.reducer';
import { UserEffects } from './core/state/user/user.effects';
import { PointEffects } from './core/state/points/point.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore(
      {
        user: userReducer, // Plus besoin de conversion forcée
        collectRequests: collectRequestReducer, // Ajout de collectRequests
        points: pointReducer
      },
    
    ),
    provideEffects([CollectRequestEffects, UserEffects , PointEffects]), // Fusion correcte des effets
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};