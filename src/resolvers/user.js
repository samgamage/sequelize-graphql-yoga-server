export default {
  Query: {
    allUsers: (_, args, { models }) => models.User.findAll(),
    getUser: (_, { id }, { models }) => models.User.findOne({ where: { id } }),
  },
  Mutation: {
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
        };
      }
    },
  },
};
