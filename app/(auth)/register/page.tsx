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

                    <div className="pt-4">
                        <NeonButton type="submit" className="w-full">
                            INITIALIZE PROFILE
                        </NeonButton>
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
