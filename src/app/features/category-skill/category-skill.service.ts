import { Injectable } from "@angular/core";
import { HttpService } from "@core/http/http.service";
import { Observable } from "rxjs";
import CategorySkillAPI from "./api/category-skill.api";
import { CategorySkillMin, GetListCategorySkillRequest } from "./models/category-skill.model";

@Injectable({providedIn: 'root'})
export class CategorySkillService {
  constructor(private httpService: HttpService) {}

  getList(params: GetListCategorySkillRequest): Observable<Array<CategorySkillMin>> {
    return this.httpService.get(CategorySkillAPI.getList, params);
  }
}