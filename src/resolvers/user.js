import formatErrors from '../formatErrors';
import { tryLogin } from '../auth';

export default {
  Query: {
    allUsers: (_, args, { models }) => models.User.findAll(),
    getUser: (_, { id }, { models }) => models.User.findOne({ where: { id } }),
  },
  Mutation: {
    login: (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      tryLogin(email, password, models, SECRET, SECRET2),
    register: async (_, args, { models }) => {
      try {
        const user = await models.User.create(args);
        return {
          ok: true,
          user,
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
