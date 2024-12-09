import { Injectable } from "@angular/core";
import { HttpService } from "@core/http/http.service";
import { Observable } from "rxjs";
import TestPartAPI from "./api/test-part.api";
import { GetListTestPartsRequest, TestPart } from "./models/test-part.model";

@Injectable({ providedIn: "root" })
export class TestPartService {
  constructor(private readonly httpService: HttpService) {}

  getList(filter: GetListTestPartsRequest): Observable<Array<TestPart>> {
    return this.httpService.get<Array<TestPart>>(TestPartAPI.getList, filter);
  }
}