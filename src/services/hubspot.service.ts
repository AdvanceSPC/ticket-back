import axios from "axios";

const HUBSPOT_API = "https://api.hubapi.com/crm/v3/objects/tickets";
const HEADERS = {
    Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
    "Content-Type": "application/json"
};

export const createTicket = async (title: string, content: string) => {
    const payload = {
        properties: {
            subject: title,
            content,
            hs_pipeline: "775401867",
            hs_pipeline_stage: "1132922631"
        }
    };
    const res = await axios.post(HUBSPOT_API, payload, { headers: HEADERS });
    return res.data;
};

export const getTickets = async () => {
    const res = await axios.get(HUBSPOT_API, { headers: HEADERS });
    return res.data;
};

export const updateTicketStatus = async (id: string, newStatus: string) => {
    const payload = {
        properties: {
            hs_pipeline_stage: newStatus
        }
    };
    const res = await axios.patch(`${HUBSPOT_API}/${id}`, payload, { headers: HEADERS });
    return res.data;
};
