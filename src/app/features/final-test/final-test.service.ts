import { Injectable } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import {
  CreateFinalTestRequest,
  FinalTestTableItem,
  GetPaginationFinalTestsRequest,
} from './models/final-test.model';
import { Observable } from 'rxjs';
import { PaginatedList } from '@shared/models/common';
import FinalTestAPI from './api/final-test.api';

@Injectable({ providedIn: 'root' })
export class FinalTestService {
  constructor(private httpService: HttpService) {}

  getPagination(
    filter: GetPaginationFinalTestsRequest
  ): Observable<PaginatedList<FinalTestTableItem>> {
    return this.httpService.get<PaginatedList<FinalTestTableItem>>(
      FinalTestAPI.getPagination,
      filter
    );
  }

  create(data: CreateFinalTestRequest): Observable<number> {
    return this.httpService.post<number>(FinalTestAPI.create, data);
  }
}
