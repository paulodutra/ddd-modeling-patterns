import Address from './Address';

const EMPTY = 0;
export default class Customer {
    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this.validate();
    }

    validate() {
        if (this._id.length === EMPTY) {
            throw new Error("Id is required");
        }
        if (this._name.length === EMPTY) {
            throw new Error("Name is required");
        }
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get rewardPoints() : number {
        return this._rewardPoints;
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    changeAddress(address: Address) {
        this.Address = address;
    }

    isActive(): boolean {
        return this._active;
    }

    activate() {
        if (this._address === undefined) {
            throw new Error("Address is mandatory to activate a customer");
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }

    set Address (address: Address) {
        this._address = address;
    }

    get Address(): Address {
        return this._address;
    }

}