// // import GoogleProvider from 'next-auth/providers/google';
// // import CredentialsProvider from 'next-auth/providers/credentials';
// // import connectedDB from '@/config/database';
// // import User from '@/models/User';
// // import Trainee from '@/models/Trainee';
// // import bcrypt from 'bcryptjs';

// // export const authOptions = {
// //   providers: [
// //     GoogleProvider({
// //       clientId: process.env.GOOGLE_CLIENT_ID,
// //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //       authorization: {
// //         params: {
// //           prompt: 'consent',
// //           access_type: 'offline',
// //           response_type: 'code',
// //         },
// //       },
// //       httpOptions: {
// //         timeout: 100000,
// //       },
// //     }),

// //     CredentialsProvider({
// //       name: 'Credentials',
// //       credentials: {
// //         email: { label: "Email", type: "text", placeholder: "example@example.com" },
// //         password: { label: "Password", type: "password" },
// //       },
// //       async authorize(credentials) {
// //         await connectedDB();

// //         const user = await User.findOne({ email: credentials.email });
// //         if (!user) throw new Error('No user found with this email');

// //         const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
// //         if (!isPasswordCorrect) throw new Error('Invalid password');

// //         return {
// //           id: user._id.toString(),
// //           email: user.email,
// //           name: `${user.firstName} ${user.lastName}`,
// //           firstName: user.firstName,    
// //           lastName: user.lastName,
// //           role: user.role,
// //           image: user.image,
// //           isTrainee: user.isTrainee || false,
// //         };
// //       }
// //     }),
// //   ],

// //   session: {
// //     strategy: 'jwt',
// //   },

// //   callbacks: {
// //     async signIn({ user, account, profile }) {
// //       await connectedDB();

// //       if (account.provider === 'google') {
// //         let existingUser = await User.findOne({ email: profile.email });

// //         if (!existingUser) {
// //           const [firstName, ...rest] = profile.name?.split(' ') || ["User"];

// //           const newUser = await User.create({
// //             email: profile.email,
// //             firstName,
// //             lastName: rest.join(' '),
// //             image: profile.picture,
// //             role: 'user',
// //             isTrainee: false,
// //           });
// //           user = newUser;
// //         }
// //         if(existingUser?.isTrainee){
// //            let trainee = await Trainee.findOne({ user: existingUser._id });
// //            if(!trainee){
// //             trainee = await Trainee.create({
// //               user:existingUser._id,
// //               trainings:[],
// //             })
// //            } 
// //         }
// //       }

// //       return true;
// //     },

// //     async jwt({ token, user }) {
// //       await connectedDB();
// //       if (user) {
// //         const userId = user.id?.toString() || user._id?.toString();

// //         token.email = user.email;
// //         token.id = userId;
// //         token.role = user.role;
// //         token.isTrainee = !!user.isTrainee;
// //         token.firstName = user.firstName;
// //         token.lastName = user.lastName;
        
// //         if(user.isTrainee){
// //           const trainee = await Trainee.findOne({ user: user.id || user._id});
// //           token.traineeId = trainee?._id?.toString() || null;
// //           token.trainings = trainee?.trainings || [];
// //         } else{
// //           token.traineeId = null;
// //           token.trainings = [];
// //         }
// //       } else {
// //         const dbUser = await User.findOne({ email: token.email });
// //         if(dbUser){
// //           token.id = dbUser?._id?.toString();
// //           token.role = dbUser?.role;
// //           token.isTrainee = !!dbUser.isTrainee;
// //           token.firstName = dbUser?.firstName;
// //           token.lastName = dbUser?.lastName;

// //           if(dbUser?.isTrainee) {
// //             const trainee = await Trainee.findOne({ user: dbUser._id});
// //             token.traineeId = trainee?._id?.toString() || null;
// //             token.trainings = trainee?.trainings || [];
// //           } else {
// //             token.traineeId = null;
// //             token.trainings = [];
// //           }
// //         }
// //       }

// //       return token;
// //     },

// //     async session({ session, token }) {
// //       session.user.id = token.id;
// //       session.user.email = token.email;
// //       session.user.role = token.role;
// //       session.user.isTrainee = !!token.isTrainee; 
// //       session.user.firstName = token.firstName;
// //       session.user.lastName = token.lastName;
// //       session.user.trainings = token.trainings || [];
// //       session.user.traineeId = token.traineeId;
// //       return session;
// //     },

// //     async redirect({ url, baseUrl }) {
// //       // Prevent open redirect attacks
// //       if (url.startsWith('/')) {
// //         return `${baseUrl}${url}`;
// //       }
// //       // Only allow redirects to same origin
// //       if (new URL(url).origin === baseUrl) {
// //         return url;
// //       }
// //       // Default redirect to home
// //       return baseUrl;
// //     },
// //   },

// //   pages: {
// //     signIn: '/login',
// //     signOut: '/login',
// //     error: '/login',
// //   },

