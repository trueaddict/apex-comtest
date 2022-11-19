import * as vscode from 'vscode';
import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

const allowedFileTypes = ['java', 'apex'];
const equalsOperators = ['==='];
const notEqualsOperators = ['!=='];

const INDENT = 4;

/**
 * 
 */
export function generateUnitTest() {
    vscode.window.showInformationMessage('Hello World from generateTestClass!');
    let document = vscode.window.activeTextEditor?.document;
    if (!validateDocument(document)) { 
        return; // Active document isn't valid, return ->
    }

    console.log(JSON.stringify(vscode.window.activeTextEditor?.document));
    
    try {
        let fileName : string = document?.fileName ?? '';
        const documentStr : string = readFileSync(fileName).toString();
        console.log(documentStr);

        let content = createTestClassContent(documentStr);
        console.log(path.parse(fileName));
        let testClassFileName = path.join(path.parse(fileName).dir, path.parse(fileName).name + '_Test' + path.parse(fileName).ext);
        console.log(testClassFileName);
        createTestClass(testClassFileName, content);
        
    } catch (error) {
        let errMsg = (error as Error).message;
        console.log(error);
        showMessage(errMsg);
    }
    
}


function createTestClassContent(documentStr : string) : string[] {
    let content : string[] = [
        '/**',
        '* This document is generated automatically by apex-comtest', 
        '* @last generated ' + new Date().toISOString(),
        '*/', 
        '@isTest', 
        'private class TestClass_Test {',
    ];
    const className = parseClassName(documentStr);

    const testCases : string[] = documentStr.match(/<unit-test>([\s\S]*?)<\/unit-test>/g) ?? [];
    let integer = 1;
    for (let testCase of testCases) {
        let cleanedMatch = testCase.replace('<unit-test>', '').replace('</unit-test>', '').replace(/\*/g, '');
        let lines = cleanedMatch.split(';');
        
        content.push(indent(INDENT) + '@isTest');
        content.push(indent(INDENT) + 'private static void testMethod' + (integer++).toString() + '() {');
        for (let parsedLine of lines) {

            if (isAssertLine(parsedLine)) {
                // Line contains assertion
                let assertLine = parsedLine.replace(/\s/g, '');
                let createdLine = createLine(assertLine, className);
                if (createdLine !== '') {
                    content.push(indent(INDENT*2) +createdLine);
                }
            } else {
                // Test setup
                let setupLine = parsedLine.replace(/(\r\n|\r|\n)/g, '').trim();
                if (setupLine !== '') {
                    content.push(indent(INDENT*2) + setupLine + ';');
                }
            }            
        }
        content.push(indent(INDENT) + '}');
    }

    content.push('}');
    return content;
}


/**
 * Parse class name from document
 * @param documentStr document in string format
 * @returns documents class name
 */
function parseClassName(documentStr : string) : string {
    let regexResult = documentStr.matchAll(/^(private|public|global)(\s|)(virtual|abstract|with sharing|without sharing|)([ \t])+(class)([ \t]+)(.*){/gm);
    if (regexResult) {
        const matches = Array.from(regexResult)[0];
        return matches[7].trim();
    }
    return '';
}


/**
 * Create a line for apex test assertion or parsed line
 * @param parsedLine line parsed from source code
 * @param className class name used to set method scope
 * @returns created line
 */
function createLine(parsedLine : string, className : string) : string {
    let retLine : string = '';

    retLine = createAssertion(parsedLine, className, equalsOperators, 'System.assertEquals');
    if (retLine !== '') {
        return retLine;
    }

    retLine = createAssertion(parsedLine, className, notEqualsOperators, 'System.assertNotEquals');
    if (retLine !== '') {
        return retLine;
    }

    return parsedLine;
}


/**
 * Convert === or !== to System.assertEquals or System.assertNotEquals
 * @param parsedLine line to convert
 * @param operators possible operators
 * @param apexMethod which apex method to use
 * @returns valid apex code line or empty
 */
function createAssertion(parsedLine : string, className : string, operators : string[], apexMethod : string) : string {
    for (let operator of operators) {
        const re = new RegExp(`^.*[^=](${operator})[^=].*[^=]$`, 'g');
        if (re.test(parsedLine)) {
            let lineParts = parsedLine.split(operator);
            return  apexMethod + '('+lineParts[1]+', '+className+'.'+lineParts[0]+', \'msg\');';
        }
    }
    return '';
}


function isAssertLine(line : string) : boolean {
    for (let operator of equalsOperators) {
        if (line.includes(operator)) {
            return true;
        }
    }
    for (let operator of notEqualsOperators) {
        if (line.includes(operator)) {
            return true;
        }
    }
    
    return false;
}


function createTestClass(testClassFileName : string, content : string[]) {
    writeFileSync(testClassFileName, content.join('\n'));
}

function indent(length : number) {
    return new Array(length+1).join(' ');
}


/**
 * Checks if active document is valid for unit test creation
 * @param document active text document
 * @returns True if document is valid, else false
 */
function validateDocument(document : vscode.TextDocument | undefined) : boolean {
    if (!document) {
        showMessage('Active document not found!');
        return false;
    }

    if (!allowedFileTypes.includes(document?.languageId)) {
        showMessage('File type not allowed!');
        return false;
    }

    if (path.parse(document?.fileName).name.toLowerCase().includes('test')) {
        showMessage('File is already a test class!');
        return false;
    }


    return true;
}


function showMessage(message : string) {
    vscode.window.showErrorMessage(message);
}