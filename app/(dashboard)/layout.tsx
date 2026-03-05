import * as React from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopBar } from "@/components/layout/TopBar"
import { BottomNav } from "@/components/layout/BottomNav"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-void w-full overflow-hidden">
            {/* Desktop Sidebar */}
            <Sidebar />

            <div className="flex flex-col flex-1 w-full h-screen overflow-y-auto overflow-x-hidden relative">
                <TopBar />

                {/* Main content area */}
                <main className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <BottomNav />
        </div>
    )
}
