import { CowType, Farm } from './BaseFarm';

type ChainCowType = {
    prevCow: ChainCowType | null;
    nextCow: ChainCowType | null;
};

type CowOptions = {
    cowId: number;
    name: string;
    parentId: number;
    prevCow: ChainCow | null;
};

class ChainCow {
    prevCow: ChainCow | null = null;
    nextCow: ChainCow | null = null;
    cowId: number;
    name: string;
    parentId: number;

    constructor(options: CowOptions) {
        const { cowId, name, parentId, prevCow } = options;
        this.cowId = cowId;
        this.name = name;
        this.parentId = parentId;
        this.prevCow = prevCow;
    }
}

export class ChainFarm extends Farm {
    constructor() {
        super();
        this._hasFirstCow = true;
    }

    private rootCow = new ChainCow({
        cowId: 0,
        name: 'The Great Cow',
        parentId: Infinity,
        prevCow: null,
    });

    private lastCow: ChainCow = this.rootCow;

    private findCowById(cowId: number) {
        let cow = this.rootCow;
        while (cow.nextCow && cow.cowId !== cowId) {
            cow = cow.nextCow;
        }

        if (cow.cowId === cowId) {
            return cow;
        }
    }

    public getCowById(cowId: number): CowType | null {
        const cow = this.findCowById(cowId);
        if (cow) {
            const { cowId, name, parentId } = cow;
            return { cowId, name, parentId };
        }
        return null;
    }

    hasCow(cowId: number) {
        return !!this.findCowById(cowId);
    }

    giveBirth(parentId: number, cowId: number, name: string) {
        this.validateBirthInput(parentId, name, cowId);
        const cow = new ChainCow({ cowId, name, parentId, prevCow: this.lastCow });
        this.lastCow.nextCow = cow;
        this.lastCow = cow;
        return { cowId, name, parentId };
    }

    endLifeSpan(cowId: number) {
        const cow = this.findCowById(cowId);
        if (!cow) {
            throw new Error(`Cow with ID ${cowId} not found!`);
        }

        // keep refs
        const prevCow = cow.prevCow;
        const nextCow = cow.nextCow;

        // special case for very last cow
        if (!prevCow && !nextCow) {
            throw new Error('Trying to delete the very last cow');
        }

        // update prev cow
        if (prevCow?.nextCow) {
            prevCow.nextCow = nextCow;
        } else {
            // if there is no prevCow, it means we're deleting a first cow
            // @ts-expect-error
            this.rootCow = nextCow;
        }

        // update next cow
        if (nextCow?.prevCow) {
            nextCow.prevCow = prevCow;
        }

        // @ts-expect-error deletion of very last cow will be handled above
        this.lastCow = nextCow || prevCow;
    }

    getList() {
        const cowList = [];
        let cow: ChainCow | null = this.rootCow;

        while (cow) {
            const { cowId, name, parentId } = cow;
            cowList.push({ cowId, name, parentId });
            cow = cow.nextCow;
        }

        return cowList;
    }

    getSize() {
        return this.getList().length;
    }

    nextId() {
        return this.lastCow.cowId + 1;
    }
}
