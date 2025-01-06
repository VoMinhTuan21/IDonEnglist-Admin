import { Plugin, PluginKey } from "prosemirror-state";

const attributesPlugin = (attributes = {}): Plugin => {
  return new Plugin({
    key: new PluginKey("attributes"),
    props: {
      attributes
    }
  })
}

const EditorPlugins = {
  attributesPlugin
}

export default EditorPlugins;