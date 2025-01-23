import { Injectable } from "@angular/core";
import { HttpService } from "@core/http/http.service";
import { FileUpload } from "@shared/models/common";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class FileService {
  constructor(private httpService: HttpService) {}

  updateImage(data: FormData): Observable<FileUpload> {
    return this.httpService.post<FileUpload>("file/image", data);
  }

  updateAudio(data: FormData): Observable<FileUpload> {
    return this.httpService.post<FileUpload>("file/audio", data);
  }
}