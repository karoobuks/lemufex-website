//auth.js
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import connectedDB from "@/config/database";
import User from "@/models/User";
import Trainee from "@/models/Trainee";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        Credentials({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },

            async authorize(credentials) {
                await connectedDB();

                const user = await User.findOne({ email: credentials.email });

                if (!user || !user.password) return null;

                const isMatch = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isMatch) return null;

                return {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],

    pages: {
        signIn: "/login",
    },

    session: {
        strategy: "jwt",
    },

    callbacks: {
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

                user.id = existingUser._id.toString();
                user.role = existingUser.role;
                user.isTrainee = existingUser.isTrainee;
            }

            return true;
        },

        async jwt({ token, user }) {
            await connectedDB();

            if (user) {
                const dbUser = await User.findById(user.id);
                token.id = dbUser._id.toString();
                token.sessionVersion = dbUser.sessionVersion || 0;
            }

            if (token.id) {
                const dbUser = await User.findById(token.id).lean();

                if (!dbUser || (dbUser.sessionVersion || 0) !== token.sessionVersion) {
                    return {};
                }

                token.role = dbUser.role;
                token.isTrainee = !!dbUser.isTrainee;

                if (dbUser.isTrainee) {
                    const trainee = await Trainee.findOne({ user: dbUser._id }).lean();
                    token.trainings = trainee?.trainings || [];
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.email = token.email;
                session.user.isTrainee = token.isTrainee;
                session.user.trainings = token.trainings || [];
            }

            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
});