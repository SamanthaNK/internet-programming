import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toastConfig';
import { formatCurrency } from '../utils/formatCurrency';
import CustomDropdown from '../components/CustomDropdown';
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
    getSpendingByDayOfWeek,
    getSpendingInsights
} from '../services/api';

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

const CHART_COLORS = {
    income: '#7FB069',
    expense: '#E07A5F',
    balance: '#81B29A',
    categories: [
        '#D4A373',
        '#B5838D',
        '#8B9D77',
        '#C89F71',
        '#9B7E6B',
        '#A89F91',
        '#BC9B7D',
        '#7D8570',
        '#B89B7F',
        '#8E7A6B',
    ],
    trends: '#D08C60',
    bars: '#9AAE7E',
};

const getChartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'top',
            labels: {
                color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#2A2D22',
                font: { size: 12, weight: '500' },
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle'
            }
        },
        tooltip: {
            backgroundColor: 'rgba(42, 45, 34, 0.95)',
            titleColor: '#E8EFE0',
            bodyColor: '#D1D5DB',
            borderColor: '#889063',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            boxPadding: 6
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
            ticks: {
                color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#5F6355',
                font: { size: 11 }
            },
            grid: {
                color: document.documentElement.classList.contains('dark') ? '#374151' : '#E5E3DA',
                lineWidth: 1
            }
        },
        x: {
            ticks: {
                color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#5F6355',
                font: { size: 11 }
            },
            grid: {
                color: document.documentElement.classList.contains('dark') ? '#374151' : '#E5E3DA',
                lineWidth: 1
            }
        }
    }
});

