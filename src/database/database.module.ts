import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({ 
     imports: [ 
        TypeOrmModule.forRootAsync({      
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({        
                type: 'postgres',        
                host: configService.getOrThrow<string>('DATABASE_HOST'),
                port: configService.getOrThrow<number>('DATABASE_PORT'),
                username: configService.getOrThrow<string>('DATABASE_USER'),        
                password: configService.getOrThrow<string>('DATABASE_PASSWORD'), 
                database: configService.getOrThrow<string>('DATABASE_NAME'),        
                autoLoadEntities: true,        
                synchronize: true,      
            }),      
                
            inject: [ConfigService],    
        }),  
    ],
})
export class DatabaseModule {}
