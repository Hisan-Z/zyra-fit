"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts'
import {
    Calendar,
    TrendingUp,
    Activity,
    Filter,
    ChevronDown,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Database,
    Flame,
    Scale
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { PageHeader } from "@/components/shared/PageHeader"
import { GlassCard } from "@/components/shared/GlassCard"
import { useAppStore } from "@/store/useAppStore"
import { staggerContainer, fadeUp } from "@/lib/motion"
import { cn } from "@/lib/utils"

export default function HistoryPage() {
    const { history, fetchHistory, isLoadingHistory } = useAppStore()
    const [timeRange, setTimeRange] = React.useState(30)

    React.useEffect(() => {
        fetchHistory(timeRange)
    }, [fetchHistory, timeRange])

    if (isLoadingHistory && !history) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-lime" size={48} />
                <p className="font-mono text-xs text-text-muted uppercase tracking-[0.3em]">Analyzing Historical Data...</p>
            </div>
        )
    }

    const chartData = history?.chartData || []
    const summary = history?.summary

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-void/90 border border-lime/30 p-3 rounded-lg backdrop-blur-md shadow-2xl">
                    <p className="font-mono text-[10px] text-text-muted mb-2">{format(parseISO(label), 'MMM dd, yyyy')}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-4 mt-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: entry.color }}>
                                {entry.name}:
                            </span>
                            <span className="font-mono text-xs text-text-primary">
                                {entry.value?.toFixed(1)} {entry.unit || ''}
                            </span>
                        </div>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8 pb-12"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <PageHeader
                    title="History & Analytics"
                    subtitle="Visualize your metamorphosis over time."
                />

                <div className="flex items-center gap-2 bg-surface/50 p-1 rounded-full border border-border-subtle self-start">
                    {[7, 30, 90].map((d) => (
                        <button
                            key={d}
                            onClick={() => setTimeRange(d)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all",
                                timeRange === d ? "bg-lime text-void font-bold shadow-[0_0_15px_rgba(200,255,0,0.3)]" : "text-text-muted hover:text-text-primary"
                            )}
                        >
                            {d}D
                        </button>
                    ))}
                </div>
            </div>

            {/* Top Metrics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div variants={fadeUp}>
                    <GlassCard className="p-6 border-lime/20 h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-lime/10 border border-lime/20">
                                <TrendingUp size={20} className="text-lime" />
                            </div>
                            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest italic">Avg Calorie Delta</span>
                        </div>
                        <h4 className="text-4xl font-black font-display italic text-text-primary mb-1">
                            {summary?.avgCalories.toFixed(0)} <span className="text-sm font-bold opacity-30">KCAL</span>
                        </h4>
                        <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.1em]">Daily Intake Mean</p>
                    </GlassCard>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <GlassCard className="p-6 border-nred/20 h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-nred/10 border border-nred/20">
                                <Flame size={20} className="text-nred" />
                            </div>
                            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest italic">Total Energy Export</span>
                        </div>
                        <h4 className="text-4xl font-black font-display italic text-text-primary mb-1">
                            {summary?.totalBurned.toFixed(0)} <span className="text-sm font-bold opacity-30">KCAL</span>
                        </h4>
                        <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.1em]">Total Active Burn ({timeRange}d)</p>
                    </GlassCard>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <GlassCard className="p-6 border-ncyan/20 h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-ncyan/10 border border-ncyan/20">
                                <Scale size={20} className="text-ncyan" />
                            </div>
                            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest italic">Weight Status</span>
                        </div>
                        <h4 className="text-4xl font-black font-display italic text-text-primary mb-1">
                            {summary?.avgWeight?.toFixed(1) || '--'} <span className="text-sm font-bold opacity-30">KG</span>
                        </h4>
                        <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.1em]">Current Window Average</p>
                    </GlassCard>
                </motion.div>
            </div>

            {/* Weight Trend Chart */}
            <motion.div variants={fadeUp}>
                <GlassCard className="p-8 border-border-default h-[450px] flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp size={18} className="text-ncyan" />
                        <div>
                            <h3 className="font-display font-bold uppercase tracking-wider text-xl leading-none">Weight Trajectory</h3>
                            <p className="font-mono text-[10px] text-text-muted uppercase mt-1 tracking-widest italic">Body Mass Fluctuations over {timeRange} days</p>
                        </div>
                    </div>
                    <div className="flex-1 w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00FFCC" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00FFCC" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(str) => format(parseISO(str), 'MMM d')}
                                    tick={{ fill: '#555', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    hide
                                    domain={['dataMin - 2', 'dataMax + 2']}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#00FFCC"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#weightGradient)"
                                    name="Weight"
                                    unit="kg"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calories vs Burned Chart */}
                <motion.div variants={fadeUp}>
                    <GlassCard className="p-8 border-border-default h-[400px] flex flex-col">
                        <div className="flex items-center gap-3 mb-8">
                            <Flame size={18} className="text-lime" />
                            <div>
                                <h3 className="font-display font-bold uppercase tracking-wider text-xl leading-none">Energy Balance</h3>
                                <p className="font-mono text-[10px] text-text-muted uppercase mt-1 tracking-widest italic">Intake (Bars) vs Export (Line)</p>
                            </div>
                        </div>
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(str) => format(parseISO(str), 'MMM d')}
                                        tick={{ fill: '#555', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis hide />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="calories" fill="rgba(200,255,0,0.15)" stroke="#C8FF00" radius={[4, 4, 0, 0]} name="Intake" unit="kcal" />
                                    <Line type="monotone" dataKey="burned" stroke="#FF3B3B" strokeWidth={2} dot={false} name="Active Burn" unit="kcal" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Macro Split Aggregator */}
                <motion.div variants={fadeUp}>
                    <GlassCard className="p-8 border-border-default h-[400px] flex flex-col">
                        <div className="flex items-center gap-3 mb-8">
                            <Activity size={18} className="text-namber" />
                            <div>
                                <h3 className="font-display font-bold uppercase tracking-wider text-xl leading-none">Macro Distribution</h3>
                                <p className="font-mono text-[10px] text-text-muted uppercase mt-1 tracking-widest italic">Average Composition in {timeRange}d Window</p>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Protein', value: chartData.reduce((a, b) => a + b.protein, 0) },
                                                { name: 'Carbs', value: chartData.reduce((a, b) => a + b.carbs, 0) },
                                                { name: 'Fat', value: chartData.reduce((a, b) => a + b.fat, 0) }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            <Cell fill="#C8FF00" />
                                            <Cell fill="#FFB800" />
                                            <Cell fill="#00FFCC" />
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-xs font-mono text-text-muted uppercase italic">Insufficient Data for Matrix</p>
                            )}
                        </div>
                    </GlassCard>
                </motion.div>
            </div>

            <motion.div variants={fadeUp} className="flex justify-center pt-8">
                <div className="flex flex-col items-center gap-2">
                    <Database size={24} className="text-text-muted opacity-20" />
                    <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.4em] italic text-center">
                        Secure biological data transmission active<br />
                        Historical records verified
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}
