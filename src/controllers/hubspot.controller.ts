import { Request, Response } from "express";
import * as hubspot from "../services/hubspot.service";

export const create = async (req: Request, res: Response) => {
    const { title, content } = req.body;
    try {
        const result = await hubspot.createTicket(title, content);
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: "Error creating ticket" });
    }
};

export const list = async (_: Request, res: Response) => {
    try {
        const tickets = await hubspot.getTickets();
        res.json(tickets);
    } catch {
        res.status(500).json({ error: "Failed to retrieve tickets" });
    }
};

export const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await hubspot.updateTicketStatus(id, status);
        res.json(result);
    } catch {
        res.status(500).json({ error: "Failed to update ticket" });
    }
};
