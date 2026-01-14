// https://github.com/micromark/micromark-extension-directive#syntax
import { h } from "hastscript";
import { visit } from "unist-util-visit";

/**
 * This plugin converts remark directives to HTML.
 */
export function remarkDirectiveToHTML() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, function (node) {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        const data = node.data || (node.data = {});
        const hast = h(node.name, node.attributes || {});

        data.hName = hast.tagName;
        data.hProperties = hast.properties;
      }
    });
  };
}
