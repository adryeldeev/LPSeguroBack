import prisma from "../models/prismaClient.js";
import { sendEmail } from "../utils/sendEmail.js";


// Function to get all leads
export const getLeads = async (req, res) => {
    try {
        const leads = await prisma.lead.findMany();
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch leads" });
    }
};
// Function to add a new lead
export const addLead = async (req, res) => {
    const { nome, telefone, tipoAcidente,cidade, dataAcidente  } = req.body;
    try {
       const newLead = await prisma.lead.create({
            data: {
                nome,
                telefone,
                tipoAcidente,
                cidade,
                dataAcidente: dataAcidente ? new Date(dataAcidente) : null // Convert to Date if provided

            }
        });

        // Enviar e-mail
        await sendEmail({
            to: process.env.EMAIL_TO,
            subject: "Novo Lead - 4S Seguros",
            html: `
                <h2>Novo Lead Recebido</h2>
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>Telefone:</strong> ${telefone}</p>
                <p><strong>Tipo de Acidente:</strong> ${tipoAcidente}</p>
                <p><strong>Cidade:</strong> ${cidade}</p>
                <p><strong>Data do Acidente:</strong> ${dataAcidente ? new Date(dataAcidente).toLocaleDateString() : 'Não informado'}</p>
                <p>Por favor, entre em contato com o lead o mais rápido possível.</p>
            `
        });

        res.status(201).json(newLead);
       
    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).json({ error: "Failed to create lead" });
    }
};
// Function to update a lead by ID
export const updateLead = async (req, res) => {
    const { id } = req.params;
    const { nome, telefone, tipoAcidente, cidade, dataAcidente } = req.body;

    try {
        const data = {}
        if (nome) data.nome = nome;
        if (telefone) data.telefone = telefone;
        if (tipoAcidente) data.tipoAcidente = tipoAcidente;
        if (cidade) data.cidade = cidade;
        if (dataAcidente) data.dataAcidente = new Date(dataAcidente); // Convert to Date if provided
        const updatedLead = await prisma.lead.update({
            where: { id: parseInt(id) },
            data: {
                ...data
            }
        });
        res.status(200).json(updatedLead);
    } catch (error) {
        res.status(500).json({ error: "Failed to update lead" });
    }
};
// Function to delete a lead by ID
export const deleteLead = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.lead.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ error: "Failed to delete lead" });
    }
};

