import prisma from "../models/prismaClient.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config()

const messages ={
    userNotFound: "Usuário não encontrado",
    invalidPassword: "Senha inválida",
    emailExists: "E-mail ou senha já cadastrado",
    invalidCredentials: "Credenciais inválidas",
    userNotFoundForToken: "Usuário não encontrado para o token fornecido",
    userCreated: "Usuário criado com sucesso",
    loginSuccess: "Login realizado com sucesso",
}


    export const  createUser = async (req, res) => {
        const {name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
        } 
        try {
            const normalizedEmail = email.toLowerCase();
            const existingUser = await prisma.user.findUnique({
                where: { email: normalizedEmail }
            });

            if (existingUser) {
                return res.status(400).json({ error: messages.emailExists });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email: normalizedEmail,
                    password: hashedPassword
                }
            });

            res.status(201).json({ message: messages.userCreated, user: newUser });
        } catch (error) {
            res.status(500).json({ error: "Erro ao criar usuário" });
        }
    }
    export const login = async (req, res)=> {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
        }

        try {
            const normalizedEmail = email.toLowerCase();
            const user = await prisma.user.findUnique({
                where: { email: normalizedEmail }
            });

            if (!user) {
                return res.status(404).json({ error: messages.userNotFound });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: messages.invalidPassword });
            }

            const token = jwt.sign({ id: user.id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: messages.loginSuccess, token });
        } catch (error) {
            res.status(500).json({ error: "Erro ao realizar login" });
        }
    }
 export const getUser =async (req, res)=> {
        const userId = req.user.id; // Assuming user ID is stored in req.user by the auth middleware
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, name: true, email: true }
            });

            if (!user) {
                return res.status(404).json({ error: messages.userNotFoundForToken });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar usuário" });
        }
    }
   export const  updatePassword= async (req, res) => {
        const userId = req.user.id; // Assuming user ID is stored in req.user by the auth middleware
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "Senha antiga e nova são obrigatórias" });
        }

        try {
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                return res.status(404).json({ error: messages.userNotFound });
            }

            const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isOldPasswordValid) {
                return res.status(401).json({ error: messages.invalidCredentials });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedNewPassword }
            });

            res.status(200).json({ message: "Senha atualizada com sucesso" });
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar senha" });
        }
    }
