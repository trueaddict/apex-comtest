import { generateUnitTest } from "./generators/UnitTestGenerator";

class Ceili {
    // TODO

    public static run(): void {
        try {
            generateUnitTest();
        } catch (error) {
            throw error;
        }
    }
}

export default Ceili;