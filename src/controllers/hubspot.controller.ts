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

        const mapped = tickets.map((t: any) => ({
            id: t.id,
            title: t.properties.subject,
            description: t.properties.content,
            status: mapStatus(t.properties.hs_pipeline_stage),
            priority: mapPriority(t.properties.hs_ticket_priority),
            createdAt: t.properties.createdate,
            updatedAt: t.properties.lastmodifieddate,
        }))
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

const mapStatus = (hsStage: string): "pendiente" | "Esperando respuesta Cliente" | "Working N1" => {
    switch (hsStage) {
        case "1132922631":
            return "pendiente";
        case "1132922632":
            return "Esperando respuesta Cliente";
        case "1132922633":
            return "Working N1";
        default:
            return "pendiente";
    }
};

const mapPriority = (p: string): "baja" | "media" | "alta" | "critica" => {
    switch (p) {
        case "LOW": return "baja";
        case "MEDIUM": return "media";
        case "HIGH": return "alta";
        case "URGENT": return "critica";
        default: return "media";
    }
};
