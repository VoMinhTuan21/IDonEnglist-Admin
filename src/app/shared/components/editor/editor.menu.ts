import { buildMenuItems } from "prosemirror-example-setup";
import { Dropdown, MenuElement, MenuItem } from "prosemirror-menu";
import { Fragment, Schema } from "prosemirror-model";
import { EditorState, TextSelection, Transaction } from "prosemirror-state";
import { addColumnAfter, addColumnBefore, addRowAfter, addRowBefore, deleteColumn, deleteRow, deleteTable, mergeCells, setCellAttr, splitCell, toggleHeaderCell, toggleHeaderColumn, toggleHeaderRow } from "prosemirror-tables";

const item = (label: string, cmd: (state: EditorState) => boolean) => {
  return new MenuItem({ label, select: cmd, run: cmd });
}

const tableMenu = [
  item('Insert column before', addColumnBefore),
  item('Insert column after', addColumnAfter),
  item('Delete column', deleteColumn),
  item('Insert row before', addRowBefore),
  item('Insert row after', addRowAfter),
  item('Delete row', deleteRow),
  item('Delete table', deleteTable),
  item('Merge cells', mergeCells),
  item('Split cell', splitCell),
  item('Toggle header column', toggleHeaderColumn),
  item('Toggle header row', toggleHeaderRow),
  item('Toggle header cells', toggleHeaderCell),
  item('Make cell green', setCellAttr('background', '#dfd')),
  item('Make cell not-green', setCellAttr('background', null)),
];

const insertTable = () => {
  return (
    state: EditorState,
    dispatch: (tr: Transaction) => void
  ): boolean => {
    const offset: number = state.tr.selection.anchor + 1;
    const transaction: Transaction = state.tr;
    const cell = state.schema.nodes['table_cell'].createAndFill();
    if (!cell) {
      return false;
    }
    const node = state.schema.nodes['table'].create(
      null,
      Fragment.fromArray([
        state.schema.nodes['table_row'].create(
          null,
          Fragment.fromArray([cell, cell, cell])
        ),
        state.schema.nodes['table_row'].create(
          null,
          Fragment.fromArray([cell, cell, cell])
        ),
      ])
    );

    if (dispatch) {
      dispatch(
        transaction
          .replaceSelectionWith(node)
          .scrollIntoView()
          .setSelection(TextSelection.near(transaction.doc.resolve(offset)))
      );
    }

    return true;
  };
}

const buildEditorMenu = (schema: Schema): MenuElement[][] => {
  const menu = buildMenuItems(schema).fullMenu;
  menu.push([
    new MenuItem({
      label: 'Add table',
      title: 'Insert table',
      class: 'ProseMirror-icon',
      run: insertTable(),
    }),
    new MenuItem({
      label: 'Add blank',
      title: 'Add blank',
      class: 'ProseMirror-icon',
      run: (state: EditorState, dispatch: (tr: Transaction) => void) => {
        const { $from } = state.selection;
        const editableField = schema.nodes['blank'].create({});
        const transaction = state.tr.insert($from.pos, editableField);
        dispatch(transaction);
      },
    }),
    new Dropdown(tableMenu, { label: 'Table' }),
  ]);

  return menu;
}

export {
  buildEditorMenu
}