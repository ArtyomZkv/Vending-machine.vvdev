import type { Slot } from "./slot.js";
import { MachineBrokenError, SlotNotFoundError, OutOfStockError, SpoiledProductError, InsufficientCreditError } from "../errors/domain-errors.js";

type MachineStatus = 'operational' | 'overheated' | 'broken';
type RestockSlot = Omit<Slot, 'freshness'>;
type BuyProductResult = { credit: number, slot: Slot };
type MaintainResult = { temperature: number, status: MachineStatus };

class Machine {
    private temperature: number;
    private credit: number;
    private revenue: number;

    private slots: Slot[];

    constructor() {
        this.temperature = 20;
        this.credit = 0;
        this.revenue = 0;
        this.slots = [];
    }

    get status(): MachineStatus {
        if(this.temperature <= 80)
            return 'operational';
        else if(this.temperature <= 100)
            return 'overheated';
        else
            return 'broken';
    }

    get currentState() {
        return {
            temperature: this.temperature,
            credit: this.credit,
            revenue: this.revenue,
            status: this.status,
            slots: [...this.slots]
        }
    }

    public restockSlot(slot: RestockSlot) {
        if(this.status === 'broken') {
            throw new MachineBrokenError();
        }

        const existingSlot = this.slots.find(s => s.id === slot.id);

        if (existingSlot) {
            existingSlot.price = slot.price;
            existingSlot.stock = slot.stock;
            existingSlot.product = slot.product;
            existingSlot.freshness = 100;
        }
        else {
            const currentSlot: Slot = {...slot, freshness: 100};
            this.slots.push(currentSlot);
        }
    }

    public insertCredit(amount: number): number {
        if(this.status === 'broken') {
            throw new MachineBrokenError();
        }

        this.credit += amount;
        
        return this.credit;
    }

    public buyProduct(slotId: number): BuyProductResult {
        if(this.status === 'broken') {
            throw new MachineBrokenError();
        }
        const currentSlot = this.slots.find(s => s.id === slotId);
        
        if(!currentSlot) throw new SlotNotFoundError(slotId);
        
        if(currentSlot.stock === 0) throw new OutOfStockError(slotId);
        
        if(currentSlot.freshness === 0) throw new SpoiledProductError(slotId);
        
        if(this.credit < currentSlot.price) throw new InsufficientCreditError(currentSlot.price, this.credit);

        this.credit -= currentSlot.price;
        this.revenue += currentSlot.price;
        currentSlot.stock -= 1;
        return { credit: this.credit, slot: {...currentSlot} };
    }

    public maintain(): MaintainResult {
        if(this.status === 'broken') {
            throw new MachineBrokenError();
        }
        this.temperature = Math.max(0, this.temperature - 30);
        return { temperature: this.temperature, status: this.status };
    }
}