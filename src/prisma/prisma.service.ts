import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    constructor() {
        super({
            log: process.env.NODE_ENV === 'development'
                ? ['query', 'info', 'warn', 'error']
                : ['error'],
            errorFormat: 'pretty',
        });
    }
    async onModuleInit() {
        await this.$connect();

        this.$use(async (params, next) => {
            const before = Date.now();
            const result = await next(params);
            const after = Date.now();

            console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
            return result;
        })

        this.$use(async (params, next) => {
            if (params.model === 'Match' && params.action === 'create') {
                console.log('Nuevo partido creado:', params.args.data);
            }
            return next(params);
        });
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    async transaction(callback: (tx: any) => Promise<any>) {
        return this.$transaction(callback);
    }

    async cleanDatabase() {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('No se puede limpiar la base de datos en producción')
        }

        const models = Reflect.ownKeys(this).filter((key) => typeof key === 'string' && key[0] !== '_');

        return Promise.all(
            models.map((modelKey) => {
                if (modelKey !== '$transaction' && modelKey !== '$connect' && modelKey !== '$disconnect') {
                    return this[modelKey].deleteMany({});
                }
            }),
        );
    }
}
