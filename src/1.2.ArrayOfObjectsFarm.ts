import { CowType, Farm } from './BaseFarm';

export class ArrayOfObjectsFarm extends Farm {
    private _id = 0;
    private state: CowType[] = [];

    constructor() {
        super();
        // create first cow
        this.giveBirth(Infinity, this.nextId(), 'The Great Cow');
        this._hasFirstCow = true;
    }

    private findCowById(cowId: number) {
        // very slow
        return this.state.find(item => item.cowId === cowId);
    }

    public getCowById(cowId: number): CowType | null {
        return this.findCowById(cowId) || null;
    }

    hasCow(cowId: number) {
        return !!this.findCowById(cowId);
    }

    giveBirth(parentId: number, cowId: number, name: string) {
        this.validateBirthInput(parentId, name, cowId);

        const calve = { cowId, name, parentId };
        this.state.push(calve);
        return calve;
    }

    endLifeSpan(cowId: number) {
        const cow = this.findCowById(cowId);

        if (!cow) {
            throw new Error(`Cow with ID ${cowId} not found!`);
        }

        const index = this.state.indexOf(cow);
        delete this.state[index];
    }

    getList() {
        return [...this.state].filter(Boolean);
    }

    getSize() {
        return this.state.length;
    }

    nextId() {
        return this._id++;
    }
}
