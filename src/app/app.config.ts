import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { collectRequestReducer } from './core/state/collect-request/collect-request.reducer';
import { CollectRequestEffects } from './core/state/collect-request/collect-request.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideStore({ collectRequests: collectRequestReducer }), 
    provideEffects([CollectRequestEffects]), 
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};
