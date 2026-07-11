import type { Request, Response, NextFunction } from "express";
import { DomainError } from "../errors/domain-errors.js";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof DomainError) {
        res.status(err.status).json({ message: err.message, field: err.field });
        return;
    }

    if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400) {
        res.status(400).json({ message: 'Invalid JSON in request body' });
        return;
    }

    res.status(500).json({ message: 'Internal server error' });
}