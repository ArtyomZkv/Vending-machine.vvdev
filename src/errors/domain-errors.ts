export class DomainError extends Error {
    public readonly status: number;
    public readonly field?: string;

    constructor(message: string, status: number, field?: string) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);

        this.status = status;
        if (field !== undefined)
            this.field = field;
    }
}

export class MachineBrokenError extends DomainError {
    constructor() {
        super('Machine is broken. Cannot perform this operation.', 409);
    }
}

export class SlotNotFoundError extends DomainError {
    constructor(slotId: number, field?: string) {
        super(`Slot with ID ${slotId} not found.`, 404, field);
    }
}

export class OutOfStockError extends DomainError {
    constructor(slotId: number) {
        super(`Slot with ID ${slotId} is out of stock.`, 409);
    }
}

export class SpoiledProductError extends DomainError {
    constructor(slotId: number) {
        super(`Product in slot with ID ${slotId} is expired.`, 409);
    }
}

export class InsufficientCreditError extends DomainError {
    constructor(requiredCredit: number, currentCredit: number) {
        super(`Insufficient credit. Required: ${requiredCredit}, Current: ${currentCredit}.`, 402);
    }
}

export class ValidationError extends DomainError {
    constructor(message: string, field?: string) {
        super(message, 400, field);
    }
}
