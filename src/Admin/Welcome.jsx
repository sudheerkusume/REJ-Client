import { useEffect, useState, useRef, useCallback } from "react";
import { formatSalary } from "../utils/formatSalary";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import {
    FiCalendar, FiUsers, FiBriefcase,
    FiCheckCircle, FiMonitor, FiPhone, FiClock, FiChevronLeft, FiChevronRight,
    FiTrendingUp, FiActivity, FiZap, FiStar, FiExternalLink
} from "react-icons/fi";

/* ─────────── COLOR THEMES ─────────── */
const COLORS = {
    Applications: {
        primary: '#6366f1', light: '#e0e7ff', dark: '#4338ca',
        bg: 'linear-gradient(135deg, #eef2ff 0%, #c7d2fe 100%)',
        iconBg: 'linear-gradient(135deg, #6366f1, #818cf8)', iconColor: '#fff',
        shadow: '0 10px 25px -5px rgba(99, 102, 241, 0.25)',
        glow: 'rgba(99, 102, 241, 0.08)'
    },
    Shortlisted: {
        primary: '#10b981', light: '#d1fae5', dark: '#059669',
        bg: 'linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 100%)',
        iconBg: 'linear-gradient(135deg, #10b981, #34d399)', iconColor: '#fff',
        shadow: '0 10px 25px -5px rgba(16, 185, 129, 0.25)',
        glow: 'rgba(16, 185, 129, 0.08)'
    },
    Selected: {
        primary: '#f59e0b', light: '#fef3c7', dark: '#d97706',
        bg: 'linear-gradient(135deg, #fffbeb 0%, #fde68a 100%)',
        iconBg: 'linear-gradient(135deg, #f59e0b, #fbbf24)', iconColor: '#fff',
        shadow: '0 10px 25px -5px rgba(245, 158, 11, 0.25)',
        glow: 'rgba(245, 158, 11, 0.08)'
    },
    "Active Jobs": {
        primary: '#f43f5e', light: '#ffe4e6', dark: '#e11d48',
        bg: 'linear-gradient(135deg, #fff1f2 0%, #fecdd3 100%)',
        iconBg: 'linear-gradient(135deg, #f43f5e, #fb7185)', iconColor: '#fff',
        shadow: '0 10px 25px -5px rgba(244, 63, 94, 0.25)',
        glow: 'rgba(244, 63, 94, 0.08)'
    },
};

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#8b5cf6'];