function Reports() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const [monthlyData, setMonthlyData] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [trendsData, setTrendsData] = useState(null);
    const [comparisonData, setComparisonData] = useState(null);
    const [topCategories, setTopCategories] = useState(null);
    const [dayOfWeekData, setDayOfWeekData] = useState(null);
    const [aiInsights, setAiInsights] = useState([]);
    const [loadingAI, setLoadingAI] = useState(false);

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
            setLoadingAI(true);

            const [monthly, category, trends, comparison, top, dayOfWeek, insights] = await Promise.all([
                getMonthlyReport(selectedYear),
                getCategoryBreakdown(selectedPeriod, 'expense'),
                getSpendingTrends(selectedPeriod, 'day'),
                getComparisonReport(),
                getTopCategories(selectedPeriod, 5),
                getSpendingByDayOfWeek(selectedPeriod),
                getSpendingInsights(selectedPeriod)
            ]);

            setMonthlyData(monthly.data.data);
            setCategoryData(category.data.data);
            setTrendsData(trends.data.data);
            setComparisonData(comparison.data.data);
            setTopCategories(top.data.data);
            setDayOfWeekData(dayOfWeek.data.data);

            // AI insights
            if (insights.data.success) {
                setAiInsights(insights.data.data.insights);
            }

        } catch (error) {
            showToast.error('Error loading reports');
            console.error('Reports error:', error);
        } finally {
            setLoading(false);
            setLoadingAI(false);
        }
    };

    // Monthly Income vs Expense Chart
    const monthlyChartData = monthlyData ? {
        labels: monthlyData.months.map(m => m.month),
        datasets: [
            {
                label: 'Income',
                data: monthlyData.months.map(m => m.income),
                borderColor: CHART_COLORS.income,
                backgroundColor: `${CHART_COLORS.income}20`,
                tension: 0.4,
                fill: true,
                borderWidth: 2
            },
            {
                label: 'Expenses',
                data: monthlyData.months.map(m => m.expense),
                borderColor: CHART_COLORS.expense,
                backgroundColor: `${CHART_COLORS.expense}20`,
                tension: 0.4,
                fill: true,
                borderWidth: 2
            }
        ]
    } : null;

    // Category Breakdown Doughnut Chart
    const categoryChartData = categoryData && categoryData.categories.length > 0 ? {
        labels: categoryData.categories.map(c => c.category),
        datasets: [{
            data: categoryData.categories.map(c => c.amount),
            backgroundColor: CHART_COLORS.categories.slice(0, categoryData.categories.length),
            borderWidth: 2,
            borderColor: document.documentElement.classList.contains('dark') ? '#1F2937' : '#FFFFFF',
            hoverOffset: 8
        }]
    } : null;

    // Spending Trends Line Chart
    const trendsChartData = trendsData ? {
        labels: trendsData.trends.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [{
            label: 'Daily Spending',
            data: trendsData.trends.map(t => t.expense),
            borderColor: CHART_COLORS.trends,
            backgroundColor: `${CHART_COLORS.trends}15`,
            tension: 0.4,
            fill: true,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: CHART_COLORS.trends,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 6
        }]
    } : null;

    // Top Categories Bar Chart
    const topCategoriesChartData = topCategories && topCategories.categories.length > 0 ? {
        labels: topCategories.categories.map(c => c.category),
        datasets: [{
            label: 'Total Spent',
            data: topCategories.categories.map(c => c.total),
            backgroundColor: topCategories.categories.map((_, i) => CHART_COLORS.categories[i % CHART_COLORS.categories.length]),
            borderColor: topCategories.categories.map((_, i) => CHART_COLORS.categories[i % CHART_COLORS.categories.length]),
            borderWidth: 1,
            borderRadius: 4
        }]
    } : null;

    // Day of Week Chart
    const dayOfWeekChartData = dayOfWeekData ? {
        labels: dayOfWeekData.days.map(d => d.day),
        datasets: [{
            label: 'Average Spending',
            data: dayOfWeekData.days.map(d => d.average),
            backgroundColor: CHART_COLORS.bars,
            borderColor: '#354024',
            borderWidth: 1,
            borderRadius: 4
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
                                    ? 'bg-primary-kombu dark:bg-primary-moss text-white shadow-md'
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
                        <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700 hover:shadow-lg transition-shadow">
                            <h3 className="text-sm text-text-secondary dark:text-neutral-400 uppercase mb-2 font-medium">
                                Income Change
                            </h3>
                            <div className="flex items-baseline space-x-2">
                                <div className="text-3xl font-serif font-medium" style={{ color: CHART_COLORS.income }}>
                                    {comparisonData.changes.income >= 0 ? '+' : ''}
                                    {comparisonData.changes.income}%
                                </div>
                                <i className={`bi bi-arrow-${comparisonData.changes.income >= 0 ? 'up' : 'down'} text-xl`}
                                    style={{ color: comparisonData.changes.income >= 0 ? CHART_COLORS.income : CHART_COLORS.expense }}></i>
                            </div>
                            <p className="text-sm text-text-muted dark:text-neutral-400 mt-2">
                                vs last month
                            </p>
                        </div>

                        <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700 hover:shadow-lg transition-shadow">
                            <h3 className="text-sm text-text-secondary dark:text-neutral-400 uppercase mb-2 font-medium">
                                Expense Change
                            </h3>
                            <div className="flex items-baseline space-x-2">
                                <div className="text-3xl font-serif font-medium" style={{ color: CHART_COLORS.expense }}>
                                    {comparisonData.changes.expense >= 0 ? '+' : ''}
                                    {comparisonData.changes.expense}%
                                </div>
                                <i className={`bi bi-arrow-${comparisonData.changes.expense >= 0 ? 'up' : 'down'} text-xl`}
                                    style={{ color: comparisonData.changes.expense >= 0 ? CHART_COLORS.expense : CHART_COLORS.income }}></i>
                            </div>
                            <p className="text-sm text-text-muted dark:text-neutral-400 mt-2">
                                vs last month
                            </p>
                        </div>

                        <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700 hover:shadow-lg transition-shadow">
                            <h3 className="text-sm text-text-secondary dark:text-neutral-400 uppercase mb-2 font-medium">
                                Savings Rate
                            </h3>
                            <div className="flex items-baseline space-x-2">
                                <div className="text-3xl font-serif font-medium" style={{ color: CHART_COLORS.balance }}>
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

                {/* AI Spending Insights */}
                {aiInsights.length > 0 && (
                    <div className="bg-gradient-to-r from-primary-light/50 to-accent-sage/30 dark:from-neutral-800/50 dark:to-neutral-700/50 backdrop-blur-sm rounded-xl shadow-md p-6 mb-8 border border-primary-moss/20 dark:border-primary-moss/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-moss to-accent-sage rounded-xl flex items-center justify-center shadow-md">
                                <i className="bi bi-stars text-2xl text-white"></i>
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-primary-kombu dark:text-primary-light">
                                    AI Spending Analysis
                                </h3>
                                <p className="text-sm text-text-muted dark:text-neutral-500">
                                    Key insights from your {selectedPeriod} data
                                </p>
                            </div>
                        </div>

                        {loadingAI ? (
                            <div className="flex items-center gap-2 text-text-secondary dark:text-neutral-400">
                                <div className="w-4 h-4 border-2 border-primary-moss border-t-transparent rounded-full animate-spin"></div>
                                <span>Analyzing your spending patterns...</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {aiInsights.map((insight, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 bg-white/60 dark:bg-neutral-700/60 rounded-lg hover:bg-white dark:hover:bg-neutral-700 transition-colors">
                                        <div className="w-8 h-8 bg-primary-moss/30 dark:bg-primary-moss/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-sm font-medium text-primary-kombu dark:text-primary-light">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-secondary dark:text-neutral-400 leading-relaxed">
                                            {insight}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Monthly Income vs Expense */}
                    {monthlyChartData && (
                        <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light">
                                    Monthly Overview
                                </h3>
                                <CustomDropdown
                                    value={selectedYear.toString()}
                                    onChange={(val) => setSelectedYear(parseInt(val))}
                                    options={[...Array(5)].map((_, i) => {
                                        const year = new Date().getFullYear() - i;
                                        return { value: year.toString(), label: year.toString() };
                                    })}
                                    className="w-32"
                                />
                            </div>
                            <div className="h-80">
                                <Line data={monthlyChartData} options={getChartOptions('Income vs Expenses')} />
                            </div>
                        </div>
                    )}

                    {/* Category Breakdown */}
                    {categoryChartData && (
                        <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700 hover:shadow-lg transition-shadow">
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
                        <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700 hover:shadow-lg transition-shadow">
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
                        <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700 hover:shadow-lg transition-shadow">
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
                    <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700 hover:shadow-lg transition-shadow mb-8">
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
                    <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700 hover:shadow-lg transition-shadow">
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
                                                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CHART_COLORS.categories[index % CHART_COLORS.categories.length] }}></span>
                                                {cat.category}
                                            </td>
                                            <td className="py-3 px-4 text-right text-text-secondary dark:text-neutral-400">
                                                {cat.count}
                                            </td>
                                            <td className="py-3 px-4 text-right text-text-secondary dark:text-neutral-400">
                                                {formatCurrency(cat.average, user?.currency || 'XAF')} {user?.currency === 'XAF' ? 'frs' : ''}
                                            </td>
                                            <td className="py-3 px-4 text-right font-medium text-text-primary dark:text-neutral-100">
                                                {formatCurrency(cat.total, user?.currency || 'XAF')} {user?.currency === 'XAF' ? 'frs' : ''}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Export Button */}
                <div className="flex justify-center m-8">
                    <button
                        onClick={() => navigate('/export')}
                        className="flex items-center gap-2 px-8 py-3 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary-kombu transition-all shadow-md hover:shadow-lg font-medium"
                    >
                        <i className="bi bi-download"></i>
                        <span>Export Report</span>
                    </button>
                </div>

                {/* Empty State */}
                {(!categoryData || categoryData.categories.length === 0) && (
                    <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-12 border border-border-primary dark:border-neutral-700 text-center hover:shadow-lg transition-shadow">
                        <i className="bi bi-graph-up text-6xl text-border-primary dark:text-neutral-600 mb-4 block"></i>
                        <h3 className="text-xl font-medium text-text-primary dark:text-neutral-100 mb-2">
                            No Data Available
                        </h3>
                        <p className="text-text-secondary dark:text-neutral-400 mb-6">
                            Start adding transactions to see your financial reports
                        </p>
                        <button
                            onClick={() => navigate('/transactions')}
                            className="px-6 py-3 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary-kombu transition-colors shadow-md hover:shadow-lg"
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