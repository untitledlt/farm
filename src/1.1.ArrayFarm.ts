import { Farm, CowType } from './BaseFarm';

type State = string[];
type ParentMap = (number | undefined)[];

export class ArrayFarm extends Farm {
    private _id = 0;
    private state: State = [];
    private parentMap: ParentMap = [];

    constructor() {
        super();
        // create first cow
        this.giveBirth(Infinity, this.nextId(), 'The Great Cow');
        this._hasFirstCow = true;
    }

    private findCowById(cowId: number) {
        if (this.state[cowId] && typeof this.parentMap[cowId] !== 'undefined') {
            return {
                cowId,
                name: this.state[cowId],
                parentId: this.parentMap[cowId]!,
            };
        }
    }

    public getCowById(cowId: number): CowType | null {
        return this.findCowById(cowId) || null;
    }

    hasCow(cowId: number) {
        return !!this.state[cowId];
    }

    giveBirth(parentId: number, cowId: number, name: string) {
        this.validateBirthInput(parentId, name, cowId);

        this.parentMap[cowId] = parentId;
        this.state[cowId] = name;
        return { parentId, cowId, name };
    }

    endLifeSpan(cowId: number) {
        if (!this.hasCow(cowId)) {
            throw new Error(`Cow with ID ${cowId} not found!`);
        }

        delete this.state[cowId];
        delete this.parentMap[cowId];
    }

    getList(): CowType[] {
        return Object.entries(this.state).map(([cowId, name]) => ({
            cowId: +cowId,
            name,
            parentId: this.parentMap[+cowId]!,
        }));
    }

    getSize() {
        return this.state.filter(Boolean).length;
    }

    nextId() {
        return this._id++;
    }
}
