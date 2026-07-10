import type { Slot } from "./slot.js";

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
            throw new Error('Machine is broken. Cannot restock slots.');
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
            throw new Error('Machine is broken. Cannot insert credit.');
        }

        this.credit += amount;
        
        return this.credit;
    }

    public buyProduct(slotId: number): BuyProductResult {
        if(this.status === 'broken') {
            throw new Error('Machine is broken. Cannot buy product.');
        }
        const currentSlot = this.slots.find(s => s.id === slotId);
        
        if(!currentSlot) throw new Error('Slot not found.');
        
        if(currentSlot.stock === 0) throw new Error('Slot is out of stock.');
        
        if(currentSlot.freshness === 0) throw new Error('Product is expired.');
        
        if(this.credit < currentSlot.price) throw new Error('Insufficient credit.');

        this.credit -= currentSlot.price;
        this.revenue += currentSlot.price;
        currentSlot.stock -= 1;
        return { credit: this.credit, slot: {...currentSlot} };
    }

    public maintain(): MaintainResult {
        if(this.status === 'broken') {
            throw new Error('Machine is broken. Cannot perform maintenance.');
        }
        this.temperature = Math.max(0, this.temperature - 30);
        return { temperature: this.temperature, status: this.status };
    }
}