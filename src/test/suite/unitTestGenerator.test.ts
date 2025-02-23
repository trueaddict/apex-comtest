import * as assert from 'assert';

// Import generation
import {createTestClassContent} from '../../engine/generators/UnitTestGenerator';


suite('Generate Unit Test Suite', () => {

    test('Test class content', () => {
        let documentIn = `/**
* Comments before class
*/
public class TestClass {

    public static void testMethod() {
        return 'Koira';
    }



    /**
    * @unit-test 
    * <unit-test>
    * Account acc = new Account(Name='Test Account');
    * insert acc;
    * testMethod1(acc.Name) === 'TEST ACCOUNT';
    * </unit-test>
    */    
    private String testMethod1(String msg) {
        // Inline comment
        return msg.toUpperCase();
    }
}`;

        let documentOut = `
@isTest
private class TestClass_Test {
    @isTest
    private static void testMethod1() {
        Account acc = new Account(Name='Test Account');
        insert acc;
        System.assertEquals('TESTACCOUNT', TestClass.testMethod1(acc.Name), 'msg');
    }
}`;

        let result = createTestClassContent(documentIn).join('\n');
        console.log(result);
        result = result.replace(/\/\*\*(.|\n)*\*\//g, '');

        assert.strictEqual(result, documentOut, 'Generated apex test class does not match!');
    });
});