/* ─────────── DYNAMIC CALENDAR ─────────── */
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const DynamicCalendar = ({ isOpen, onRangeSelect, selectedRange }) => {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [rangeStart, setRangeStart] = useState(selectedRange?.start || null);
    const [rangeEnd, setRangeEnd] = useState(selectedRange?.end || null);
    const [hoverDate, setHoverDate] = useState(null);

    if (!isOpen) return null;

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const isToday = (day) => viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
    const dateObj = (day) => new Date(viewYear, viewMonth, day);

    const handleDayClick = (day) => {
        const clicked = dateObj(day);
        if (!rangeStart || (rangeStart && rangeEnd)) {
            setRangeStart(clicked); setRangeEnd(null);
        } else {
            if (clicked < rangeStart) {
                setRangeEnd(rangeStart); setRangeStart(clicked);
                onRangeSelect?.({ start: clicked, end: rangeStart });
            } else {
                setRangeEnd(clicked);
                onRangeSelect?.({ start: rangeStart, end: clicked });
            }
        }
    };

    const inRange = (day) => {
        const d = dateObj(day);
        const effectiveEnd = rangeEnd || hoverDate;
        if (!rangeStart || !effectiveEnd) return false;
        const lo = rangeStart < effectiveEnd ? rangeStart : effectiveEnd;
        const hi = rangeStart < effectiveEnd ? effectiveEnd : rangeStart;
        return d >= lo && d <= hi;
    };
    const isRangeEdge = (day) => {
        const d = dateObj(day).getTime();
        return (rangeStart && d === rangeStart.getTime()) || (rangeEnd && d === rangeEnd.getTime());
    };

    const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const quickSelect = (label) => {
        const now = new Date();
        let s, e;
        if (label === 'Today') { s = now; e = now; }
        else if (label === 'This Week') {
            s = new Date(now); s.setDate(now.getDate() - now.getDay());
            e = new Date(s); e.setDate(s.getDate() + 6);
        } else {
            s = new Date(now.getFullYear(), now.getMonth(), 1);
            e = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }
        setRangeStart(s); setRangeEnd(e);
        setViewMonth(now.getMonth()); setViewYear(now.getFullYear());
        onRangeSelect?.({ start: s, end: e });
    };

    return (
        <div className="position-absolute animate-fade-in user-select-none"
            style={{
                top: '100%', right: 0, zIndex: 1050,
                width: '310px', marginTop: '10px', padding: '20px',
                background: '#fff', borderRadius: '20px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.04)'
            }}>
            {/* Month nav */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button onClick={prevMonth} className="wcal-nav-btn"><FiChevronLeft size={15} /></button>
                <span style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b', letterSpacing: '-0.3px' }}>
                    {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
                <button onClick={nextMonth} className="wcal-nav-btn"><FiChevronRight size={15} /></button>
            </div>

            {/* Day labels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', marginBottom: '4px' }}>
                {DAY_LABELS.map(d => (
                    <span key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '4px 0' }}>{d}</span>
                ))}
            </div>

            {/* Day grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px' }}>
                {blanks.map(b => <div key={`b-${b}`} />)}
                {days.map(day => {
                    const todayFlag = isToday(day), edge = isRangeEdge(day), range = inRange(day);
                    return (
                        <div key={day}
                            onClick={() => handleDayClick(day)}
                            onMouseEnter={() => { if (rangeStart && !rangeEnd) setHoverDate(dateObj(day)); }}
                            onMouseLeave={() => setHoverDate(null)}
                            className="wcal-day"
                            style={{
                                width: '36px', height: '36px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: edge ? '10px' : range ? '6px' : '10px',
                                fontSize: '13px', fontWeight: todayFlag || edge ? 700 : 500,
                                cursor: 'pointer', transition: 'all 0.15s ease',
                                color: edge ? '#fff' : todayFlag ? '#6366f1' : range ? '#4338ca' : '#334155',
                                background: edge ? 'linear-gradient(135deg, #6366f1, #818cf8)' : range ? '#e0e7ff' : todayFlag ? '#eef2ff' : 'transparent',
                                border: todayFlag && !edge ? '2px solid #6366f1' : '2px solid transparent',
                                boxShadow: edge ? '0 4px 12px rgba(99, 102, 241, 0.35)' : 'none'
                            }}>
                            {day}
                        </div>
                    );
                })}
            </div>

            {/* Quick presets */}
            <div className="d-flex gap-2 mt-3">
                {['Today', 'This Week', 'This Month'].map(label => (
                    <button key={label} onClick={() => quickSelect(label)} className="wcal-quick-btn">{label}</button>
                ))}
            </div>
        </div>
    );
};

/* ─────────── ANIMATED COUNTER ─────────── */
const AnimCounter = ({ target }) => {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (target === 0) { setVal(0); return; }
        let cur = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const iv = setInterval(() => {
            cur += step;
            if (cur >= target) { setVal(target); clearInterval(iv); }
            else setVal(cur);
        }, 30);
        return () => clearInterval(iv);
    }, [target]);
    return <>{val}</>;
};

