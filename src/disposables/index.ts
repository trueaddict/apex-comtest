import { Disposable, ExtensionContext } from "vscode";
import generateUnitTest from "./generateUnitTest";
import commentBlockCompletion from "./commentBlockCompletion";

export type CeiliCommand = (context: ExtensionContext) => Disposable;

export default [
    generateUnitTest,
    commentBlockCompletion,
] as CeiliCommand[];