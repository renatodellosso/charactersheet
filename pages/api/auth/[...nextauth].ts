import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!, //Guarantee that it won't be null
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ]
})