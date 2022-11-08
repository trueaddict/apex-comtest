
import { commands, Disposable, ExtensionContext, window } from 'vscode';
import Ceili from '../engine/Ceili';

const COMMAND = 'ceili.generate';

export default function(context: ExtensionContext): Disposable {
    return commands.registerCommand(COMMAND, () => {
        try {
            Ceili.run();
        } catch (e : Error | any) {
            console.log(e);
            window.showErrorMessage(e.message);
        }
    });
}