// //   secret: process.env.NEXTAUTH_SECRET,
// // };




// // utils/authOptions.js
// // import { GoogleProvider } from 'next-auth/providers/google';
// // import { CredentialsProvider } from 'next-auth/providers/credentials';
// const GoogleProvider = (await import("next-auth/providers/google")).default;
// const CredentialsProvider = (await import("next-auth/providers/credentials")).default;

// import connectedDB from '@/config/database';
// import User from '@/models/User';
// import Trainee from '@/models/Trainee';
// import bcrypt from 'bcryptjs';

// export const authOptions = {
//   providers: [
//     // Google OAuth
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       authorization: {
//         params: {
//           prompt: 'consent',
//           access_type: 'offline',
//           response_type: 'code',
//         },
//       },
//       httpOptions: {
//         timeout: 100000,
//       },
//     }),

//     // Email/password credentials
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'text', placeholder: 'example@example.com' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         await connectedDB();

//         const user = await User.findOne({ email: credentials.email });
//         if (!user) throw new Error('No user found with this email');

//         const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
//         if (!isPasswordCorrect) throw new Error('Invalid password');

//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: `${user.firstName} ${user.lastName}`,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           role: user.role,
//           image: user.image,
//           isTrainee: user.isTrainee || false,
//         };
//       },
//     }),
//   ],

//   session: {
//     strategy: 'jwt',
//   },

//   callbacks: {
//     // SignIn callback handles Google signup and Trainee creation
//     async signIn({ user, account, profile }) {
//       await connectedDB();

//       if (account?.provider === 'google') {
//         let existingUser = await User.findOne({ email: profile.email });

//         if (!existingUser) {
//           const [firstName, ...rest] = profile.name?.split(' ') || ['User'];
//           const newUser = await User.create({
//             email: profile.email,
//             firstName,
//             lastName: rest.join(' '),
//             image: profile.picture,
//             role: 'user',
//             isTrainee: false,
//           });
//           user = newUser;
//         }

//         // Ensure Trainee document exists if user is a trainee
//         if (existingUser?.isTrainee) {
//           let trainee = await Trainee.findOne({ user: existingUser._id });
//           if (!trainee) {
//             trainee = await Trainee.create({
//               user: existingUser._id,
//               trainings: [],
//             });
//           }
//         }
//       }

//       return true;
//     },

//     // JWT callback populates token with user & trainee data
//     async jwt({ token, user }) {
//       await connectedDB();

//       if (user) {
//         const userId = user.id?.toString() || user._id?.toString();

//         token.id = userId;
//         token.email = user.email;
//         token.role = user.role;
//         token.isTrainee = !!user.isTrainee;
//         token.firstName = user.firstName;
//         token.lastName = user.lastName;

//         if (user.isTrainee) {
//           const trainee = await Trainee.findOne({ user: userId });
//           token.traineeId = trainee?._id?.toString() || null;
//           token.trainings = trainee?.trainings || [];
//         } else {
//           token.traineeId = null;
//           token.trainings = [];
//         }
//       } else {
//         const dbUser = await User.findOne({ email: token.email });
//         if (dbUser) {
//           token.id = dbUser._id.toString();
//           token.role = dbUser.role;
//           token.isTrainee = !!dbUser.isTrainee;
//           token.firstName = dbUser.firstName;
//           token.lastName = dbUser.lastName;

//           if (dbUser.isTrainee) {
//             const trainee = await Trainee.findOne({ user: dbUser._id });
//             token.traineeId = trainee?._id?.toString() || null;
//             token.trainings = trainee?.trainings || [];
//           } else {
//             token.traineeId = null;
//             token.trainings = [];
//           }
//         }
//       }

//       return token;
//     },

//     // Session callback attaches token data to session
//     async session({ session, token }) {
//       session.user.id = token.id;
//       session.user.email = token.email;
//       session.user.role = token.role;
//       session.user.isTrainee = !!token.isTrainee;
//       session.user.firstName = token.firstName;
//       session.user.lastName = token.lastName;
//       session.user.trainings = token.trainings || [];
//       session.user.traineeId = token.traineeId;

//       return session;
//     },

//     // Prevent open redirects
//     async redirect({ url, baseUrl }) {
//       if (url.startsWith('/')) return `${baseUrl}${url}`;
//       if (new URL(url).origin === baseUrl) return url;
//       return baseUrl;
//     },
//   },

//   pages: {
//     signIn: '/login',
//     signOut: '/login',
//     error: '/login',
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// };




// import Google from "next-auth/providers/google";
// import Credentials from "next-auth/providers/credentials";
// import connectedDB from "@/config/database";
// import User from "@/models/User";
// import Trainee from "@/models/Trainee";
// import bcrypt from "bcryptjs";

// export const authOptions = {
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//     }),

//     Credentials({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text", placeholder: "example@example.com" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         await connectedDB();

//         const user = await User.findOne({ email: credentials.email });
//         if (!user) throw new Error("No user found with this email");

//         const valid = await bcrypt.compare(credentials.password, user.password);
//         if (!valid) throw new Error("Invalid password");

//         return {
//           id: user._id.toString(),
//           email: user.email,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           name: `${user.firstName} ${user.lastName}`,
//           role: user.role,
//           image: user.image,
//           isTrainee: user.isTrainee || false,
//         };
//       },
//     }),
//   ],

//   session: { strategy: "jwt" },
//   secret: process.env.NEXTAUTH_SECRET,

//   callbacks: {
//     async signIn({ user, account, profile }) {
//       await connectedDB();

//       if (account?.provider === "google") {
//         let existingUser = await User.findOne({ email: profile.email });

//         if (!existingUser) {
//           const [firstName, ...rest] = profile.name?.split(" ") || ["User"];
//           existingUser = await User.create({
//             email: profile.email,
//             firstName,
//             lastName: rest.join(" "),
//             image: profile.picture,
//             role: "user",
//             isTrainee: false,
//           });
//         }

//         if (existingUser.isTrainee) {
//           let trainee = await Trainee.findOne({ user: existingUser._id });
//           if (!trainee) {
//             await Trainee.create({ user: existingUser._id, trainings: [] });
//           }
//         }

//         user = existingUser;
//       }

//       return true;
//     },

//     async jwt({ token, user }) {
//       await connectedDB();

//       if (user) {
//         const userId = user.id || user._id?.toString();
//         token.id = userId;
//         token.email = user.email;
//         token.role = user.role;
//         token.isTrainee = !!user.isTrainee;
//         token.firstName = user.firstName;
//         token.lastName = user.lastName;

//         if (user.isTrainee) {
//           const trainee = await Trainee.findOne({ user: userId });
//           token.traineeId = trainee?._id?.toString() || null;
//           token.trainings = trainee?.trainings || [];
//         } else {
//           token.traineeId = null;
//           token.trainings = [];
//         }
//       }

//       return token;
//     },

//     async session({ session, token }) {
//       session.user = {
//         id: token.id,
//         email: token.email,
//         role: token.role,
//         isTrainee: !!token.isTrainee,
//         firstName: token.firstName,
//         lastName: token.lastName,
//         traineeId: token.traineeId,
//         trainings: token.trainings || [],
//       };
//       return session;
//     },
//   },

//   pages: {
//     signIn: "/login",
//     error: "/login",
//   },
// };




import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import connectedDB from "@/config/database";
import User from "@/models/User";
import Trainee from "@/models/Trainee";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    // 🔹 Google OAuth Provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // 🔹 Credentials Login Provider
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectedDB();

        const user = await User.findOne({ email: credentials.email }).lean();
        if (!user) throw new Error("No user found with this email");

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          image: user.image,
          isTrainee: user.isTrainee || false,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // 🔹 Handle Google and Credentials sign-in
    async signIn({ user, account, profile }) {
      await connectedDB();

      if (account?.provider === "google") {
        let existingUser = await User.findOne({ email: profile.email });

        if (!existingUser) {
          const [firstName, ...rest] = profile.name?.split(" ") || ["User"];
          existingUser = await User.create({
            email: profile.email,
            firstName,
            lastName: rest.join(" "),
            image: profile.picture,
            role: "user",
            isTrainee: false,
          });
        }

        // Ensure trainee record exists for trainee users
        if (existingUser.isTrainee) {
          let trainee = await Trainee.findOne({ user: existingUser._id });
          if (!trainee) {
            await Trainee.create({ user: existingUser._id, trainings: [] });
          }
        }

        user = existingUser;
      }

      return true;
    },

    // 🔹 Store only safe, serializable data in JWT
    async jwt({ token, user }) {
      await connectedDB();

      if (user) {
        const userId = user.id || user._id?.toString();
        token.id = userId;
        token.email = user.email;
        token.role = user.role;
        token.isTrainee = !!user.isTrainee;
        token.firstName = user.firstName;
        token.lastName = user.lastName;

        // ✅ Avoid storing full Mongoose arrays or docs
        if (user.isTrainee) {
          const trainee = await Trainee.findOne({ user: userId }).lean();
          token.traineeId = trainee?._id?.toString() || null;

          // ✅ Convert trainings safely to plain serializable JSON
          token.trainings = Array.isArray(trainee?.trainings)
            ? trainee.trainings.map(t => ({
                track: t.track,
                status: t.status,
                progress: t.progress,
              }))
            : [];
        } else {
          token.traineeId = null;
          token.trainings = [];
        }
      }

      return token;
    },

    // 🔹 Attach safe session data to client
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        role: token.role,
        isTrainee: !!token.isTrainee,
        firstName: token.firstName,
        lastName: token.lastName,
        traineeId: token.traineeId,
        trainings: token.trainings || [],
      };
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
};