/* ═══════════════ MAIN WELCOME COMPONENT ═══════════════ */
const Welcome = ({ userName }) => {
    const { token } = useAuth();
    const [stats, setStats] = useState({ total: 0, shortlisted: 0, selected: 0, rejected: 0, activeJobs: 0 });
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Applications');
    const [showCalendar, setShowCalendar] = useState(false);
    const [dateRange, setDateRange] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const calendarRef = useRef(null);

    // Live clock
    useEffect(() => {
        const t = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(t);
    }, []);

    // Outside click to close calendar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch data
    useEffect(() => {
        if (!token) return;
        const fetchData = async () => {
            try {
                const [statsRes, appsRes] = await Promise.all([
                    api.get("/admin/dashboard-stats"),
                    api.get("/admin/applications")
                ]);
                setStats(prev => ({ ...prev, ...statsRes.data }));
                const sortedApps = (appsRes.data || [])
                    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
                setRecentApplications(sortedApps.slice(0, 10));
                setLoading(false);
            } catch (err) {
                console.error("Dashboard data error:", err);
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    /* Date range label */
    const getDateRangeLabel = useCallback(() => {
        if (!dateRange) {
            const now = new Date();
            const weekAgo = new Date(); weekAgo.setDate(now.getDate() - 6);
            return `${weekAgo.getDate()} – ${now.getDate()} ${now.toLocaleDateString('en-US', { month: 'long' })}`;
        }
        const { start, end } = dateRange;
        if (start.getMonth() === end.getMonth())
            return `${start.getDate()} – ${end.getDate()} ${start.toLocaleDateString('en-US', { month: 'long' })}`;
        return `${start.getDate()} ${start.toLocaleDateString('en-US', { month: 'short' })} – ${end.getDate()} ${end.toLocaleDateString('en-US', { month: 'short' })}`;
    }, [dateRange]);

    const getChartData = () => {
        const dailyData = {};
        recentApplications.forEach(app => {
            const date = new Date(app.appliedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            if (!dailyData[date]) dailyData[date] = { name: date, Applications: 0, Shortlisted: 0, Selected: 0 };
            dailyData[date].Applications += 1;
            if (app.status === 'Shortlisted') dailyData[date].Shortlisted += 1;
            if (app.status === 'Selected') dailyData[date].Selected += 1;
        });
        const data = Object.values(dailyData);
        if (data.length < 7) {
            for (let i = 6; i >= 0; i--) {
                const d = new Date(); d.setDate(d.getDate() - i);
                const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                if (!data.find(item => item.name === dateStr))
                    data.push({ name: dateStr, Applications: 0, Shortlisted: 0, Selected: 0 });
            }
        }
        return data.sort((a, b) => new Date(a.name) - new Date(b.name));
    };

    const getCategoryData = () => {
        const counts = {};
        recentApplications.forEach(app => {
            const cat = app.jobId?.title || 'Other';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
    };

    const getResourceData = () => {
        const counts = {};
        recentApplications.forEach(app => {
            const cat = app.jobId?.title || 'Other';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
    };

    // Greeting
    const greeting = () => {
        const h = currentTime.getHours();
        return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="wld-spinner" />
                    <p style={{ marginTop: '16px', color: '#94a3b8', fontWeight: 500, fontSize: '13px', letterSpacing: '0.3px' }}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const cards = [
        { label: "Applications", value: stats.total, icon: <FiBriefcase size={20} />, trend: "+12%" },
        { label: "Shortlisted", value: stats.shortlisted, icon: <FiUsers size={20} />, trend: "+8%" },
        { label: "Selected", value: stats.selected, icon: <FiCheckCircle size={20} />, trend: "+3%" },
        { label: "Active Jobs", value: stats.activeJobs ?? 0, icon: <FiMonitor size={20} />, trend: "+2" }
    ];

    const theme = COLORS[activeTab] || COLORS.Applications;
    const chartData = getChartData();
    const categoryData = getCategoryData();
    const resourceData = getResourceData();

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: '#fff', padding: '12px 16px', border: 'none',
                    borderRadius: '14px', fontFamily: "'Inter', sans-serif",
                    boxShadow: '0 20px 40px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)'
                }}>
                    <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#1e293b', fontSize: '12px' }}>{label}</p>
                    <div className="d-flex align-items-center gap-2">
                        <span className="rounded-circle" style={{ width: 8, height: 8, backgroundColor: payload[0].color }}></span>
                        <p className="mb-0 fw-bold" style={{ color: '#64748b', fontSize: '11px' }}>
                            {payload[0].value} {activeTab}
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="wdash-root" style={{ padding: '28px 30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

            {/* ── GREETING HEADER ── */}
            <div className="wdash-hero mb-4" style={{
                background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fef2f2 100%)',
                borderRadius: '24px', padding: '28px 32px',
                border: '1px solid rgba(99,102,241,0.08)',
                position: 'relative', overflow: 'hidden'
            }}>
                {/* Decorative blobs */}
                <div style={{ position: 'absolute', top: '-50px', right: '-30px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '15%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,94,0.05), transparent 70%)', pointerEvents: 'none' }} />

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3" style={{ position: 'relative', zIndex: 2 }}>
                    <div>
                        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, letterSpacing: '-0.8px', lineHeight: 1.2, color: '#0f172a' }}>
                            {greeting()}, {userName || 'Admin'} <span style={{ fontSize: '28px' }}>👋</span>
                        </h1>
                        <p className="mb-0 d-flex align-items-center gap-2" style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500, marginTop: '6px' }}>
                            <FiActivity size={14} style={{ color: '#6366f1' }} />
                            Here's what's happening with your dashboard today
                        </p>
                    </div>
                    <div className="d-flex align-items-center gap-2" style={{
                        background: '#fff', padding: '10px 18px', borderRadius: '14px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9'
                    }}>
                        <FiCalendar size={15} style={{ color: '#6366f1' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1', display: 'inline-block' }} />
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#6366f1' }}>
                            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── STAT CARDS ── */}
            <div className="row g-3 mb-4">
                {cards.map((card, idx) => {
                    const isActive = activeTab === card.label;
                    const cardTheme = COLORS[card.label] || COLORS.Applications;
                    return (
                        <div className="col-12 col-md-6 col-lg-3" key={idx}>
                            <div className="wdash-stat-card"
                                onClick={() => setActiveTab(card.label)}
                                style={{
                                    background: isActive ? cardTheme.bg : '#fff',
                                    borderRadius: '20px', cursor: 'pointer', padding: '22px',
                                    boxShadow: isActive ? cardTheme.shadow : '0 1px 3px rgba(0,0,0,0.04)',
                                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                    border: isActive ? '1px solid transparent' : '1px solid #f1f5f9',
                                    position: 'relative', overflow: 'hidden'
                                }}>
                                {/* Glow orb */}
                                {isActive && <div style={{ position: 'absolute', top: '-25px', right: '-25px', width: '90px', height: '90px', borderRadius: '50%', background: cardTheme.glow, pointerEvents: 'none' }} />}

                                <div className="d-flex justify-content-between align-items-start mb-3" style={{ position: 'relative', zIndex: 2 }}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '13px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: isActive ? cardTheme.iconBg : cardTheme.light,
                                        color: isActive ? cardTheme.iconColor : cardTheme.primary,
                                        boxShadow: isActive ? `0 6px 16px ${cardTheme.glow}` : 'none',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        {card.icon}
                                    </div>
                                    <div className="d-flex align-items-center gap-1" style={{
                                        padding: '3px 8px', borderRadius: '8px',
                                        background: isActive ? 'rgba(255,255,255,0.5)' : '#f0fdf4',
                                        fontSize: '11px', fontWeight: 700, color: '#16a34a'
                                    }}>
                                        <FiTrendingUp size={11} /> {card.trend}
                                    </div>
                                </div>

                                <div style={{ position: 'relative', zIndex: 2 }}>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: isActive ? '#374151' : '#94a3b8', letterSpacing: '0.3px', display: 'block', marginBottom: '4px' }}>
                                        {card.label}
                                    </span>
                                    <h2 style={{ margin: 0, fontSize: '34px', fontWeight: 800, color: '#0f172a', letterSpacing: '-1.5px', lineHeight: 1 }}>
                                        <AnimCounter target={card.value} />
                                    </h2>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── CHARTS SECTION ── */}
            <div className="row g-3 mb-4">
                {/* Bar Chart */}
                <div className="col-12 col-xl-7">
                    <div className="wdash-card" style={{ padding: '26px', height: '100%' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                            <div>
                                <h5 className="fw-bold mb-0" style={{ color: '#0f172a', letterSpacing: '-0.4px', fontSize: '17px' }}>{activeTab} Overview</h5>
                                <p className="mb-0" style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, marginTop: '3px' }}>Weekly trend analysis</p>
                            </div>
                            <div className="position-relative" ref={calendarRef}>
                                <button onClick={() => setShowCalendar(!showCalendar)} className="wdash-cal-btn">
                                    <FiCalendar size={13} style={{ color: '#6366f1' }} />
                                    <span>{getDateRangeLabel()}</span>
                                </button>
                                <DynamicCalendar
                                    isOpen={showCalendar}
                                    selectedRange={dateRange}
                                    onRangeSelect={(range) => { setDateRange(range); setShowCalendar(false); }}
                                />
                            </div>
                        </div>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} barSize={28}>
                                    <defs>
                                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={theme.primary} stopOpacity={0.85} />
                                            <stop offset="100%" stopColor={theme.primary} stopOpacity={0.45} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} />
                                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.6 }} />
                                    <Bar dataKey={activeTab === 'Active Jobs' ? 'Applications' : activeTab}
                                        fill="url(#barGrad)" radius={[10, 10, 4, 4]}
                                        animationDuration={1200} animationEasing="ease-out" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Pie charts */}
                <div className="col-12 col-xl-5">
                    <div className="row g-3 h-100">
                        {/* Donut */}
                        <div className="col-12 col-md-6">
                            <div className="wdash-card" style={{ padding: '22px', height: '100%' }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="fw-bold mb-0" style={{ color: '#0f172a', fontSize: '14px' }}>{activeTab} by Category</h6>
                                    <span style={{ padding: '3px 10px', borderRadius: '8px', background: '#ecfdf5', fontSize: '10px', fontWeight: 700, color: '#16a34a' }}>Live</span>
                                </div>
                                <div style={{ height: '200px', position: 'relative' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={categoryData.length ? categoryData : [{ name: 'None', value: 1 }]}
                                                cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                                                paddingAngle={3} dataKey="value" stroke="none">
                                                {categoryData.length
                                                    ? categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)
                                                    : <Cell fill="#e5e7eb" />}
                                            </Pie>
                                            <RechartsTooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                                        <h3 className="fw-bold mb-0" style={{ color: '#0f172a', letterSpacing: '-1px' }}>{stats.total}</h3>
                                        <small style={{ color: '#94a3b8', fontWeight: 600, fontSize: '10px', display: 'block' }}>Total</small>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    {categoryData.slice(0, 3).map((cat, i) => (
                                        <div key={i} className="d-flex align-items-center gap-2 mb-1">
                                            <span className="rounded-circle" style={{ width: 7, height: 7, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}></span>
                                            <div className="d-flex justify-content-between w-100">
                                                <span style={{ color: '#64748b', fontWeight: 500, fontSize: '11px' }}>{cat.name}</span>
                                                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '11px' }}>{cat.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Gauge */}
                        <div className="col-12 col-md-6">
                            <div className="wdash-card" style={{ padding: '22px', height: '100%', textAlign: 'center', background: 'linear-gradient(180deg, #fffbeb, #fff)' }}>
                                <h6 className="fw-bold mb-0" style={{ color: '#0f172a', fontSize: '14px' }}>Applicant Resources</h6>
                                <div style={{ height: '220px', position: 'relative' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={resourceData.length ? resourceData : [{ name: 'None', value: 1 }]} cx="50%" cy="60%"
                                                startAngle={180} endAngle={0}
                                                innerRadius={70} outerRadius={90}
                                                paddingAngle={3} dataKey="value"
                                                animationDuration={1500} stroke="none">
                                                {resourceData.length
                                                    ? resourceData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)
                                                    : <Cell fill="#e2e8f0" />}
                                            </Pie>
                                            <RechartsTooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="position-absolute start-50 translate-middle text-center" style={{ top: '55%' }}>
                                        <h2 className="fw-bold mb-0" style={{ color: '#0f172a', letterSpacing: '-1px' }}>{resourceData.reduce((sum, r) => sum + r.value, 0)}</h2>
                                        <small style={{ color: '#94a3b8', fontWeight: 600, fontSize: '10px' }}>Applicants</small>
                                    </div>
                                </div>
                                <div className="d-flex flex-wrap justify-content-center gap-2 position-relative" style={{ zIndex: 10, marginTop: '-12px' }}>
                                    {resourceData.slice(0, 3).map((r, i) => (
                                        <span key={i} className="wdash-resource-tag">
                                            <strong style={{ color: '#0f172a', marginRight: '3px' }}>{r.value}</strong>{r.name.split(' ')[0]}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── BOTTOM: VACANCIES + ACTIVITY/SCHEDULE ── */}
            <div className="row g-3">
                {/* Vacancies */}
                <div className="col-12 col-lg-7">
                    <div className="wdash-card" style={{ padding: '26px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h5 className="fw-bold mb-0" style={{ color: '#0f172a', fontSize: '17px', letterSpacing: '-0.4px' }}>Current Vacancies</h5>
                                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>{recentApplications.length} open positions</span>
                            </div>
                            <div className="d-flex gap-3 align-items-center">
                                <span className="wdash-link" style={{ color: '#10b981' }}>Popular</span>
                                <span className="wdash-link" style={{ color: '#6366f1' }}>See All <FiExternalLink size={10} /></span>
                            </div>
                        </div>

                        <div className="row g-3" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
                            {recentApplications.slice(0, 4).map((app, idx) => {
                                const isEven = idx % 2 === 0;
                                return (
                                    <div className="col-12 col-md-6" key={idx}>
                                        <div className="wdash-vacancy-card">
                                            {/* Accent bar */}
                                            <div style={{
                                                position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', borderRadius: '0 4px 4px 0',
                                                background: isEven ? 'linear-gradient(180deg,#6366f1,#818cf8)' : 'linear-gradient(180deg,#10b981,#34d399)'
                                            }} />

                                            <div className="d-flex align-items-center gap-3 mb-3" style={{ paddingLeft: '8px' }}>
                                                <div style={{
                                                    width: '42px', height: '42px', borderRadius: '12px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                    background: isEven ? '#eef2ff' : '#ecfdf5',
                                                    color: isEven ? '#6366f1' : '#10b981',
                                                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                                                }}>
                                                    {isEven ? <FiPhone size={18} /> : <FiUsers size={18} />}
                                                </div>
                                                <div className="text-truncate">
                                                    <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '13px', color: '#0f172a' }}>{app.jobId?.title || 'Tele Caller'}</h6>
                                                    <small style={{ color: '#94a3b8', fontWeight: 500, fontSize: '11px' }}>{app.companyId?.name}</small>
                                                </div>
                                            </div>

                                            <div className="d-flex gap-2 flex-wrap mb-3" style={{ paddingLeft: '8px' }}>
                                                <span className="wdash-tag">Full Time</span>
                                                <span className="wdash-tag" style={{
                                                    background: isEven ? '#eef2ff' : '#ecfdf5',
                                                    color: isEven ? '#6366f1' : '#059669'
                                                }}>
                                                    {app.jobId?.title?.split(' ')[0] || 'Sales'}
                                                </span>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center pt-3" style={{ borderTop: '1px solid #f1f5f9', paddingLeft: '8px' }}>
                                                <span style={{ color: '#64748b', fontWeight: 600, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <FiBriefcase size={11} /> {formatSalary(app.jobId?.salary, "N/A")}
                                                </span>
                                                <span style={{ color: '#6366f1', fontWeight: 700, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <FiUsers size={11} /> {Math.floor(Math.random() * 5 + 1)} Applied
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Activity + Schedule */}
                <div className="col-12 col-lg-5">
                    <div className="d-flex flex-column gap-3 h-100">
                        {/* Recent Activity */}
                        <div className="wdash-card" style={{ padding: '22px', flex: 1 }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: '#0f172a', fontSize: '15px' }}>
                                    <FiZap size={15} style={{ color: '#f59e0b' }} /> Recent Activity
                                </h5>
                                <span className="wdash-link" style={{ color: '#6366f1', fontSize: '11px' }}>View All</span>
                            </div>
                            {recentApplications.slice(0, 3).map((app, i) => (
                                <div key={i} className="d-flex gap-3 align-items-start" style={{
                                    padding: '10px 0',
                                    borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none'
                                }}>
                                    <div style={{
                                        width: '34px', height: '34px', borderRadius: '10px',
                                        background: i === 0 ? '#eef2ff' : i === 1 ? '#ecfdf5' : '#fffbeb',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        color: i === 0 ? '#6366f1' : i === 1 ? '#10b981' : '#f59e0b'
                                    }}>
                                        {i === 0 ? <FiUsers size={15} /> : i === 1 ? <FiCheckCircle size={15} /> : <FiStar size={15} />}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p className="mb-0" style={{ fontSize: '12px', fontWeight: 600, color: '#475569', lineHeight: 1.4 }}>
                                            <strong style={{ color: '#0f172a' }}>{app.userId?.name || 'Applicant'}</strong> applied for <strong style={{ color: '#6366f1' }}>{app.jobId?.title || 'Position'}</strong>
                                        </p>
                                        <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>
                                            {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <span style={{
                                        padding: '3px 8px', borderRadius: '6px', fontSize: '9px', fontWeight: 700,
                                        textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0,
                                        background: app.status === 'Shortlisted' ? '#ecfdf5' : app.status === 'Selected' ? '#fffbeb' : '#eef2ff',
                                        color: app.status === 'Shortlisted' ? '#059669' : app.status === 'Selected' ? '#d97706' : '#6366f1'
                                    }}>{app.status || 'Pending'}</span>
                                </div>
                            ))}
                            {recentApplications.length === 0 && (
                                <div className="text-center py-4" style={{ color: '#94a3b8' }}>
                                    <FiActivity size={20} className="mb-2 opacity-50" />
                                    <p className="mb-0" style={{ fontSize: '13px', fontWeight: 500 }}>No recent activity</p>
                                </div>
                            )}
                        </div>

                        {/* Schedule */}
                        <div className="wdash-card" style={{ padding: '22px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: '#0f172a', fontSize: '15px' }}>
                                    <FiClock size={14} style={{ color: '#6366f1' }} /> Daily Schedule
                                </h5>
                                <button className="wdash-cal-btn" style={{ padding: '5px 12px' }}>
                                    Today <FiCalendar size={11} />
                                </button>
                            </div>
                            <div style={{
                                textAlign: 'center', padding: '28px 16px',
                                border: '2px dashed #e2e8f0', borderRadius: '16px', background: '#fafbfc'
                            }}>
                                <FiClock size={26} style={{ color: '#cbd5e1', marginBottom: '8px' }} />
                                <p className="mb-0" style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8' }}>No events today</p>
                                <p className="mb-0" style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '4px' }}>Your schedule is clear ✨</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── STYLES ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                .wdash-root * { box-sizing: border-box; }

                /* ── Cards ── */
                .wdash-card {
                    background: #fff;
                    border-radius: 24px;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                    transition: box-shadow 0.3s ease;
                }
                .wdash-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                }

                /* ── Stat cards hover ── */
                .wdash-stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 16px 30px -6px rgba(0,0,0,0.08) !important;
                }

                /* ── Vacancy cards ── */
                .wdash-vacancy-card {
                    border: 1px solid #f1f5f9;
                    border-radius: 16px;
                    padding: 16px;
                    background: #fff;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }
                .wdash-vacancy-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 24px -6px rgba(0,0,0,0.08);
                    border-color: transparent;
                }

                /* ── Calendar trigger button ── */
                .wdash-cal-btn {
                    display: flex; align-items: center; gap: 8px;
                    padding: 8px 16px; border-radius: 12px;
                    border: 1px solid #e2e8f0; background: #f8fafc;
                    font-size: 12px; font-weight: 600; color: #475569;
                    cursor: pointer; transition: all 0.2s ease;
                    font-family: inherit;
                }
                .wdash-cal-btn:hover {
                    border-color: #6366f1;
                    background: #eef2ff;
                    color: #4338ca;
                }

                /* ── Calendar navigation ── */
                .wcal-nav-btn {
                    width: 32px; height: 32px; border-radius: 10px;
                    border: 1px solid #e2e8f0; background: #f8fafc;
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    color: #475569; transition: all 0.15s ease;
                }
                .wcal-nav-btn:hover {
                    background: #eef2ff;
                    border-color: #6366f1;
                    color: #6366f1;
                }

                /* ── Calendar day hover ── */
                .wcal-day:hover {
                    background: #f1f5f9 !important;
                }

                /* ── Calendar quick buttons ── */
                .wcal-quick-btn {
                    padding: 5px 12px; border-radius: 8px;
                    border: 1px solid #e2e8f0; background: #f8fafc;
                    font-size: 11px; font-weight: 600; color: #475569;
                    cursor: pointer; transition: all 0.15s ease;
                    font-family: inherit;
                }
                .wcal-quick-btn:hover {
                    background: #eef2ff;
                    border-color: #6366f1;
                    color: #4338ca;
                }

                /* ── Tags ── */
                .wdash-tag {
                    padding: 3px 10px; border-radius: 16px;
                    font-size: 10px; font-weight: 600;
                    background: #f1f5f9; color: #64748b;
                }

                /* ── Resource tags ── */
                .wdash-resource-tag {
                    background: #fff;
                    border: 1px solid #f1f5f9;
                    border-radius: 20px;
                    padding: 4px 12px;
                    font-size: 11px;
                    font-weight: 500;
                    color: #64748b;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .wdash-resource-tag:hover {
                    box-shadow: 0 4px 8px rgba(0,0,0,0.06);
                    transform: translateY(-1px);
                }

                /* ── Links ── */
                .wdash-link {
                    font-size: 12px; font-weight: 600; cursor: pointer;
                    transition: opacity 0.15s ease;
                    display: inline-flex; align-items: center; gap: 4px;
                }
                .wdash-link:hover { opacity: 0.7; }

                /* ── Loader ── */
                .wld-spinner {
                    width: 44px; height: 44px;
                    border: 3px solid #e2e8f0;
                    border-top-color: #6366f1;
                    border-radius: 50%;
                    animation: wldSpin 0.8s linear infinite;
                    margin: 0 auto;
                }
                @keyframes wldSpin { to { transform: rotate(360deg); } }

                /* ── Animations ── */
                .animate-fade-in {
                    animation: wdashFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes wdashFadeIn {
                    from { opacity: 0; transform: translateY(8px) scale(0.96); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                /* ── Hero shimmer ── */
                .wdash-hero::before {
                    content: '';
                    position: absolute; top: 0; left: -100%;
                    width: 50%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    animation: heroShimmer 6s ease-in-out infinite;
                    pointer-events: none;
                }
                @keyframes heroShimmer {
                    0%, 100% { left: -50%; }
                    50% { left: 100%; }
                }

                /* ── Scrollbar ── */
                .wdash-root ::-webkit-scrollbar { width: 5px; }
                .wdash-root ::-webkit-scrollbar-track { background: transparent; }
                .wdash-root ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
                .wdash-root ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </div>
    );
};

export default Welcome;
