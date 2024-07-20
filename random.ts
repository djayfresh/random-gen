export class RandomSFC {
    private static DEFAULT_SEED = 'Cookies';
    private static SEEDS: string[] = [];
    private static randomCache: {
        [key: string]: sfc32Func;
    } = {};

    static default() {
        return RandomSFC.random(RandomSFC.DEFAULT_SEED);
    }

    static random(seed?: string, refresh?: boolean): number {
        const lookupSeed = seed || RandomSFC.getLastSeed();
        console.log("\tSeed:", lookupSeed, "?", seed);
        if (!RandomSFC.randomCache[lookupSeed] || refresh) {
            return RandomSFC.buildRandom(lookupSeed)();
        }
        return RandomSFC.randomCache[lookupSeed]();
    }

    static range(range: number = 1000, seed?: string): number {
        const random = RandomSFC.random(seed);
        return Math.round(random * range);
    }

    private static getLastSeed() {
        return RandomSFC.SEEDS[RandomSFC.SEEDS.length - 1] || RandomSFC.DEFAULT_SEED;
    }

    private static buildRandom(seed: string) {
        const hash = RandomSFC.cyrb128(seed);
        const seedFunc = RandomSFC.sfc32(hash[0], hash[1], hash[2], hash[3]);
        RandomSFC.SEEDS.push(seed);
        return RandomSFC.randomCache[seed] = seedFunc;
    }
    
    /**
     * Hash function for turning strings into 32-bit number array
     * @param str to hash string
     * @returns length 4 number array
     */
    private static cyrb128(str: string): [number, number, number, number] {
        let h1 = 1779033703, h2 = 3144134277,
            h3 = 1013904242, h4 = 2773480762;
        for (let i = 0, k; i < str.length; i++) {
            k = str.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
        }
        h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
        h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
        h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
        h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
        h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
        return [h1>>>0, h2>>>0, h3>>>0, h4>>>0];
    }

    /**
     * Create a function for generating sudo-random numbers. 
     * 
     * Below default values are provided from 
     * https://en.wikipedia.org/wiki/Nothing-up-my-sleeve_number
     * @param a 32-bit number, recommend values from hash or default (0x9E3779B9) Phi
     * @param b 32-bit number, recommend values from hash or default (0x243F6A88) Pi
     * @param c 32-bit number, recommend values from hash or default (0xB7E15162) E
     * @param d 32-bit number, recommend values from hash or default ()
     * @returns sudo-random number function from seeded value
     */
    private static sfc32(a: number, b: number, c: number, d: number): sfc32Func {
        return function() {
            a |= 0; b |= 0; c |= 0; d |= 0;
            let t = (a + b | 0) + d | 0;
            d = d + 1 | 0;
            a = b ^ b >>> 9;
            b = c + (c << 3) | 0;
            c = (c << 21 | c >>> 11);
            c = c + t | 0;
            return (t >>> 0) / 4294967296;
        }
    }
}

type sfc32Func = () => number;