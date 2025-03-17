import { Injectable } from "@angular/core";
import { HttpService } from "@core/http/http.service";
import { Observable } from "rxjs";
import TestConfigurationAPI from "./api/test-configuration.api";
import { CreateTestTypeRequest, GetTestTypeDetailsRequest, TestTypeDetail, UpdateTestTypeRequest } from "./models/test-configuration";

@Injectable({ providedIn: "root" })
export class TestConfigurationService {
  constructor(private httpService: HttpService) {}

  create(data: CreateTestTypeRequest): Observable<TestTypeDetail> {
    return this.httpService.post<TestTypeDetail>(TestConfigurationAPI.create, data);
  }
  getDetail(filter: GetTestTypeDetailsRequest): Observable<TestTypeDetail> {
    return this.httpService.get<TestTypeDetail>(TestConfigurationAPI.getDetail(filter));
  }
  update(data: UpdateTestTypeRequest): Observable<TestTypeDetail> {
    return this.httpService.put<TestTypeDetail>(TestConfigurationAPI.update, data);
  }
}