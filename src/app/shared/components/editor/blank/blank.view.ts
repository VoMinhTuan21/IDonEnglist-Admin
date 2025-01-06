import { EditorView, NodeView } from "prosemirror-view";
import { Node } from 'prosemirror-model';

class BlankNodeView implements NodeView {
  dom: HTMLElement;
  inputElement: HTMLInputElement;

  constructor(node: Node, view: EditorView, getPos: () => number | undefined) {
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.value = node.attrs['value'];

    this.inputElement.addEventListener('blur', () => {
      const position = getPos();
      if (position !== undefined) {
        const transaction = view.state.tr.setNodeMarkup(position, undefined, {
          value: this.inputElement.value,
        });

        view.dispatch(transaction);
      }
    });

    this.dom = this.inputElement;
  }
}

export default BlankNodeView