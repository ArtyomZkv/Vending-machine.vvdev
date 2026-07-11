import { Router } from 'express';
import { machine } from '../state.js';
import { ValidationError } from '../errors/domain-errors.js';

const router = Router();

function requireNumber(value: unknown, field: string): number {
    if (value === undefined) throw new ValidationError(`${field} is required`, field);
    if (typeof value !== 'number') throw new ValidationError(`${field} must be a number`, field);
    return value;
}

router.get('/machine', (req, res) => {
    res.json({ machine: machine.currentState });
});

router.post('/machine/insert', (req, res) => {
    const amount = requireNumber(req.body.amount, 'amount');

    if (amount <= 0) throw new ValidationError('Amount must be greater than 0', 'amount');

    const credit = machine.insertCredit(amount);
    res.json({ credit: credit });
});

router.post('/machine/restock', (req, res) => {
    const id = requireNumber(req.body.id, 'id');
    const price = requireNumber(req.body.price, 'price');
    const stock = requireNumber(req.body.stock, 'stock');
    const product = req.body.product;

    if(product === undefined) throw new ValidationError('Product is required', 'product');
    if (typeof product !== 'string') throw new ValidationError('Product must be a string', 'product');
    if(product.trim().length === 0) throw new ValidationError('Product cannot be empty', 'product');
    
    if(id <= 0) throw new ValidationError('Id must be greater than 0', 'id');

    if(price <= 0) throw new ValidationError('Price must be greater than 0', 'price');

    if(stock < 0) throw new ValidationError('Stock cannot be negative', 'stock');

    machine.restockSlot({ id, price, stock, product});
    res.json({ machine: machine.currentState });
});

router.post('/machine/select', (req, res) => {
    const id = requireNumber(req.body.slotId, 'slotId');

    if(id <= 0) throw new ValidationError('slotId must be greater than 0', 'slotId');

    const result = machine.buyProduct(id);
    res.json({ result: result });
});

router.post('/machine/maintain', (req, res) => {

    const result = machine.maintain();
    res.json({ result: result });
})

export default router;