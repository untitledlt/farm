import { CowType, Farm } from './BaseFarm';

type Cow = {
    name: string;
    parentId: number;
};

type State = Record<number, Cow>;

export class ObjectFarm extends Farm {
    private _id = 0;
    private state: State = {};

    constructor() {
        super();
        // create first cow
        this.giveBirth(Infinity, this.nextId(), 'The Great Cow');
        this._hasFirstCow = true;
    }

    private findCowById(cowId: number) {
        return this.state[cowId];
    }

    public getCowById(cowId: number): CowType | null {
        const cow = this.findCowById(cowId);
        if (cow) {
            return { cowId, ...cow };
        }
        return null;
    }

    giveBirth(parentId: number, cowId: number, name: string) {
        if (this.state[cowId]) {
            throw new Error(`Cow with ID ${cowId} already exists`);
        }

        const parent = this.findCowById(parentId);
        if (this._hasFirstCow && !parent) {
            throw new Error(`Parent cow with ID ${parentId} does not exist`);
        }

        const calve = { name, parentId };
        this.state[cowId] = calve;
        return { cowId, ...calve };
    }

    endLifeSpan(cowId: number) {
        const cow = this.findCowById(cowId);

        if (!cow) {
            throw new Error(`Cow with ID ${cowId} not found!`);
        }

        delete this.state[cowId];
    }

    getList(): CowType[] {
        return Object.entries(this.state).map(([cowId, { name, parentId }]) => ({
            cowId: +cowId,
            name,
            parentId,
        }));
    }

    getSize() {
        return Object.keys(this.state).length;
    }

    nextId() {
        return this._id++;
    }
}
