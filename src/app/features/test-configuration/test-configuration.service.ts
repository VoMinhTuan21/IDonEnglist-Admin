import { Injectable } from "@angular/core";
import { HttpService } from "@core/http/http.service";
import { CreateTestTypeRequest, ITestTypeTableItem, TestTypeDetail, UpdateTestTypeRequest } from "./models/test-configuration";
import { Observable } from "rxjs";
import TestConfigurationAPI from "./api/test-configuration.api";
import { PaginatedList, PaginationRequest } from "@shared/models/common";

@Injectable({ providedIn: "root" })
export class TestConfigurationService {
  constructor(private httpService: HttpService) {}

  create(data: CreateTestTypeRequest): Observable<ITestTypeTableItem> {
    return this.httpService.post<ITestTypeTableItem>(TestConfigurationAPI.create, data);
  }
  getPagination(filter: PaginationRequest): Observable<PaginatedList<ITestTypeTableItem>> {
    return this.httpService.get<PaginatedList<ITestTypeTableItem>>(TestConfigurationAPI.getPagination, filter)
  }
  getDetail(id: number): Observable<TestTypeDetail> {
    return this.httpService.get<TestTypeDetail>(`${TestConfigurationAPI.getDetail}/${id}`);
  }
  update(data: UpdateTestTypeRequest): Observable<ITestTypeTableItem> {
    return this.httpService.put<ITestTypeTableItem>(TestConfigurationAPI.update, data);
  }
}