type CompareFunction<OperandType> = (a: OperandType, b: OperandType) => number;

export function findInsertIndex<ItemType>(newItem: ItemType, items: Array<ItemType>, compare: CompareFunction<ItemType>) {
    let i = items.length - 1;
    while (i >= 0) {
        const sign = compare(newItem, items[i]);
        if (sign >= 0) {
            // If the item goes "later" according to the comparison function,
            //  it stays here.
            break;
        }
        i -= 1;
    }
    return i + 1;
};

export class BoundedSet<ItemType> {
    private limit: number;
    private compare: CompareFunction<ItemType>;
    private items: Array<ItemType>;

    constructor(limit: number, compare: CompareFunction<ItemType>) {
        this.limit = limit;
        this.compare = compare;
        this.items = new Array<ItemType>();
    }

    addItem(item: ItemType) {
        // Find the index at which to insert the item - since we prefer
        //  pre-existing items over new ones, we insert new "equal" items
        //  at the end and cut them off as needed.
        const splicePosition = findInsertIndex(item, this.items, this.compare);
        this.items.splice(splicePosition, 0, item);
        const expungedItems = this.items.slice(this.limit);
        this.items = this.items.slice(0, this.limit);
        return expungedItems;
    }

    getItems() {
        return this.items.slice();
    }
};
