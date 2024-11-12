import { Injectable } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import {
  CollectionMin,
  CollectionTableItem,
  CreateCollectionRequest,
  GetPaginationCollectionRequest,
  UpdateCollectionRequest,
} from './models/collection.model';
import { Observable } from 'rxjs';
import { PaginatedList } from '@shared/models/common';
import CollectionAPI from './api/collection.api';

@Injectable({ providedIn: 'root' })
export class CollectionService {
  constructor(private httpService: HttpService) {}

  getPagination(
    filter: GetPaginationCollectionRequest
  ): Observable<PaginatedList<CollectionTableItem | CollectionMin>> {
    return this.httpService.get<PaginatedList<CollectionTableItem>>(
      CollectionAPI.getPagination,
      filter
    );
  }

  create(data: CreateCollectionRequest): Observable<CollectionTableItem> {
    return this.httpService.post<CollectionTableItem>(
      CollectionAPI.create,
      data
    );
  }

  update(data: UpdateCollectionRequest): Observable<number> {
    return this.httpService.put<number>(CollectionAPI.update, data);
  }

  delete(id: number): Observable<number> {
    return this.httpService.delete<number>(`${CollectionAPI.delete}/${id}`)
  }
}
