import { Injectable } from "@angular/core";
import { HttpService } from "@core/http/http.service";
import { CreateTestRequest, TestMinViewModel } from "./models/test.model";
import TestAPI from "./api/test.api";

@Injectable({ providedIn: "root" })
export class TestService {
  constructor(private httpService: HttpService) {}

  create(data: CreateTestRequest) {
    return this.httpService.post<TestMinViewModel> (
      TestAPI.create,
      data
    );
  }
}