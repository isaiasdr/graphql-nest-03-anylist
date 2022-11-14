import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ItemsModule } from './items/items.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';
import { ListitemModule } from './listitem/listitem.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    /* GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // debug: false,
      playground: false,
      autoSchemaFile: join( process.cwd(), 'src/schema.gql'),
      plugins: [
        ApolloServerPluginLandingPageLocalDefault
      ]
    }), */

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ AuthModule,  ],
      inject: [ JwtService ],
      useFactory: async ( jwtService: JwtService ) => ({
        playground: false,
        // debug: false,
        autoSchemaFile: join( process.cwd(), 'src/schema.gql'),
        plugins: [
          ApolloServerPluginLandingPageLocalDefault
        ],
        context({ req }) {
          const token = req.headers.authorization?.replace('Bearer ', '');
          
          if( !token ) throw new Error('Token Needed');

          const payload = jwtService.decode( token );

          if ( !payload ) throw new Error('Payload not valid');

          /* jwtService.verify( token ); */
        }
      }),
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username:process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    
    ItemsModule,
    
    UsersModule,
    
    AuthModule,
    
    SeedModule,
    
    CommonModule,
    
    ListsModule,
    
    ListitemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
