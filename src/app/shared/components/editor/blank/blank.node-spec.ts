import { NodeSpec } from "prosemirror-model";

const BlankNodeSpec: NodeSpec = {
  blank: {
    group: 'inline',
    inline: true,
    atom: false,
    content: 'text*',
    attrs: { value: { default: 'asdf' } },
    toDOM: (node: any) => ['input', { type: 'text', value: node.attrs.value }, 0],
    parseDOM: [
      {
        tag: 'input[type="text"]',
        getAttrs: (dom: any) => ({ value: (dom as HTMLInputElement).value }),
      },
    ],
  },
};

export default BlankNodeSpec;