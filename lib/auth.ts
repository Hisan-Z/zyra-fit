import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import prisma from "./prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log(`[AUTH_DEBUG] Login attempt for: ${credentials?.email}`)
                if (!credentials?.email || !credentials?.password) {
                    console.error("[AUTH_DEBUG] Missing credentials")
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                })

                if (!user) {
                    console.error("[AUTH_DEBUG] No user found with this email")
                    return null
                }

                if (!user.passwordHash) {
                    console.error("[AUTH_DEBUG] User found but has no password (OAuth account?)")
                    return null
                }

                const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash)
                console.log(`[AUTH_DEBUG] Password valid: ${isValid}`)

                if (!isValid) {
                    console.error("[AUTH_DEBUG] Password mismatch")
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                }
            }
        })
    ],
    pages: {
        signIn: "/login",
        newUser: "/register",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isAuthPage = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register')

            if (!isLoggedIn && !isAuthPage) {
                return false // Redirect to login
            }

            if (isLoggedIn && isAuthPage) {
                return Response.redirect(new URL('/', nextUrl))
            }

            return true
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        }
    }
})
