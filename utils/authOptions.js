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




// import Google from "next-auth/providers/google";
// import Credentials from "next-auth/providers/credentials";
// import connectedDB from "@/config/database";
// import User from "@/models/User";
// import Trainee from "@/models/Trainee";
// import bcrypt from "bcryptjs";

// export const authOptions = {
//   providers: [
//     // 🔹 Google OAuth Provider
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

//     // 🔹 Credentials Login Provider
//     Credentials({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text", placeholder: "example@example.com" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         await connectedDB();

//         const user = await User.findOne({ email: credentials.email }).lean();
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
//     // 🔹 Handle Google and Credentials sign-in
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

//         // Ensure trainee record exists for trainee users
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

//     // 🔹 Store only safe, serializable data in JWT
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

//         // ✅ Avoid storing full Mongoose arrays or docs
//         if (user.isTrainee) {
//           const trainee = await Trainee.findOne({ user: userId }).lean();
//           token.traineeId = trainee?._id?.toString() || null;

//           // ✅ Convert trainings safely to plain serializable JSON
//           token.trainings = Array.isArray(trainee?.trainings)
//             ? trainee.trainings.map(t => ({
//                 track: t.track,
//                 status: t.status,
//                 progress: t.progress,
//               }))
//             : [];
//         } else {
//           token.traineeId = null;
//           token.trainings = [];
//         }
//       }

//       return token;
//     },

//     // 🔹 Attach safe session data to client
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



import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import connectedDB from "@/config/database";
import User from "@/models/User";
import Trainee from "@/models/Trainee";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import {
  checkRateLimitIp,
  incrFailedLogin,
  resetFailedLogin,
  isAccountLocked,
  lockAccount,
  createRefreshToken,
} from "@/lib/authHelpers";

// Config
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10);
const MAX_IP = parseInt(process.env.RATE_LIMIT_MAX_IP || "20", 10);
const FAILED_ATTEMPTS_LIMIT = parseInt(process.env.FAILED_ATTEMPTS_LIMIT || "5", 10);
const ACCOUNT_LOCK_TTL_SECONDS = parseInt(process.env.ACCOUNT_LOCK_TTL_SECONDS || "900", 10);
const REFRESH_TTL = parseInt(process.env.REFRESH_TOKEN_TTL_SECONDS || 7 * 24 * 3600, 10);

// Utility to get client IP
function getClientIP(req) {
  const xff = req.headers["x-forwarded-for"];
  if (xff) return xff.split(",")[0].trim();
  const forwarded = req.headers["forwarded"];
  if (forwarded) return forwarded;
  return req.headers["x-real-ip"] || "unknown";
}

export const authOptions = {
  providers: [
    // 🔹 Google OAuth
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

    // 🔹 Credentials Provider with security features
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },

      async authorize(credentials, req) {
        await connectedDB();

        const ip = getClientIP(req);
        const ipCheck = await checkRateLimitIp(ip, WINDOW_MS, MAX_IP);
        if (!ipCheck.allowed) throw new Error("Too many requests from this IP. Try later.");

        const { email, password } = credentials;
        if (!email || !password) throw new Error("Missing credentials");

        if (await isAccountLocked(email)) {
          throw new Error("Account locked due to repeated failed attempts. Try later.");
        }

        const user = await User.findOne({ email: email.toLowerCase() })
          .select("_id email password role firstName lastName image isTrainee")
          .lean();

        if (!user) {
          await incrFailedLogin(email);
          throw new Error("Invalid email or password");
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
          const fails = await incrFailedLogin(email);
          if (fails >= FAILED_ATTEMPTS_LIMIT) {
            await lockAccount(email, ACCOUNT_LOCK_TTL_SECONDS);
          }
          throw new Error("Invalid email or password");
        }

        await resetFailedLogin(email);

        // Optional: create JWT access token
        const accessToken = jwt.sign(
          { _id: user._id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
        );


          const remember = credentials.rememberMe === true || credentials.rememberMe === "true";

      // Longer refresh TTL if "remember me" checked
      const refreshTTL = remember
      ? parseInt(process.env.REFRESH_TOKEN_TTL_REMEMBER || 30 * 24 * 3600) // 30 days
      : parseInt(process.env.REFRESH_TOKEN_TTL_SECONDS || 7 * 24 * 3600);   // 7 days

        // Optional: create refresh token
        const refreshToken = await createRefreshToken(user._id, REFRESH_TTL);

        // Set cookies if res is available
        if (req?.res) {
          const accessCookie = serialize("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: REFRESH_TTL,
          });
          req.res.setHeader("Set-Cookie", accessCookie);
          req.res.setHeader("Set-Cookie", refreshToken); // append refresh token
        }

        return {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          image: user.image,
          isTrainee: user.isTrainee || false,
          rememberMe: remember, // pass it to jwt & session
        };
      },
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  pages: { signIn: "/login", error: "/login" },

  callbacks: {
    // 🔹 Handle Google sign-in and trainee creation
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

    // 🔹 JWT callback
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
        token.rememberMe = user.rememberMe || false;

        if (user.isTrainee) {
          const trainee = await Trainee.findOne({ user: userId }).lean();
          token.traineeId = trainee?._id?.toString() || null;
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

    // 🔹 Session callback
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
        rememberMe: token.rememberMe,
      };
      return session;
    },
  },
};
