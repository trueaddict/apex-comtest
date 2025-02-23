import { commands, Disposable, ExtensionContext, window, SnippetString, Position } from "vscode";
import commentBlockCompletion from "./commentBlockCompletion";

const COMMAND = 'ceili.commentBlock';

export default function(context: ExtensionContext): Disposable {
    return commands.registerCommand(COMMAND, () => {
        try {
            const editor = window.activeTextEditor;
            if (editor) {
                const lineIdx = editor.selection.active.line;
            }
            const snippet = new SnippetString('@unit-test \n* <unit-test>\n* $0\n* </unit-test>');
            editor?.insertSnippet(snippet);
        } catch (error) {
            console.log(error);
        }
    });
}