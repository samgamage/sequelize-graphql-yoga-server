import { PubSub } from 'graphql-yoga';
import formatErrors from '../formatErrors';
import { tryLogin } from '../auth';

const pubsub = new PubSub();

const NEW_USER = 'NEW_USER';

export default {
  Subscription: {
    newUser: {
      subscribe: () => pubsub.asyncIterator(NEW_USER),
    },
  },
  Query: {
    allUsers: (_, args, { models }) => models.User.findAll(),
    getUser: (_, { id }, { models }) => models.User.findOne({ where: { id } }),
  },
  Mutation: {
    login: (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      tryLogin(email, password, models, SECRET, SECRET2),
    register: async (_, args, { models, user }) => {
      try {
        console.log(user);
        const newUser = await models.User.create(args);

        pubsub.publish(NEW_USER, {
          newUser: {
            ...args,
          },
        });

        return {
          ok: true,
          newUser,
        };
      } catch (err) {
        return {
          ok: false,
          error: formatErrors(err, models),
        };
      }
    },
  },
};
