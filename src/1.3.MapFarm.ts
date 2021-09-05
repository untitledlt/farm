import { CowType, Farm } from './BaseFarm';

type Cow = {
    name: string;
    parentId: number;
};

export class MapFarm extends Farm {
    private _id = 0;
    private state = new Map<number, Cow>();

    constructor() {
        super();
        // create first cow
        this.giveBirth(Infinity, this.nextId(), 'The Great Cow');
        this._hasFirstCow = true;
    }

    private findCowById(cowId: number) {
        const cow = this.state.get(cowId);
        if (cow) {
            return { cowId, ...cow };
        }
    }

    public getCowById(cowId: number): CowType | null {
        return this.findCowById(cowId) || null;
    }

    hasCow(cowId: number) {
        return this.state.has(cowId);
    }

    giveBirth(parentId: number, cowId: number, name: string) {
        this.validateBirthInput(parentId, name, cowId);

        const calve = { name, parentId };
        this.state.set(cowId, calve);
        return { cowId, ...calve };
    }

    endLifeSpan(cowId: number) {
        const deleted = this.state.delete(cowId);

        if (!deleted) {
            throw new Error(`Cow with ID ${cowId} not found!`);
        }
    }

    getList(): CowType[] {
        return [...this.state].map(([cowId, { name, parentId }]) => ({ cowId, name, parentId }));
    }

    getSize() {
        return this.state.size;
    }

    nextId() {
        return this._id++;
    }
}
