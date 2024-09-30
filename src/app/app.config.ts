import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import authReducer from './features/auth/store/auth.reducer';
import { AuthEffects } from './features/auth/store/auth.effect';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true},
    provideStore({auth: authReducer}),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects([AuthEffects])
],
};
