// import GoogleProvider from 'next-auth/providers/google'
// import connectedDB from '@/config/database'
// import User from '@/models/User'

// export const authOptions= {
//     providers:[
//         GoogleProvider({
//           clientId:process.env.GOOGLE_CLIENT_ID,
//           clientSecret:process.env.GOOGLE_CLIENT_SECRET,
//           authorization:{
//             params:{
//                 prompt:'consent',
//                 access_type:'offline',
//                 response_type:'code',
//             },
//           },
//           httpOptions:{
//             timeout:100000,
//           },  
//         }),
//     ],
//     session:{
//         strategy:'jwt',
//     },

//     callbacks:{
//         async signIn({profile}){
//             await connectedDB()
//             const existingUser = await User.findOne({ email:profile.email});

//             if(!existingUser){
//                 const [firstName, ...rest] = profile.name.split(' ');

//                 await User.create({
//                     email:profile.email,
//                     firstName,
//                     lastName:rest.join(' '),
//                     image:profile.picture,
//                     role:'user',
//                 });
//             }
//             return true;
//         },
//         async jwt({token}){
//             await connectedDB();

//             const dbUser = await User.findOne({email: token.email});

//             token.id = dbUser?._id?.toString();
//             token.role = dbUser.role || 'User';

//             return token;
//         },
//         async session({session, token}){
//             session.user.id = token.id
//             session.user.role = token.role;
//             return session;
//         },
//     },
//     pages: {
//         signIn:'/login',
//     },
//     secret:process.env.NEXTAUTH_SECRET,
// };



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
        if (!user) {
          throw new Error('No user found with this email');
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          image: user.image,
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
          });
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      await connectedDB();

      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
      } else {
        const dbUser = await User.findOne({ email: token.email });
        token.id = dbUser?._id?.toString();
        token.role = dbUser?.role || 'user';
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};
