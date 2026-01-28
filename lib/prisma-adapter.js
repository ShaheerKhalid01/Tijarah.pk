import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function PrismaAdapter(p = prisma) {
  return {
    async createUser(data) {
      return p.user.create({ data });
    },
    async getUser(id) {
      return p.user.findUnique({ where: { id } });
    },
    async getUserByEmail(email) {
      return p.user.findUnique({ where: { email } });
    },
    async getUserByAccount(provider_providerAccountId) {
      const account = await p.account.findUnique({
        where: { provider_providerAccountId },
        select: { user: true },
      });
      return account?.user ?? null;
    },
    async updateUser(data) {
      return p.user.update({ where: { id: data.id }, data });
    },
    async deleteUser(id) {
      return p.user.delete({ where: { id } });
    },
    async linkAccount(data) {
      return p.account.create({ data });
    },
    async unlinkAccount(provider_providerAccountId) {
      return p.account.delete({ where: { provider_providerAccountId } });
    },
    async getSessionAndUser(sessionToken) {
      const userAndSession = await p.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!userAndSession) return null;
      const { user, ...session } = userAndSession;
      return { user, session };
    },
    async createSession(data) {
      return p.session.create({ data });
    },
    async updateSession(data) {
      return p.session.update({
        where: { sessionToken: data.sessionToken },
        data,
      });
    },
    async deleteSession(sessionToken) {
      return p.session.delete({ where: { sessionToken } });
    },
    async createVerificationToken(data) {
      return p.verificationToken.create({ data });
    },
    async useVerificationToken(identifier_token) {
      try {
        return await p.verificationToken.delete({
          where: { identifier_token },
        });
      } catch (error) {
        if (error.code === 'P2025') return null;
        throw error;
      }
    },
  };
}
