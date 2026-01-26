import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info, context) {
        
        // Si hay error o no hay usuario, simplemente retornamos null
        // pero no lanzamos error para permitir acceso público

        return user || null
    }
}