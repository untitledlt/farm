import { ArrayFarm } from './1.1.ArrayFarm';
import { ArrayOfObjectsFarm } from './1.2.ArrayOfObjectsFarm';
import { ObjectFarm } from './1.4.ObjectFarm';
import { MapFarm } from './1.3.MapFarm';
import { ChainFarm } from './2.1.ChainFarm';

type Instance = ArrayFarm | ArrayOfObjectsFarm | ObjectFarm | MapFarm | ChainFarm;

const tests = [
    { name: 'ArrayFarm', cls: ArrayFarm },
    { name: 'ArrayOfObjectsFarm', cls: ArrayOfObjectsFarm },
    { name: 'ObjectFarm', cls: ObjectFarm },
    { name: 'MapFarm', cls: MapFarm },
    { name: 'ChainFarm', cls: ChainFarm },
];

describe.each(tests)('class $name:', ({ name, cls }) => {
    let farm: Instance;

    beforeEach(() => {
        farm = new cls();
    });

    it(`farm should be instanceof ${name}`, () => {
        expect(farm).toBeInstanceOf(cls);
    });

    it('should create first calve', () => {
        const cowId = farm.nextId();
        const name = 'First calve';
        const parentId = 0;

        const calve = farm.giveBirth(parentId, cowId, name);
        expect(calve).toEqual({ cowId, name, parentId });
    });

    it('should return valid cow count', () => {
        farm.giveBirth(0, 1, 'cow1');
        farm.giveBirth(0, 2, 'cow2');
        farm.giveBirth(0, 3, 'cow3');
        expect(farm.getSize()).toEqual(4);
    });

    it('should return valid cow list', () => {
        farm.giveBirth(0, 1, 'cow1');
        farm.giveBirth(1, 2, 'cow2');
        farm.giveBirth(2, 3, 'cow3');
        farm.endLifeSpan(2);

        const list = farm.getList();

        expect(list).toEqual([
            { cowId: 0, name: 'The Great Cow', parentId: Infinity },
            { cowId: 1, name: 'cow1', parentId: 0 },
            { cowId: 3, name: 'cow3', parentId: 2 },
        ]);
    });

    it('should return valid cow by ID', () => {
        farm.giveBirth(0, 1, 'cow1');
        farm.giveBirth(0, 2, 'cow2');
        farm.giveBirth(2, 3, 'cow3');
        expect(farm.getCowById(2)).toEqual({ cowId: 2, name: 'cow2', parentId: 0 });
    });

    it('should return null for non-existing cow', () => {
        farm.giveBirth(0, 1, 'cow1');
        expect(farm.getCowById(22222)).toBeNull;
    });

    it('should throw an error for duplicate cowId', () => {
        farm.giveBirth(0, 10, 'cow1');
        const fn = () => farm.giveBirth(0, 10, 'duplicate');
        expect(fn).toThrowError('already exists');
    });

    it('should throw an error for non-existing parent', () => {
        const fn = () => farm.giveBirth(100, 1, 'invalid parent id');
        expect(fn).toThrowError('Parent cow with ID 100 does not exist');
    });

    it('should throw an error for non-existing cow when deleting', () => {
        const fn = () => farm.endLifeSpan(100);
        expect(fn).toThrowError('Cow with ID 100 not found!');
    });
});
