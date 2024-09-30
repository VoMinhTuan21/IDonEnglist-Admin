import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { PageLayoutService } from '../../services/page-layout.service';
import { PageLayout } from '../../../shared/models/enum';

/**
 * Resolver sets the page layout type,
 * ensuring that the layout is available before navigating to the component.
**/
export const setLayout = (inputLayout: PageLayout): ResolveFn<void> => {
  return (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
    inject(PageLayoutService).setLayout(inputLayout)
  };
}