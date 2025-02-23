// TODO
// Example: https://github.com/no-stack-dub-sack/apexdox-vs-code/blob/master/src/disposables/docBlockCompletion.ts

import { commands, CompletionItem, CompletionItemProvider, Disposable, languages, Position, SnippetString, TextDocument, window } from "vscode";


const COMMAND = 'ceili.comment';

class DocBlockCompletionItem extends CompletionItem {
    constructor(position: Position) {
        super('@unit-test <unit-test></unit-test>');
        this.detail = 'CEILI: Apex comtest';
        this.insertText = '';
        this.command = {
            title: 'Ceili Comment',
            command: COMMAND,
            //arguments : [position]
        };
    }
}


class DocBlockCompletionProvider implements CompletionItemProvider {
    public provideCompletionItems(
        document: TextDocument,
        position: Position
        ): Promise<CompletionItem[]> | Promise<any>  {

        const line = document.lineAt(position.line).text;
        console.log(line, line.indexOf('unit'));
            
        // if (line.indexOf('/**') === -1) {
        //     return Promise.resolve(undefined); // Promise<any>
        // }


        return Promise.resolve([new DocBlockCompletionItem(position)]);
    }
}


export default function commentBlockCompletion() : Disposable {
    commands.registerCommand(COMMAND, (position : Position) => {
        const editor = window.activeTextEditor;
        if (editor) {
            const lineIdx = editor.selection.active.line;
        }

        const snippet = new SnippetString('@unit-test \n* <unit-test>\n* $0\n* </unit-test>');
        editor?.insertSnippet(snippet, position);
    });
    return languages.registerCompletionItemProvider('apex', new DocBlockCompletionProvider(), '@', 'unit-test');
}