import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FillInBlankTextEditorOutput } from '@shared/models/common';
import { Utils } from '@shared/utils/utils';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-fill-in-blank-text-editor',
  standalone: true,
  imports: [NzIconModule, NzButtonModule, NzToolTipModule],
  templateUrl: './fill-in-blank-text-editor.component.html',
  styleUrl: './fill-in-blank-text-editor.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FillInBlankTextEditorComponent),
      multi: true,
    },
  ],
})
export class FillInBlankTextEditorComponent implements ControlValueAccessor {
  content: string = '';
  placeholderText: string = 'Type something...';
  disableAddBlankButton = false;

  @ViewChild('editorInput', { static: true })
  editorInput!: ElementRef<HTMLElement>;

  formatText(command: string) {
    document.execCommand(command, false, undefined);
    this.onInput(); // Ensure the input is updated after formatting
  }

  isCommandActive(command: string): boolean {
    return document.queryCommandState(command);
  }

  private onChange: (value: FillInBlankTextEditorOutput) => void = () => {};
  private onTouched: () => void = () => {};
  private inputSubject = new Subject<string>();

  @Input() numOfBlanks = 0;

  constructor() {
    this.inputSubject
      .pipe(debounceTime(300))
      .subscribe((input) => this.disableAddBlank(input));
  }

  onInput() {
    const target = this.editorInput.nativeElement;

    const answers: string[] = [];

    const inputs = target.getElementsByClassName("fill-in-blank-text-editor__blank-box");
    for (const input of Array.from(inputs) as HTMLInputElement[]) {
      answers.push(input.value);
    }

    this.content = Utils.replaceInputTags(target.innerHTML.toString()).trim();
    this.inputSubject.next(this.content);
    this.onChange({
      text: this.content,
      answers
    });
  }

  addBlank(defaultValue: string = '') {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      return; // No cursor position is available
    }

    const range = selection.getRangeAt(0);

    // Get the selected text
    const selectedText = range.toString();

    // If there's a selection, use it as the default value
    if (selectedText.trim()) {
      defaultValue = selectedText.trim();
      range.deleteContents(); // Remove the selected text
    }

    // Create a new input element
    const newInput = document.createElement('input');
    newInput.setAttribute('type', 'text');
    newInput.classList.add('fill-in-blank-text-editor__blank-box');
    newInput.setAttribute('placeholder', 'Type answer...');
    if (defaultValue) {
      newInput.setAttribute('value', defaultValue);
    }

    // Insert the input at the current cursor position
    range.insertNode(newInput);

    // Move the cursor after the inserted input
    const textNode = document.createTextNode(' ');
    newInput.parentNode?.insertBefore(textNode, newInput.nextSibling);

    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);

    // Ensure focus remains in the editable area
    this.editorInput.nativeElement.click();
    this.onInput();
  }

  writeValue(obj?: FillInBlankTextEditorOutput): void {
    if (obj && obj.text && obj.answers.length > 0) {
      this.editorInput.nativeElement.innerHTML = Utils.fillInBlanks(obj.text, obj.answers)
      this.content = obj.text;
      this.inputSubject.next(this.content);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  private disableAddBlank(input: string) {
    const blanks = input.split(' ').filter((e) => e === '__BLANK__').length;

    if (this.numOfBlanks > 0 && blanks === this.numOfBlanks) {
      this.disableAddBlankButton = true;
    } else {
      this.disableAddBlankButton = false;
    }
  }

  insertTable() {
    const rows = prompt("Enter the number of rows:", "2");
    const cols = prompt("Enter the number of columns:", "2");
    
    if (rows && cols) {
      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      
      for (let i = 0; i < parseInt(rows); i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < parseInt(cols); j++) {
          const cell = document.createElement('td');
          cell.style.border = '1px solid black';
          cell.style.padding = '5px';
          cell.style.height = '32px';
          cell.textContent = "abcd..."
          cell.contentEditable = 'true'; // Make the cell editable
          row.appendChild(cell);
        }
        table.appendChild(row);
      }
      
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.insertNode(table);
      }
      
      this.onInput(); // Update input state
    }
  }
}
