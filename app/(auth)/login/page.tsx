"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { NeonButton } from "@/components/shared/NeonButton"
import { GlassCard } from "@/components/shared/GlassCard"
import { fadeUp } from "@/lib/motion"

import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [error, setError] = React.useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (res?.error) {
                throw new Error("Invalid credentials")
            }

            router.push("/")
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <GlassCard className="p-8">
                <h2 className="text-2xl font-bold font-display uppercase tracking-wider mb-6 text-center">
                    Operator Login
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-mono uppercase text-text-secondary tracking-widest pl-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full h-12 bg-elevated border border-border-default rounded-lg px-4 text-text-primary focus:outline-none focus:border-lime focus:shadow-[0_0_12px_rgba(200,255,0,0.15)] transition-all font-body"
                            placeholder="operator@zyra.fit"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono uppercase text-text-secondary tracking-widest pl-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full h-12 bg-elevated border border-border-default rounded-lg px-4 text-text-primary focus:outline-none focus:border-lime focus:shadow-[0_0_12px_rgba(200,255,0,0.15)] transition-all font-body"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <NeonButton type="submit" className="w-full">
                            INITIALIZE
                        </NeonButton>
                    </div>
                </form>

                <div className="mt-8 text-center border-t border-border-default pt-6">
                    <p className="text-text-secondary text-sm">
                        Not registered yet?{" "}
                        <Link href="/register" className="text-lime hover:underline font-bold transition-colors">
                            Request Access
                        </Link>
                    </p>
                </div>
            </GlassCard>
        </motion.div>
    )
}
