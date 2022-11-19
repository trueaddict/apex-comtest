import { Disposable, ExtensionContext } from "vscode";
import generateUnitTest from "./generateUnitTest";
import commentBlockCompletion from "./commentBlockCompletion";
import commentBlock from "./commentBlock";

export type CeiliCommand = (context: ExtensionContext) => Disposable;

export default [
    generateUnitTest,
    commentBlock,
    commentBlockCompletion,
] as CeiliCommand[];