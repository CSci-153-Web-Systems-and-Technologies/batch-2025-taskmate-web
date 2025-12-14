// app/dashboard/provider/earning/components/EarningHistoryTable.tsx
import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface Transaction {
    id: string;
    customerName: string;
    serviceTitle: string;
    date: string;
    amount: number; 
    payoutAmount: number; 
    status: 'Paid' | 'Pending' | 'Canceled';
}

interface EarningHistoryTableProps {
    transactions: Transaction[];
}

const formatCurrency = (amount: number) => `₱${amount.toLocaleString()}`;

const getStatusDisplay = (status: Transaction['status']) => {
    switch (status) {
        case 'Paid': return { icon: CheckCircle, classes: 'text-green-600 bg-green-100' };
        case 'Pending': return { icon: Clock, classes: 'text-yellow-600 bg-yellow-100' };
        case 'Canceled': return { icon: XCircle, classes: 'text-red-600 bg-red-100' };
        default: return { icon: Clock, classes: 'text-gray-600 bg-gray-100' };
    }
};

export default function EarningHistoryTable({ transactions }: EarningHistoryTableProps) {
    return (
        <section className="bg-card p-6 rounded-xl shadow-lg border border-border">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Transaction History</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Transaction ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Service</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer Paid</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Net Payout</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                        {transactions.map(t => {
                            const statusDisplay = getStatusDisplay(t.status);
                            return (
                                <tr key={t.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{t.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{t.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{t.serviceTitle}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{t.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-gray-500">
                                        {formatCurrency(t.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-foreground">
                                        {formatCurrency(t.payoutAmount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusDisplay.classes}`}>
                                            <statusDisplay.icon className="h-3 w-3 mr-1" />
                                            {t.status}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {transactions.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground">
                        No transactions recorded yet.
                    </div>
                )}
            </div>
        </section>
    );
}