import 'reflect-metadata';
import { createConnection } from 'typeorm';

import * as express from 'express';
import * as session from 'express-session';
import { ApolloServer } from 'apollo-server-express';

import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
  });

  await createConnection();

  const app = express();
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: 'ASecretKey'
    })
  );

  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: 'http://localhost:3000'
    }
  });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
