import { Injectable } from "@angular/core";
import { HttpService } from "../../core/http/http.service";
import { Observable } from "rxjs";
import { Category, CreateCategoryRequest, DeleteCategoryRequest, UpdateCategoryRequest } from "./models/category.model";
import CategoryAPI from "./api/category.api";

@Injectable({ providedIn: "root"})
export class CategoryService {
  constructor(private httpService: HttpService) {}

  getAll(): Observable<Category[]> {
    return this.httpService.get<Category[]>(CategoryAPI.getAll);
  }

  create(data: CreateCategoryRequest): Observable<Category> {
    return this.httpService.post<Category>(CategoryAPI.create, data);
  }

  update(data: UpdateCategoryRequest): Observable<Category> {
    return this.httpService.put<Category>(CategoryAPI.update, data);
  }

  delete(data: DeleteCategoryRequest): Observable<Category> {
    return this.httpService.delete<Category>(`${CategoryAPI.delete}/${data.id}`)
  }
}