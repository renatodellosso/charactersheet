import clientPromise from "@/lib/mongodbadapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

export default NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!, //Guarantee that it won't be null
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ]
})