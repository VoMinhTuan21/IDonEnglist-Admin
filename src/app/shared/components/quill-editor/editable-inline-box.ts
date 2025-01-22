import Inline from 'quill/blots/inline';

class EditableInlineBox extends Inline {
  static override blotName = 'editableInlineBox';
  static override tagName = 'span';
  static override className = 'editable-inline-box';

  static override formats(node: HTMLElement) {
    return node.innerText;
  }
}

export default EditableInlineBox;