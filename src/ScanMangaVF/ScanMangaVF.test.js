const { expect } = require("chai");

exports.runTests = async function (testCase, testData, source, defaultTests) {
    await defaultTests(testCase, testData, source);
    await testCase("test getChapterDetails", async () => {
        let chapter = await source.getChapterDetails("one-punch-man", "1");
        console.log(chapter);
        expect(chapter.mangaId).to.equal("one-punch-man");
    });
};
