export type CowType = {
    cowId: number;
    name: string;
    parentId: number;
};

export class Farm {
    _hasFirstCow = false;

    validateBirthInput(parentId: number, name: string, cowId: number): void {
        if (typeof cowId !== 'number' || cowId < 0) {
            throw new Error('cowId must be a positive number');
        }

        if (typeof parentId !== 'number' || parentId < 0) {
            throw new Error('parentId must be a positive number');
        }

        if (typeof name !== 'string' || !name) {
            throw new Error('name must be a non-empty string');
        }

        if (cowId === parentId) {
            throw new Error("Cow's parent can not be the same cow");
        }

        if (this.hasCow(cowId)) {
            throw new Error(`Cow with ID ${cowId} already exists`);
        }

        // _hasFirstCow is used to skip parentId validation for first cow
        if (this._hasFirstCow && !this.hasCow(parentId)) {
            throw new Error(`Parent cow with ID ${parentId} does not exist`);
        }
    }

    public print() {
        this.getList().forEach(cow => {
            const { cowId, name, parentId } = cow;
            console.log(`${cowId}. ${name} [${parentId}]`);
        });
    }

    hasCow(cowId: number): boolean {
        throw new Error('hasCow method must be overwritten in child class');
    }

    public getList(): CowType[] {
        throw new Error('getList method must be overwritten in child class');
    }
}
