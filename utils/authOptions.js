

import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectedDB from '@/config/database';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
      httpOptions: {
        timeout: 100000,
      },
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectedDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error('No user found with this email');

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) throw new Error('Invalid password');

        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,    
          lastName: user.lastName,
          role: user.role,
          image: user.image,
          isTrainee: user.isTrainee || false, 
        };
      }
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      await connectedDB();

      if (account.provider === 'google') {
        const existingUser = await User.findOne({ email: profile.email });

        if (!existingUser) {
          const [firstName, ...rest] = profile.name.split(' ');

          await User.create({
            email: profile.email,
            firstName,
            lastName: rest.join(' '),
            image: profile.picture,
            role: 'user',
            isTrainee: false, // ✅ default new Google users to not trainee
          });
        }
      }

      return true;
    },

  
      async jwt({ token, user }) {
    await connectedDB();
    if (user) {
      token.id = user.id || user._id?.toString();
      token.role = user.role;
      token.isTrainee = user.isTrainee || false;
      token.firstName = user.firstName;
      token.lastName = user.lastName;
    } else {
      const dbUser = await User.findOne({ email: token.email });
      token.id = dbUser?._id?.toString();
      token.role = dbUser?.role;
      token.isTrainee = dbUser?.isTrainee || false;
      token.firstName = dbUser?.firstName;
      token.lastName = dbUser?.lastName;
    }

    return token;
  },


    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.isTrainee = token.isTrainee; 
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};
