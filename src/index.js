import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';
import jwt from 'jsonwebtoken';
import path from 'path';

import { refreshTokens } from './auth';
import models from './models';

// define secrets
const SECRET = 'asdmklmflkmlkm121kl23maks';
const SECRET2 = 'asdmklmflkmlkm121kl23maksasdasdlkm';

// get typeDefs from .graphql file
const typeDefs = importSchema(path.join(__dirname, './schema/schema.graphql'));

// get resolvers from resolvers folder
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const context = req => ({
  models,
  user: req.user,
  SECRET,
  SECRET2,
});

// passing in the context as an object makes it undefined
// solution: pass in the context as a function with the request
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context,
});

const addUser = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

server.express.use(addUser);

models.sequelize.sync().then(() => {
  server.start({ port: 8060 }, ({ port }) =>
    console.log(
      `========================================\n🚀  Server is running on localhost:${port}\n========================================`,
    ));
});
