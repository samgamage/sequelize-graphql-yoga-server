import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';
import path from 'path';

import models from './models';

// get typeDefs from .graphql file
const typeDefs = importSchema(path.join(__dirname, './schema/schema.graphql'));

// get resolvers from resolvers folder
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

// passing in the context as an object makes it undefined somehow
// solution: pass in the context as a function with the request
const server = new GraphQLServer({ typeDefs, resolvers, context: req => ({ ...req, models }) });

models.sequelize.sync().then(() => {
  server.start({ port: 8060 }, ({ port }) =>
    console.log(
      `========================================\n🚀  Server is running on localhost:${port}\n========================================`,
    ));
});
