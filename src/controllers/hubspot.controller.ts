import { Request, Response } from "express";
import * as hubspot from "../services/hubspot.service";


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

export const create = async (req: Request, res: Response) => {
    const { title, content } = req.body;
    try {
        const result = await hubspot.createTicket(title, content);
        res.json(result);
    } catch (e) {
        console.error('Error creating ticket:', e);
        res.status(500).json({ error: "Error creating ticket" });
    }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    console.log("Obteniendo tickets de HubSpot...");
    const raw = await hubspot.getTickets();

    const filtered = raw.results.filter((t: any) =>
      t.properties.hs_pipeline === "775401867"
    );

    console.log("Tickets del pipeline correcto:", filtered.length);

    const tickets = filtered.map((t: any) => ({
      id: t.id,
      title: t.properties.subject,
      description: t.properties.content,
      status: mapStatus(t.properties.hs_pipeline_stage),
      priority: mapPriority(t.properties.hs_ticket_priority),
      createdAt: t.properties.createdate,
      updatedAt: t.properties.hs_lastmodifieddate,
      category: "general",
      createdBy: "system",
    }));

    console.log("Tickets mapeados:", tickets.length);
    res.json({ results: tickets });
  } catch (err) {
    console.error("Error al obtener tickets desde HubSpot", err);
    res.status(500).json({ error: "Error al obtener tickets" });
  }
};


export const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await hubspot.updateTicketStatus(id, status);
        res.json(result);
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).json({ error: "Failed to update ticket" });
    }
};