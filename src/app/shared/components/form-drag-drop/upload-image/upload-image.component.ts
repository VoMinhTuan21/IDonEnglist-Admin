import { Component, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { ImageUploadFormValue } from '@shared/models/common';
import { UploadImageUrl } from '@shared/models/constants';
import { Utils } from '@shared/utils/utils';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
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
  imports: [NzUploadModule, NzIconModule, NzFormModule, NzFlexModule],
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadImageComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UploadImageComponent),
      multi: true,
    },
  ],
})
export class UploadImageComponent implements ControlValueAccessor, Validator {
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  uploadUrl = UploadImageUrl;
  fileList: NzUploadFile[] = [];
  shouldValidate = false;

  constructor(private messageService: NzMessageService) {}

  writeValue(value: ImageUploadFormValue): void {
    if (!value) {
      this.shouldValidate = true;
      return;
    }

    this.fileList = [{
      name: 'image.jpg',
      uid: '-1',
      status: 'done',
      url: value.url
    }];
    this.shouldValidate = false;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.fileList.some(file => file.status = 'done')) {
      this.shouldValidate = false;
      return null;
    }
    
    this.shouldValidate = true;
    return { required: true };
  }

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
      this.shouldValidate = false;
    } else {
      this.onChange(undefined);
      this.shouldValidate = true;
    }
  }
}
