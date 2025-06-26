import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access token missing' });
    console.log("Token recebido no middleware:", token);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        console.log("Usuário autenticado no middleware:", user);
        req.user = user;
        next();
    });
};

export const authorizeAdmin = (req, res, next) => {
    console.log("Role recebido no middleware:", req.user.role);
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado: admin only' });
    }
    next();
};
