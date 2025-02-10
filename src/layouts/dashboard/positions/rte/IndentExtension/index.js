import { Extension } from "@tiptap/core";
import { AllSelection, TextSelection } from "@tiptap/pm/state";

export const Indent = Extension.create({
  name: "indent",

  defaultOptions: {
    types: ["listItem", "paragraph"], // Apply to these node types
    minLevel: 0,
    maxLevel: 8,
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            renderHTML: (attributes) =>
              attributes.indent > this.options.minLevel
                ? { "data-indent": attributes.indent }
                : null,
            parseHTML: (element) => {
              const level = Number(element.getAttribute("data-indent"));
              return level && level > this.options.minLevel ? level : null;
            },
          },
        },
      },
    ];
  },

  addCommands() {
    const setNodeIndentMarkup = (tr, pos, delta) => {
      const node = tr.doc.nodeAt(pos);
      if (!node) return tr;

      const nextLevel = (node.attrs.indent || 0) + delta;
      const indent = Math.min(Math.max(nextLevel, this.options.minLevel), this.options.maxLevel);

      if (indent !== node.attrs.indent) {
        const nodeAttrs = indent > this.options.minLevel ? { ...node.attrs, indent } : {};
        return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks);
      }
      return tr;
    };

    const updateIndentLevel = (tr, delta) => {
      const { doc, selection } = tr;
      if (!doc || !selection || !(selection instanceof TextSelection || selection instanceof AllSelection)) return tr;

      const { from, to } = selection;
      doc.nodesBetween(from, to, (node, pos) => {
        if (this.options.types.includes(node.type.name)) {
          tr = setNodeIndentMarkup(tr, pos, delta);
          return false;
        }
        return true;
      });

      return tr;
    };

    const applyIndent = (direction) => () => ({ tr, state, dispatch }) => {
      tr = updateIndentLevel(tr, direction);
      if (tr.docChanged) {
        dispatch(tr);
        return true;
      }
      return false;
    };

    return {
      indent: applyIndent(1), // Increase indent
      outdent: applyIndent(-1), // Decrease indent
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.indent(),
      "Shift-Tab": () => this.editor.commands.outdent(),
    };
  },
});

export default Indent;