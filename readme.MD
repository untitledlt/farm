# Farm Controller

## Quick start

```
git clone git@github.com:untitledlt/farm.git
cd farm
yarn install
yarn test
```

## Usage

```javascript
const farm = new ChainFarm();

const calveA1 = farm.giveBirth(0, farm.nextId(), 'First calve');
const calveA2 = farm.giveBirth(0, farm.nextId(), 'Second calve');
const calveA3 = farm.giveBirth(0, farm.nextId(), 'Third calve');

const calve11 = farm.giveBirth(calveA1.cowId, farm.nextId(), 'Litter calveA1->B');

// so sad :'(
farm.endLifeSpan(calveA3.cowId);

farm.print();
```

## Implementations

#### There are 5 implementations with different data types to control the farm. First 4 uses Array/Object/Map data types and the last one is my custom data structure implementation for Task's part #2.

### 1.1. Array

> Implemented in file `1.1.ArrayFarm.ts`

This method uses two Arrays to store primitive values:

-   cow[index] = name
-   parentMap[index] = parentId

**This is the least convenient way to store/access data but it's the fasters method to read/insert data. It has downsides (f.e. incorrect lenght) when some elements are deleted as it still keeps undefined items.**

### 1.2. Array of Object

> Implemented in file `1.2.ArrayOfObjectsFarm.ts`

**This could be quite simple and convienient way to store data but it has super slow `findCowById` method because it needs to iterate Array until it finds required item. Probably I would use this method is speed was not an issue.**

### 1.3. Object

> Implemented in file `1.3.ObjectFarm.ts`

**Fast and most convenient method to store/access data. Requires addition parsing because index is stored in property name so it's a string.**

### 1.4. Map

> Implemented in file `1.4.MapFarm.ts`

**Most modern data type. A little bit nicer way to store/access data but it's slower then Object.**

### 2.1. Chain

> Implemented in file `2.1.ChainFarm.ts`

#### This method does NOT use Array/Object type to store data

**This is a solution to part 2 of this task.**

**It was inspired by my LRU cache implementation: https://github.com/untitledlt/currency-exchange-api/blob/main/src/LruCache/LruCache.ts**

Method `getList` uses an Array but it's used only for debuging. Actual data structure does NOT use Array.

Data is stored in `ChainCow` instance as primitive values (no Array/Object). Each instance has a reference to next/previous record so all cows are connected to the chain to make it possible to iterate over each element.

# Performance comparition

| Class Name                  | Insert     | Find       | Delete     | Total time   |
| :-------------------------- | :--------- | :--------- | :--------- | :----------- |
| 1.1. **ArrayFarm**          | 0.203 μs   | 0.111 μs   | 0.137 μs   | 45.1 ms      |
| 1.2. **ArrayOfObjectsFarm** | 154.488 μs | 62.922 μs  | 119.549 μs | 33695 ms     |
| 1.3. **ObjectFarm**         | 0.477 μs   | 0.242 μs   | 0.143 μs   | 86.22 ms     |
| 1.4. **MapFarm**            | 0.580 μs   | 0.694 μs   | 0.120 μs   | 139.38 ms    |
| 2.1. **ChainFarm**          | 464.698 μs | 274.855 μs | 275.0 μs   | 101455.37 ms |

> Insert method also does 2x `findCowById` to validate data

> Delete method also does 1x `findCowById` to validate data

> Total time column represents total time in miliseconds of all iterations (100.000)

# Other information

-   All implementations extends base `Farm` class which has `print` method.

-   File `debug.ts` contains some messy code that I used to test implementations, measure performance, etc.

-   Folder `coverage` has unit tests coverage report
