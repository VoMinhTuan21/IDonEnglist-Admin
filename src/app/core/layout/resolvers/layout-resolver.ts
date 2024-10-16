import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { PageLayoutService } from '@core/services/page-layout.service';
import { PageLayout } from '@shared/models/enum';
import { of } from 'rxjs';

export const setLayout = (inputLayout: PageLayout): ResolveFn<void> => {
  return (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
    const pageLayoutService = inject(PageLayoutService);
    pageLayoutService.setLayout(inputLayout);
    return of(undefined);
  };
};