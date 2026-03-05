import * as React from "react"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-void">
            {/* Background patterns */}
            <div className="absolute inset-0 z-0 bg-grid-pattern opacity-40"></div>
            <div className="absolute inset-0 z-0 bg-radial-glow-lime opacity-60"></div>

            {/* Scan line effect */}
            <div className="absolute inset-x-0 h-[2px] bg-lime/20 shadow-[0_0_8px_rgba(200,255,0,0.5)] z-0 animate-scan-line"></div>

            {/* Content wrapper */}
            <div className="relative z-10 w-full max-w-md px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-display text-5xl font-bold tracking-tight text-text-primary uppercase flex items-center justify-center gap-2">
                        Zyra<span className="text-lime text-shadow-[0_0_12px_rgba(200,255,0,0.4)]">fit</span>
                        <span className="w-3 h-3 rounded-full bg-lime animate-neon-pulse mt-3 ml-1"></span>
                    </h1>
                    <p className="font-mono text-sm text-lime mt-2 tracking-widest uppercase">
                        Your Body. Your Data. Your Edge.
                    </p>
                </div>

                {children}
            </div>
        </div>
    )
}
