import { Request, Response, NextFunction } from "express";
import { JwtAdapter } from "../../config/jwt.adapter";
import { prisma } from '../../data/postgres';


export class AuthMiddleware {
    static async validarToken(req: Request, res: Response, next: NextFunction) {
        const authorization = req.header('Authorization');
        
        if (!authorization) return res.status(401).json({ error: 'Not token provided' });
        if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid Bearer token' });
        
        const jwtToken = authorization.split(' ').at(1) || req.header("jwt_token");
        if (!jwtToken) return res.status(401).json("You are not authorized :(");
        
        try {
            
            const payload = await JwtAdapter.validateToken<{ id: string }>(jwtToken);
            if (!payload) return res.status(401).json({ error: 'Token invalido' });
            
            const user = await prisma.user.findUnique({ where: { id: +payload.id } });
            if (!user) return res.status(401).json({ error: 'Invalid token - user' });
            
            if (req.body.rol !== "ADMIN"){
                const {password, ...usuario} = user
                req.body.user = usuario;
                return next();
            }
            if (user.rol !== "ADMIN"){
                return res.status(401).json("No tienes permiso para ejecutar esta acción")
            }
            const {password, ...usuario} = user

            req.body.user = usuario;
            next();
    
        } catch (error) {
            console.log(error);
            return res.status(401).json({ error: "You are not authorized :(" });
        }
    }
}

