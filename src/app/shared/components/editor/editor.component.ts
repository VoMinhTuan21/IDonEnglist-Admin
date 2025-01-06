import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { exampleSetup } from 'prosemirror-example-setup';
import { keymap } from 'prosemirror-keymap';
import {
  DOMParser,
  DOMSerializer,
  Schema
} from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { EditorState } from 'prosemirror-state';
import {
  columnResizing,
  goToNextCell,
  tableEditing,
  tableNodes
} from 'prosemirror-tables';
import { EditorView } from 'prosemirror-view';
import BlankNodeSpec from './blank/blank.node-spec';
import BlankNodeView from './blank/blank.view';
import { buildEditorMenu } from './editor.menu';
import EditorPlugins from './editor.plugin';

@Component({
  selector: 'app-editor',
  imports: [],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class EditorComponent implements OnInit {
  @ViewChild('editor', {static: true}) editor!: ElementRef;

  editorView?: EditorView;

  ngOnInit(): void {
   const mySchema = new Schema({
      nodes: basicSchema.spec.nodes.append(BlankNodeSpec).append(
        tableNodes({
          tableGroup: 'block',
          cellContent: 'block+',
          cellAttributes: {
            background: {
              default: null,
              getFromDOM(dom) {
                return dom.style.backgroundColor || null;
              },
              setDOMAttr(value, attrs) {
                if (value)
                  attrs['style'] =
                    (attrs['style'] || '') + `background-color: ${value};`;
              },
            },
            border: {
              default: '1px solid rgb(169, 165, 165)',
              getFromDOM(dom) {
                return dom.style.border || null;
              },
              setDOMAttr(value, attrs) {
                if (value)
                  attrs['style'] = (attrs['style'] || '') + `border: ${value};`;
              },
            },
          },
        })
      ),
      marks: basicSchema.spec.marks,
    });

    this.editorView = new EditorView(this.editor.nativeElement, {
      state: EditorState.create({
        schema: mySchema,
        plugins: [
          columnResizing(),
          tableEditing(),
          EditorPlugins.attributesPlugin({
            class: 'editor__content'
          }),
          keymap({
            Tab: goToNextCell(1),
            'Shift-Tab': goToNextCell(-1),
          }),
        ].concat(
          exampleSetup({
            schema: mySchema,
            menuContent: buildEditorMenu(mySchema),
          })
        ),
        doc: DOMParser.fromSchema(mySchema).parse(this.editor.nativeElement),
        
      }),
      nodeViews: {
        blank: (node, view, getPos) => new BlankNodeView(node, view, getPos)
      }
    });
  }

  getHTML(): string {
    if (!this.editorView) {
      return '';
    }

    const { state } = this.editorView;
    const doc = state.doc;

    // Create a DOM serializer using your schema
    const serializer = DOMSerializer.fromSchema(state.schema);

    // Serialize the document to a DOM node
    const fragment = serializer.serializeFragment(doc.content);

    // Convert the DOM node to a string
    const container = document.createElement('div');
    container.appendChild(fragment);

    (Array.from(container.getElementsByTagName('input')) as HTMLInputElement[]).forEach(input => {
      console.log("input: ", input.value);
    })
    

    return container.innerHTML; // Return the HTML string
  }

  onGetHTML() {
    const htmlContent = this.getHTML();
    console.log(htmlContent); // Or handle the HTML as needed
  }
}
