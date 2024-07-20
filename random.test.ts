import { RandomSFC } from './random';

function runTest() {
    const tests: { seed?: string, runs: number, matchLast?: boolean }[] = [
        { seed: 'vue is a cool framework', runs: 5 },
        { seed: 'typescript FTW', runs: 5 },
        { seed: undefined, runs: 5, matchLast: true },
    ];

    let lastRun: number[] = [];
    for (let index = 0; index < tests.length; index++) {
        const test = tests[index];
        const thisRun: number[] = [];

        for (let run = 0; run < test.runs; run++) {
            const random = RandomSFC.random(test.seed, test.matchLast && run === 0);
            thisRun.push(random);
    
            if (test.matchLast && index !== 0) {
                const lastNum = lastRun[run];
                console.log("Last Run:", lastNum, "This:", random);
            }
            else {
                console.log(test.seed, "This:", random);
            }
        }
        lastRun = thisRun;
    }
}

runTest();