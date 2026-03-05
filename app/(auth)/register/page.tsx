"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { NeonButton } from "@/components/shared/NeonButton"
import { GlassCard } from "@/components/shared/GlassCard"
import { fadeUp } from "@/lib/motion"

import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        password: "",
    })
    const [error, setError] = React.useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!res.ok) {
                const text = await res.text()
                throw new Error(text || "Registration failed")
            }

            // Auto sign in after registration
            const signInRes = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            })

            if (signInRes?.error) {
                throw new Error("Could not sign in after registering")
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
                    Request Access
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-mono uppercase text-text-secondary tracking-widest pl-1">
                            Callsign (Name)
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-12 bg-elevated border border-border-default rounded-lg px-4 text-text-primary focus:outline-none focus:border-lime focus:shadow-[0_0_12px_rgba(200,255,0,0.15)] transition-all font-body"
                            placeholder="Maverick"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono uppercase text-text-secondary tracking-widest pl-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full h-12 bg-elevated border border-border-default rounded-lg px-4 text-text-primary focus:outline-none focus:border-lime focus:shadow-[0_0_12px_rgba(200,255,0,0.15)] transition-all font-body"
                            placeholder="operator@zyra.fit"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono uppercase text-text-secondary tracking-widest pl-1">
                            Secure Password
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="w-full h-12 bg-elevated border border-border-default rounded-lg px-4 text-text-primary focus:outline-none focus:border-lime focus:shadow-[0_0_12px_rgba(200,255,0,0.15)] transition-all font-body"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="pt-4 space-y-4">
                        <NeonButton type="submit" className="w-full">
                            INITIALIZE PROFILE
                        </NeonButton>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border-default" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-surface px-2 text-text-muted font-mono">
                                    Secure OAUTH
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            className="w-full h-12 bg-void border border-border-default rounded-lg px-4 text-text-primary hover:border-lime transition-all font-display uppercase tracking-wider flex items-center justify-center gap-3 group"
                        >
                            <svg className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(200,255,0,0.5)] transition-all" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center border-t border-border-default pt-6">
                    <p className="text-text-secondary text-sm">
                        Already have clearance?{" "}
                        <Link href="/login" className="text-lime hover:underline font-bold transition-colors">
                            Login
                        </Link>
                    </p>
                </div>
            </GlassCard>
        </motion.div>
    )
}
