import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CollectionEffects } from '@features/collection/store/collection.effect';
import collectionReducer from '@features/collection/store/collection.reducer';
import { FinalTestEffects } from '@features/final-test/store/final-test.effect';
import finalTestReducer from '@features/final-test/store/final-test.reducer';
import { TestEffects } from '@features/test/store/test.effect';
import testReducer from '@features/test/store/test.reducer';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { routes } from './app.routes';
import { HttpAuthInterceptor } from './core/interceptors/http-auth.interceptor';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { resetOnLogout } from './core/store/auth.meta-reducer';
import { AuthEffects } from './features/auth/store/auth.effect';
import authReducer from './features/auth/store/auth.reducer';
import { CategoryEffects } from './features/category/store/category.effect';
import categoryReducer from './features/category/store/category.reducer';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    provideStore(
      {
        auth: authReducer,
        category: categoryReducer,
        collection: collectionReducer,
        finalTest: finalTestReducer,
        test: testReducer
      },
      { metaReducers: [resetOnLogout] }
    ),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects([
      AuthEffects,
      CategoryEffects,
      CollectionEffects,
      FinalTestEffects,
      TestEffects
    ]),
  ],
};
