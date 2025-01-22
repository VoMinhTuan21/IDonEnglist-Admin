import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import Quill, { Delta } from 'quill';
import EditableInlineBox from './editable-inline-box';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  bootstrapInputCursorText,
  bootstrapTable,
} from '@ng-icons/bootstrap-icons';
// @ts-ignore
import QuillBetterTable from 'quill-better-table';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { FillInBlankTextEditorOutput } from '@shared/models/common';
import { debounceTime, Subject } from 'rxjs';
import { Utils } from '@shared/utils/utils';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-quill-editor',
  imports: [NgIcon, NzDividerModule],
  templateUrl: './quill-editor.component.html',
  styleUrl: './quill-editor.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    provideIcons({ bootstrapInputCursorText, bootstrapTable }),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuillEditorComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => QuillEditorComponent),
      multi: true,
    },
  ],
})
export class QuillEditorComponent
  implements ControlValueAccessor, OnDestroy, Validator
{
  @Input() hasBlankBox = false;

  private quill!: Quill;
  private toolbar: any;
  private deltaSubject = new Subject();
  private onChange: (value: FillInBlankTextEditorOutput | string) => void = () => {};
  private onTouched: () => void = () => {};

  @ViewChild('editableBoxMenu', { static: true })
  editableBoxMenu!: ElementRef<HTMLButtonElement>;
  @ViewChild('tableMenu', { static: true })
  tableMenu!: ElementRef<HTMLButtonElement>;
  @ViewChild('editorContent', { static: true })
  editorContent!: ElementRef<HTMLDivElement>;

  inValid = false;

  ngOnInit() {
    this.initQuill();
    this.initToolbar();

    this.deltaSubject.pipe(debounceTime(1000)).subscribe(() => {
      const htmlContent = this.quill.getSemanticHTML();
      this.broadcastValueChange(htmlContent);
    });
  }

  ngOnDestroy(): void {
    this.quill?.off('text-change', this.onTextChange);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (control.untouched) {
      return null;
    }

    let errors: {
      fillInBlank?: boolean;
      insertBlank?: boolean;
      fillEditor?: boolean;
    } = {};

    const text = this.quill.getText();
    // trim text if wanted + handle special case that an empty editor contains a new line
    const textLength = text.trim().length;
    const deltaOperations = this.quill.getContents().ops;
    const onlyEmptyOperation =
      !!deltaOperations &&
      deltaOperations.length === 1 &&
      ['\n', ''].includes(deltaOperations[0].insert?.toString() ?? '');

    if (!textLength && onlyEmptyOperation) {
      errors = {
        fillEditor: true,
      };
      this.inValid = true;
      return errors;
    }

    if (this.hasBlankBox) {
      const editableBoxes = Array.from(
        document.getElementsByClassName('editable-inline-box')
      ) as HTMLSpanElement[];

      if (editableBoxes.length === 0) {
        errors = { insertBlank: true };
        this.inValid = true;
        return errors;
      }

      let isAllBoxesHaveValues = true;

      for (const box of editableBoxes) {
        if (
          Array.from(box.childNodes).some(
            (node) => node.nodeType === Node.TEXT_NODE
          )
        ) {
          box.classList.remove('editable-inline-box__error');
        } else {
          isAllBoxesHaveValues = false;
          box.classList.add('editable-inline-box__error');
        }
      }

      if (!isAllBoxesHaveValues) {
        errors = { fillInBlank: true };
        this.inValid = true;
        return errors;
      }
    }

    this.inValid = false;
    return null;
  }

  writeValue(value: FillInBlankTextEditorOutput | string): void {
    if (typeof value === 'string') {
      const delta = this.quill.clipboard.convert({ html: value });
      this.quill.setContents(delta);
    } else {
      const htmlContent = Utils.revertExtractAndReplace(value.answers, value.text);
      const delta = this.quill.clipboard.convert({ html: htmlContent });
      this.quill.setContents(delta);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  insertEditableBox(quill: Quill) {
    quill.format('editableInlineBox', true);
  }

  insertTable(quill: Quill) {
    let tableModule = quill.getModule('better-table') as any;
    tableModule?.insertTable(3, 3);
  }

  onTextChange = (delta: Delta) => {
    console.log("delta: ", delta);
    this.deltaSubject.next(delta);
  };

  initQuill() {
    Quill.register(EditableInlineBox);
    Quill.register(
      {
        'modules/better-table': QuillBetterTable,
      },
      true
    );

    this.quill = new Quill('#editor', {
      modules: {
        toolbar: '#toolbar',
        table: false,
        'better-table': {
          operationMenu: {
            items: {
              unmergeCells: {
                text: 'Another unmerge cells name',
              },
            },
          },
        },
        keyboard: {
          bindings: QuillBetterTable.keyboardBindings,
        },
      },
      theme: 'snow',
    });

    this.quill.on('text-change', this.onTextChange);
  }

  initToolbar() {
    this.toolbar = this.quill.getModule('toolbar');
    // this.toolbar.addHandler("image", this.imageHandler.bind(this, this.quill));
    this.editableBoxMenu.nativeElement.addEventListener(
      'click',
      this.insertEditableBox.bind(this, this.quill)
    );
    this.tableMenu.nativeElement.addEventListener(
      'click',
      this.insertTable.bind(this, this.quill)
    );
  }

  broadcastValueChange(htmlContent: string) {
    if (this.hasBlankBox) {
      const [answers, content] =
        Utils.extractAndReplaceEditableInlineBox(htmlContent);
      this.onChange({
        text: content,
        answers,
      });
    } else {
      this.onChange(htmlContent)
    }
  }
}
