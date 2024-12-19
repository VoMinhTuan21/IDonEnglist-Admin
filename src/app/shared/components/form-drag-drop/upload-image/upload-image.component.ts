import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ImageUploadFormValue } from '@shared/models/common';
import { UploadImageUrl } from '@shared/models/constants';
import { Utils } from '@shared/utils/utils';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  NzUploadChangeParam,
  NzUploadFile,
  NzUploadModule,
} from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [NzUploadModule, NzIconModule],
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadImageComponent),
      multi: true,
    },
  ],
})
export class UploadImageComponent implements ControlValueAccessor, OnInit {
  uploadUrl = UploadImageUrl;
  fileList: NzUploadFile[] = [];

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private messageService: NzMessageService) {}

  writeValue(value: ImageUploadFormValue): void {
    if (!value) {
      return;
    }

    this.fileList = [{
      name: 'image.jpg',
      uid: '-1',
      status: 'done',
      url: value.url
    }]
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  ngOnInit(): void {}

  beforeUpload(
    file: NzUploadFile,
    _fileList: NzUploadFile[]
  ): Observable<boolean> {
    return Utils.beforeImageUpload(this.messageService, file, _fileList);
  }

  handlePreview(file: NzUploadFile) {
    window.open(file.response?.secureUrl ?? file.url);
  }

  handleRemove(file: NzUploadFile): boolean {
    return true;
  }

  handleFileListChange(info: NzUploadChangeParam) {
    if (info.file.status === 'done') {
      this.onChange({
        publicId: info.file.response?.publicId,
        url: info.file.response?.secureUrl,
      });
    } else {
      this.onChange(undefined);
    }
  }
}
