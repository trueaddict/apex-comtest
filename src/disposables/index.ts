import { Disposable, ExtensionContext } from "vscode";
import generateUnitTest from "./generateUnitTest";

export type CeiliCommand = (context: ExtensionContext) => Disposable;

export default [
    generateUnitTest,
] as CeiliCommand[];