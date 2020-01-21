import { IResolvers } from 'apollo-server-express';
import * as argon2 from 'argon2';
import { User } from './entity/User';

export const resolvers: IResolvers = {
  Query: {
    me(_, __, { req }) {
      if (!req.session.userId) {
        return null;
      }

      return User.findOne(req.session.userId);
    }
  },
  Mutation: {
    async register(_, { email, username, password }) {
      const hashedPassword = await argon2.hash(password);

      await User.create({
        email,
        username,
        password: hashedPassword
      }).save();

      return true;
    },

    async login(_, { email, password }, { req }) {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return null;
      }

      const valid = await argon2.verify(user.password, password);

      if (!valid) {
        return null;
      }

      req.session.userId = user.id;

      return user;
    }
  }
};
