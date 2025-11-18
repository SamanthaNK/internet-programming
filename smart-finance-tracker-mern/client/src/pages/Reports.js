import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    getMonthlyReport,
    getCategoryBreakdown,
    getSpendingTrends,
    getComparisonReport,
    getTopCategories,
    getSpendingByDayOfWeek
} from '../services/api';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function Reports() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Data states
    const [monthlyData, setMonthlyData] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [trendsData, setTrendsData] = useState(null);
    const [comparisonData, setComparisonData] = useState(null);
    const [topCategories, setTopCategories] = useState(null);
    const [dayOfWeekData, setDayOfWeekData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/signin');
            return;
        }
        setUser(JSON.parse(userData));
        loadAllReports();
    }, [navigate, selectedPeriod, selectedYear]);

    const loadAllReports = async () => {
        try {
            setLoading(true);

            const [monthly, category, trends, comparison, top, dayOfWeek] = await Promise.all([
                getMonthlyReport(selectedYear),
                getCategoryBreakdown(selectedPeriod, 'expense'),
                getSpendingTrends(selectedPeriod, 'day'),
                getComparisonReport(),
                getTopCategories(selectedPeriod, 5),
                getSpendingByDayOfWeek(selectedPeriod)
            ]);

            setMonthlyData(monthly.data.data);
            setCategoryData(category.data.data);
            setTrendsData(trends.data.data);
            setComparisonData(comparison.data.data);
            setTopCategories(top.data.data);
            setDayOfWeekData(dayOfWeek.data.data);

        } catch (error) {
            toast.error('Error loading reports');
            console.error('Reports error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Chart configurations
    const getChartOptions = (title) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#2A2D22',
                    font: { size: 12 }
                }
            },
            title: {
                display: true,
                text: title,
                color: document.documentElement.classList.contains('dark') ? '#E8EFE0' : '#354024',
                font: { size: 16, weight: '500' }
            }
        },
        scales: {
            y: {
                ticks: { color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#5F6355' },
                grid: { color: document.documentElement.classList.contains('dark') ? '#374151' : '#E5E3DA' }
            },
            x: {
                ticks: { color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#5F6355' },
                grid: { color: document.documentElement.classList.contains('dark') ? '#374151' : '#E5E3DA' }
            }
        }
    });

    // Monthly Income vs Expense Chart
    const monthlyChartData = monthlyData ? {
        labels: monthlyData.months.map(m => m.month),
        datasets: [
            {
                label: 'Income',
                data: monthlyData.months.map(m => m.income),
                borderColor: '#A8B89E',
                backgroundColor: 'rgba(168, 184, 158, 0.2)',
                tension: 0.3
            },
            {
                label: 'Expenses',
                data: monthlyData.months.map(m => m.expense),
                borderColor: '#C88B7A',
                backgroundColor: 'rgba(200, 139, 122, 0.2)',
                tension: 0.3
            }
        ]
    } : null;

    // Category Breakdown Doughnut Chart
    const categoryChartData = categoryData && categoryData.categories.length > 0 ? {
        labels: categoryData.categories.map(c => c.category),
        datasets: [{
            data: categoryData.categories.map(c => c.amount),
            backgroundColor: [
                '#889063', // primary-moss
                '#A8B89E', // accent-sage
                '#CFBB99', // accent-tan
                '#C88B7A', // accent-terracotta
                '#B8D4D0', // accent-seafoam
                '#E5D7C4', // accent-bone
                '#A8A99D', // text-light
            ],
            borderWidth: 2,
            borderColor: document.documentElement.classList.contains('dark') ? '#1F2937' : '#FFFFFF'
        }]
    } : null;

    // Spending Trends Line Chart
    const trendsChartData = trendsData ? {
        labels: trendsData.trends.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [{
            label: 'Daily Spending',
            data: trendsData.trends.map(t => t.expense),
            borderColor: '#C88B7A',
            backgroundColor: 'rgba(200, 139, 122, 0.1)',
            tension: 0.3,
            fill: true
        }]
    } : null;

    // Top Categories Bar Chart
    const topCategoriesChartData = topCategories && topCategories.categories.length > 0 ? {
        labels: topCategories.categories.map(c => c.category),
        datasets: [{
            label: 'Total Spent',
            data: topCategories.categories.map(c => c.total),
            backgroundColor: '#889063',
            borderColor: '#354024',
            borderWidth: 1
        }]
    } : null;

    // Day of Week Chart
    const dayOfWeekChartData = dayOfWeekData ? {
        labels: dayOfWeekData.days.map(d => d.day),
        datasets: [{
            label: 'Average Spending',
            data: dayOfWeekData.days.map(d => d.average),
            backgroundColor: '#A8B89E',
            borderColor: '#354024',
            borderWidth: 1
        }]
    } : null;

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-bg-primary dark:bg-neutral-900">
                <Navbar user={user} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary-moss border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-text-secondary dark:text-neutral-400">Loading reports...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-bg-primary dark:bg-neutral-900">
            <Navbar user={user} />

            <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-medium text-accent-cafe dark:text-primary-light mb-2">
                        Reports & Analytics
                    </h1>
                    <p className="text-text-secondary dark:text-neutral-400">
                        Insights into your financial habits
                    </p>
                </div>

                {/* Period Selector */}
                <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 mb-6 border border-border-primary dark:border-neutral-700">
                    <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light mb-4">
                        Report Period
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {['week', 'month', 'year'].map(period => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                className={`px-6 py-2 rounded-lg transition-all duration-300 ${selectedPeriod === period
                                        ? 'bg-primary-kombu dark:bg-primary-moss text-white'
                                        : 'bg-bg-secondary dark:bg-neutral-700 text-text-secondary dark:text-neutral-300 hover:bg-bg-overlay dark:hover:bg-neutral-600'
                                    }`}
                            >
                                {period === 'week' ? 'Last Week' : period === 'month' ? 'This Month' : 'This Year'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comparison Cards */}
                {comparisonData && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700">
                            <h3 className="text-sm text-text-secondary dark:text-neutral-400 uppercase mb-2 font-medium">
                                Income Change
                            </h3>
                            <div className="flex items-baseline space-x-2">
                                <div className="text-3xl font-serif font-medium text-accent-sage dark:text-green-400">
                                    {comparisonData.changes.income >= 0 ? '+' : ''}
                                    {comparisonData.changes.income}%
                                </div>
                                <i className={`bi bi-arrow-${comparisonData.changes.income >= 0 ? 'up' : 'down'} text-xl ${comparisonData.changes.income >= 0 ? 'text-accent-sage dark:text-green-400' : 'text-accent-terracotta dark:text-red-400'
                                    }`}></i>
                            </div>
                            <p className="text-sm text-text-muted dark:text-neutral-400 mt-2">
                                vs last month
                            </p>
                        </div>

                        <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700">
                            <h3 className="text-sm text-text-secondary dark:text-neutral-400 uppercase mb-2 font-medium">
                                Expense Change
                            </h3>
                            <div className="flex items-baseline space-x-2">
                                <div className="text-3xl font-serif font-medium text-accent-terracotta dark:text-red-400">
                                    {comparisonData.changes.expense >= 0 ? '+' : ''}
                                    {comparisonData.changes.expense}%
                                </div>
                                <i className={`bi bi-arrow-${comparisonData.changes.expense >= 0 ? 'up' : 'down'} text-xl ${comparisonData.changes.expense >= 0 ? 'text-accent-terracotta dark:text-red-400' : 'text-accent-sage dark:text-green-400'
                                    }`}></i>
                            </div>
                            <p className="text-sm text-text-muted dark:text-neutral-400 mt-2">
                                vs last month
                            </p>
                        </div>

                        <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700">
                            <h3 className="text-sm text-text-secondary dark:text-neutral-400 uppercase mb-2 font-medium">
                                Savings Rate
                            </h3>
                            <div className="flex items-baseline space-x-2">
                                <div className="text-3xl font-serif font-medium text-accent-seafoam dark:text-blue-400">
                                    {comparisonData.current.savingsRate}%
                                </div>
                            </div>
                            <p className="text-sm text-text-muted dark:text-neutral-400 mt-2">
                                {comparisonData.changes.savingsRate >= 0 ? '+' : ''}
                                {comparisonData.changes.savingsRate}% vs last month
                            </p>
                        </div>
                    </div>
                )}

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Monthly Income vs Expense */}
                    {monthlyChartData && (
                        <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light">
                                    Monthly Overview
                                </h3>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className="px-3 py-1 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 text-sm focus:ring-2 focus:ring-primary-moss focus:border-transparent"
                                >
                                    {[...Array(5)].map((_, i) => {
                                        const year = new Date().getFullYear() - i;
                                        return <option key={year} value={year}>{year}</option>;
                                    })}
                                </select>
                            </div>
                            <div className="h-80">
                                <Line data={monthlyChartData} options={getChartOptions('Income vs Expenses')} />
                            </div>
                        </div>
                    )}

                    {/* Category Breakdown */}
                    {categoryChartData && (
                        <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700">
                            <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light mb-4">
                                Spending by Category
                            </h3>
                            <div className="h-80">
                                <Doughnut
                                    data={categoryChartData}
                                    options={{
                                        ...getChartOptions('Category Breakdown'),
                                        plugins: {
                                            ...getChartOptions('').plugins,
                                            legend: {
                                                ...getChartOptions('').plugins.legend,
                                                position: 'right'
                                            }
                                        },
                                        scales: undefined
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Spending Trends */}
                    {trendsChartData && (
                        <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700">
                            <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light mb-4">
                                Spending Trends
                            </h3>
                            <div className="h-80">
                                <Line data={trendsChartData} options={getChartOptions('Daily Spending Pattern')} />
                            </div>
                        </div>
                    )}

                    {/* Top Categories */}
                    {topCategoriesChartData && (
                        <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700">
                            <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light mb-4">
                                Top Spending Categories
                            </h3>
                            <div className="h-80">
                                <Bar
                                    data={topCategoriesChartData}
                                    options={{
                                        ...getChartOptions('Highest Spending Categories'),
                                        indexAxis: 'y'
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Day of Week Analysis */}
                {dayOfWeekChartData && (
                    <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700 mb-8">
                        <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light mb-4">
                            Spending by Day of Week
                        </h3>
                        <div className="h-80">
                            <Bar data={dayOfWeekChartData} options={getChartOptions('Average Spending by Day')} />
                        </div>
                    </div>
                )}

                {/* Summary Table */}
                {topCategories && topCategories.categories.length > 0 && (
                    <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700">
                        <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light mb-4">
                            Detailed Breakdown
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border-primary dark:border-neutral-700">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary dark:text-neutral-400">
                                            Category
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary dark:text-neutral-400">
                                            Transactions
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary dark:text-neutral-400">
                                            Average
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary dark:text-neutral-400">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topCategories.categories.map((cat, index) => (
                                        <tr key={index} className="border-b border-border-primary dark:border-neutral-700 hover:bg-bg-secondary dark:hover:bg-neutral-700 transition-colors">
                                            <td className="py-3 px-4 text-text-primary dark:text-neutral-100">
                                                {cat.category}
                                            </td>
                                            <td className="py-3 px-4 text-right text-text-secondary dark:text-neutral-400">
                                                {cat.count}
                                            </td>
                                            <td className="py-3 px-4 text-right text-text-secondary dark:text-neutral-400">
                                                {user?.currency || 'XAF'} {formatCurrency(cat.average)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-medium text-text-primary dark:text-neutral-100">
                                                {user?.currency || 'XAF'} {formatCurrency(cat.total)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {(!categoryData || categoryData.categories.length === 0) && (
                    <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-12 border border-border-primary dark:border-neutral-700 text-center">
                        <i className="bi bi-graph-up text-6xl text-border-primary dark:text-neutral-600 mb-4 block"></i>
                        <h3 className="text-xl font-medium text-text-primary dark:text-neutral-100 mb-2">
                            No Data Available
                        </h3>
                        <p className="text-text-secondary dark:text-neutral-400 mb-6">
                            Start adding transactions to see your financial reports
                        </p>
                        <button
                            onClick={() => navigate('/transactions')}
                            className="px-6 py-3 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary-kombu transition-colors"
                        >
                            Add Transactions
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Reports;