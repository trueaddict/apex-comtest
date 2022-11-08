
import { commands, Disposable, ExtensionContext, window } from 'vscode';
import Ceili from '../engine/Ceili';

export default function(context: ExtensionContext): Disposable {
    return commands.registerCommand('ceili.generate', () => {
        try {
            Ceili.run();
        } catch (e : Error | any) {
            console.log(e);
            window.showErrorMessage(e.message);
        }
    });
}