import { performance } from 'perf_hooks';
import v8 from 'v8';
import { ArrayFarm } from './1.1.ArrayFarm';
import { ArrayOfObjectsFarm } from './1.2.ArrayOfObjectsFarm';
import { ObjectFarm } from './1.4.ObjectFarm';
import { MapFarm } from './1.3.MapFarm';
import { ChainFarm } from './2.1.ChainFarm';

type Instance = ArrayFarm | ArrayOfObjectsFarm | ObjectFarm | MapFarm | ChainFarm;

const ITERATIONS = 1000 * 100;

const perOneRun = (ns: number) => `${Number((ns * 1000) / ITERATIONS).toFixed(3)} ms`;

const randomBetween = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const measure = (farm: Instance) => {
    console.log(`\n${farm.constructor.name}\n-----------------------------`);

    // // give birth to litter A
    // const calveA1 = farm.giveBirth(0, farm.nextId(), 'First calve');
    // const calveA2 = farm.giveBirth(0, farm.nextId(), 'Second calve');
    // const calveA3 = farm.giveBirth(0, farm.nextId(), 'Third calve');

    // farm.print();

    // return;

    // // give birth to litter B
    // const calve11 = farm.giveBirth(
    //     calveA1.cowId,
    //     farm.nextId(),
    //     'First calve of litter calveA1->B'
    // );
    // const calve21 = farm.giveBirth(
    //     calveA2.cowId,
    //     farm.nextId(),
    //     'First calve of litter calceA2->B'
    // );
    // const calve31 = farm.giveBirth(
    //     calveA3.cowId,
    //     farm.nextId(),
    //     'First calve of litter calceA3->B'
    // );
    // const calve32 = farm.giveBirth(
    //     calveA3.cowId,
    //     farm.nextId(),
    //     'Second calve of litter calceA3->B'
    // );

    // // kill calveA3
    // farm.endLifeSpan(calveA3.cowId);

    // farm.print();

    let lastId = 0;

    const startInsert = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
        farm.giveBirth(lastId, lastId + 1, `Cow ${lastId}`);
        lastId++;
    }
    const insertTime = performance.now() - startInsert;

    const startFind = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
        const index = randomBetween(0, ITERATIONS);
        farm.getCowById(index);
    }
    const findTime = performance.now() - startFind;

    const startDelete = performance.now();
    for (let i = lastId; i > 0; i--) {
        farm.endLifeSpan(i);
    }
    const deleteTime = performance.now() - startDelete;

    const totalTime = insertTime + deleteTime + findTime;

    console.log({
        name: farm.constructor.name,
        insertTime: perOneRun(insertTime),
        findTime: perOneRun(findTime),
        deleteTime: perOneRun(deleteTime),
        totalTime: totalTime.toFixed(5),
        // mem: process.memoryUsage(),
        // v8: Object.values(v8.getHeapStatistics()).join(' '),
    });
};

[
    new ArrayFarm(),
    new ArrayOfObjectsFarm(),
    new ObjectFarm(),
    new MapFarm(),
    new ChainFarm(),
].forEach(measure);

// rss          heapTotal       heapUsed    external    arrayBuffers
// 191467520    127991808       107609776   1862266     154513
// 195051520    129613824       107831344   1862429     154513
// 201334784    132734976       113169648   1862508     154513
// 200400896    140025856       120344664   1862586     154513

// total_heap_size
// total_heap_size_executable
// total_physical_size
// total_available_size
// used_heap_size
// heap_size_limit
// malloced_memory
// peak_malloced_memory
// does_zap_garbage
// number_of_native_contexts
// number_of_detached_contexts

// total_heap        tot phys             used heap
// 128516096 1622016 128005832 4229968440 110005024 4345298944 8192 12018104 0 2 0
// 131276800 1622016 130843768 4234950640 108972360 4345298944 8192 12018104 0 2 0
// 133521408 1622016 132971592 4228077104 115099648 4345298944 8192 12018104 0 2 0
// 140812288 1622016 140303632 4222459272 122333760 4345298944 8192 12018104 0 2 0

// 128253952 1622016 127932144 4229923568 110247216 4345298944 8192 12018104 0 2 0
