import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import authReducer from './features/auth/store/auth.reducer';
import { AuthEffects } from './features/auth/store/auth.effect';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { HttpAuthInterceptor } from './core/interceptors/http-auth.interceptor';
import { CategoryEffects } from './features/category/store/category.effect';
import categoryReducer from './features/category/store/category.reducer';
import { resetOnLogout } from './core/store/auth.meta-reducer';
import { TestConfigurationEffects } from '@features/test-configuration/store/test-configuration.effect';
import testConfigurationReducer from '@features/test-configuration/store/test-configuration.reducer';
import { CollectionEffects } from '@features/collection/store/collection.effect';
import collectionReducer from '@features/collection/store/collection.reducer';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true },
    provideStore(
      {
        auth: authReducer,
        category: categoryReducer,
        testConfiguration: testConfigurationReducer,
        collection: collectionReducer,
      },
      { metaReducers: [resetOnLogout] }
    ),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects([
      AuthEffects,
      CategoryEffects,
      TestConfigurationEffects,
      CollectionEffects,
    ]),
  ],
};
