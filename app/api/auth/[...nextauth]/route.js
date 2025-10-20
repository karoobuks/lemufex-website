// console.log("NextAuth:", typeof NextAuth);

// import { authOptions } from "@/utils/authOptions";
// import NextAuth from "next-auth";

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST};

import NextAuth from "next-auth";
import { authOptions } from "@/utils/authOptions.js";

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

export const { GET, POST } = handlers;
