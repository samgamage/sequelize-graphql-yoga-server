import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';
import path from 'path';

import models from './models';

// get typeDefs from .graphql file
const typeDefs = importSchema(path.join(__dirname, './schema/schema.graphql'));

// get resolvers from resolvers folder
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const server = new GraphQLServer({ typeDefs, resolvers });

models.sequelize.sync().then(() => {
  server.start(({ port }) => console.log(`Server is running on localhost:${port}`));
});
