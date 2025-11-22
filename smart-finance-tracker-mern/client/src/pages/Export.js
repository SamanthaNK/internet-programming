// src/pages/Export.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toastConfig';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    getCategories,
    getTransactions,
    getSummaryStats,
    getCategoryBreakdown
} from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function Export() {
    const [user, setUser] = useState(null);
    const [categories, setCategories] = useState([]);
    const [exporting, setExporting] = useState(false);
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        category: '',
        type: ''
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/signin');
            return;
        }
        setUser(JSON.parse(userData));
        loadCategories();
    }, [navigate]);

    const loadCategories = async () => {
        try {
            const res = await getCategories();
            setCategories(res.data?.data || []);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // CSV export function
    const handleExportCSV = async () => {
        setExporting(true);
        try {
            // Get filtered transactions
            const params = {};
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = filters.endDate;
            if (filters.category) params.category = filters.category;
            if (filters.type) params.type = filters.type;

            const response = await getTransactions(params);
            const transactions = response.data.data;

            if (transactions.length === 0) {
                showToast.warning('No transactions found for the selected filters');
                setExporting(false);
                return;
            }

            // Create CSV content
            const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
            const csvRows = [headers.join(',')];

            transactions.forEach(t => {
                const row = [
                    new Date(t.transactionDate).toLocaleDateString(),
                    t.type,
                    t.category?.name || 'Uncategorized',
                    t.amount,
                    `"${(t.description || '').replace(/"/g, '""')}"`
                ];
                csvRows.push(row.join(','));
            });

            // Add summary
            const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

            csvRows.push('');
            csvRows.push('Summary');
            csvRows.push(`Total Income,${totalIncome}`);
            csvRows.push(`Total Expenses,${totalExpense}`);
            csvRows.push(`Net Balance,${totalIncome - totalExpense}`);

            // Download CSV
            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `transactions_${filters.startDate}_to_${filters.endDate}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast.success('CSV exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            showToast.error('Error exporting CSV');
        } finally {
            setExporting(false);
        }
    };

    // PDF export function with Charts
    const handleExportPDF = async () => {
        setExporting(true);
        try {
            // Get data
            const params = {};
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = filters.endDate;
            if (filters.category) params.category = filters.category;
            if (filters.type) params.type = filters.type;

            const [transactionsRes, summaryRes, categoryRes] = await Promise.all([
                getTransactions(params).catch(() => null),
                getSummaryStats('all').catch(() => null),
                getCategoryBreakdown('all', 'expense').catch(() => null)
            ]);

            if (!transactionsRes?.data?.data || !summaryRes?.data?.data || !categoryRes?.data?.data) {
                showToast.error('Failed to load report data. Please try again.');
                setExporting(false);
                return;
            }

            const transactions = transactionsRes.data.data ?? [];
            const summary = summaryRes.data.data ?? { totalIncome: 0, totalExpense: 0, balance: 0 };
            const categoryData = categoryRes.data.data ?? { categories: [] };

            if (transactions.length === 0) {
                showToast.warning('No transactions found for the selected filters');
                setExporting(false);
                return;
            }

            // Create PDF
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;

            // Header
            doc.setFillColor(53, 64, 36);
            doc.rect(0, 0, pageWidth, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.text('Financial Report', pageWidth / 2, 20, { align: 'center' });

            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(`${filters.startDate} to ${filters.endDate}`, pageWidth / 2, 30, { align: 'center' });

            // Summary Section
            let yPos = 50;
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Summary', 14, yPos);

            yPos += 10;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');

            // Summary boxes
            const boxWidth = (pageWidth - 42) / 3;
            const boxHeight = 30;

            // Income box
            doc.setFillColor(168, 184, 158);
            doc.roundedRect(14, yPos, boxWidth, boxHeight, 3, 3, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.text('Total Income', 14 + boxWidth / 2, yPos + 10, { align: 'center' });
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(`${user?.currency || 'XAF'} ${summary.totalIncome.toFixed(2)}`, 14 + boxWidth / 2, yPos + 22, { align: 'center' });

            // Expense box
            doc.setFillColor(200, 139, 122);
            doc.roundedRect(14 + boxWidth + 7, yPos, boxWidth, boxHeight, 3, 3, 'F');
            doc.text('Total Expenses', 14 + boxWidth + 7 + boxWidth / 2, yPos + 10, { align: 'center' });
            doc.setFontSize(14);
            doc.text(`${user?.currency || 'XAF'} ${summary.totalExpense.toFixed(2)}`, 14 + boxWidth + 7 + boxWidth / 2, yPos + 22, { align: 'center' });

            // Balance box
            doc.setFillColor(184, 212, 208);
            doc.roundedRect(14 + (boxWidth + 7) * 2, yPos, boxWidth, boxHeight, 3, 3, 'F');
            doc.text('Balance', 14 + (boxWidth + 7) * 2 + boxWidth / 2, yPos + 10, { align: 'center' });
            doc.setFontSize(14);
            doc.text(`${user?.currency || 'XAF'} ${summary.balance.toFixed(2)}`, 14 + (boxWidth + 7) * 2 + boxWidth / 2, yPos + 22, { align: 'center' });

            yPos += 45;

            // Category Breakdown (table)
            if (categoryData.categories.length > 0) {
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text('Spending by Category', 14, yPos);

                yPos += 10;

                const categoryTableData = categoryData.categories.slice(0, 5).map(cat => [
                    cat.category,
                    `${user?.currency || 'XAF'} ${cat.amount.toFixed(2)}`,
                    `${cat.percentage}%`
                ]);

                autoTable(doc, {
                    startY: yPos,
                    head: [['Category', 'Amount', 'Percentage']],
                    body: categoryTableData,
                    theme: 'grid',
                    headStyles: { fillColor: [53, 64, 36] },
                    margin: { left: 14, right: 14 }
                });

                yPos = doc.lastAutoTable.finalY + 15;
            }

            // Transactions Table
            if (yPos > pageHeight - 60) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Transactions', 14, yPos);

            yPos += 10;

            const tableData = transactions.slice(0, 20).map(t => [
                new Date(t.transactionDate).toLocaleDateString(),
                t.type.charAt(0).toUpperCase() + t.type.slice(1),
                t.category?.name || 'Uncategorized',
                `${user?.currency || 'XAF'} ${t.amount.toFixed(2)}`,
                t.description || '-'
            ]);

            autoTable(doc, {
                startY: yPos,
                head: [['Date', 'Type', 'Category', 'Amount', 'Description']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: [53, 64, 36] },
                margin: { left: 14, right: 14 },
                styles: { fontSize: 9 }
            });

            // Footer
            const totalPages = doc.internal.pages.length - 1;
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(9);
                doc.setTextColor(150);
                doc.text(
                    `Page ${i} of ${totalPages}`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
                doc.text(
                    `Generated on ${new Date().toLocaleDateString()}`,
                    14,
                    pageHeight - 10
                );
            }

            // Save PDF
            doc.save(`financial_report_${filters.startDate}_to_${filters.endDate}.pdf`);
            showToast.success('PDF exported successfully!');
        } catch (error) {
            console.error('PDF export error:', error);
            showToast.error('Error exporting PDF');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-bg-primary dark:bg-neutral-900">
            <Navbar user={user} />

            <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-medium text-accent-cafe dark:text-primary-light">Export Data</h1>
                </div>

                {/* Filters */}
                <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700 mb-6">
                    <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light mb-4">Filters</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-neutral-300 mb-2">Start Date</label>
                            <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange}
                                className="w-full px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-neutral-300 mb-2">End Date</label>
                            <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange}
                                className="w-full px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-neutral-300 mb-2">Type</label>
                            <select name="type" value={filters.type} onChange={handleFilterChange}
                                className="w-full px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent">
                                <option value="">All Types</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-neutral-300 mb-2">Category</label>
                            <select name="category" value={filters.category} onChange={handleFilterChange}
                                className="w-full px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent">
                                <option value="">All Categories</option>
                                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Export Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700">
                        <div className="flex items-center gap-3 mb-4">
                            <i className="bi bi-file-earmark-spreadsheet text-3xl text-accent-sage dark:text-green-400"></i>
                            <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light">CSV Export</h3>
                        </div>
                        <p className="text-text-secondary dark:text-neutral-400 text-sm mb-4 flex-1">Spreadsheet format for Excel and Google Sheets</p>
                        <button onClick={handleExportCSV} disabled={exporting}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent-sage dark:bg-green-700 text-white rounded-lg hover:bg-accent-sage/90 dark:hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {exporting ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> <span>Exporting...</span></> :
                                <><i className="bi bi-download" /> <span>Download CSV</span></>}
                        </button>
                    </div>

                    <div className="flex flex-col bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700">
                        <div className="flex items-center gap-3 mb-4">
                            <i className="bi bi-file-earmark-pdf text-3xl text-accent-terracotta dark:text-red-400"></i>
                            <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light">PDF Report</h3>
                        </div>
                        <p className="text-text-secondary dark:text-neutral-400 text-sm mb-4 flex-1">Professional report with summary and breakdown</p>
                        <button onClick={handleExportPDF} disabled={exporting}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent-terracotta dark:bg-red-700 text-white rounded-lg hover:bg-accent-terracotta/90 dark:hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {exporting ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> <span>Generating...</span></> :
                                <><i className="bi bi-download" /> <span>Download PDF</span></>}
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-sm text-text-secondary dark:text-neutral-400">
                    <p><strong>Tip:</strong> Use filters above to export specific periods or categories. CSV works best for spreadsheets, PDF for sharing/printing.</p>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Export;