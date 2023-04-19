import clientPromise from "@/lib/mongodbadapter";
import NextAuth, { getServerSession, AuthOptions } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: AuthOptions = {
    secret: process.env.JWT_SECRET,
    adapter: MongoDBAdapter(clientPromise, {
        databaseName: process.env.DB_NAME
    }),
    theme: {
        colorScheme: "light",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!, //Guarantee that it won't be null
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!
        })
    ]
}

export default NextAuth(authOptions);