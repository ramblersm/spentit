'use client';
import { Clipboard, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';

type Expense = {
  id: string;
  amount: number;
  category: string;
  note?: string;
  date: string;
};

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [copiedDate, setCopiedDate] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);

  const filteredExpenses = expenses.filter((exp) => {
    if (!startDate || !endDate) return true;
    const d = new Date(exp.date);
    return d >= new Date(startDate) && d <= new Date(endDate);
  });

  const totalInRange = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const groupedByDate = filteredExpenses.reduce<Record<string, Expense[]>>((acc, exp) => {
    if (!acc[exp.date]) acc[exp.date] = [];
    acc[exp.date].push(exp);
    return acc;
  }, {});

  return (
    <main className="flex flex-col min-h-screen bg-white text-gray-900">
      <Header />

      <section className="p-4">
        {/* Date Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded-md text-sm"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded-md text-sm"
          />
        </div>

        {/* Range Summary */}
        {startDate && endDate && (
          <div className="mb-4 text-sm text-gray-700">
            Showing expenses from <strong>{startDate}</strong> to <strong>{endDate}</strong>
            <div className="text-md font-semibold mt-1">Total: ₹{totalInRange}</div>
          </div>
        )}

        {/* Grouped Expense List */}
        {Object.keys(groupedByDate).length === 0 ? (
  <p className="text-center text-gray-400">No expenses yet.</p>
) : (
  <div className="mb-6 p-4 bg-yellow-50 rounded-md relative">
    {/* One Copy Button for entire filtered range */}
    <button
      onClick={() => {
        const combined = Object.entries(groupedByDate)
          .map(([date, exps]) => {
            const lines = exps.map(
              (exp) => `• ₹${exp.amount} ${exp.note || exp.category}`
            ).join('\n');
            return `${date}\n${lines}`;
          })
          .join('\n\n');

        navigator.clipboard.writeText(combined);
        setCopiedDate('ALL');
        setTimeout(() => setCopiedDate(null), 2000);
      }}
      className="absolute top-4 right-4 text-sm text-blue-600 hover:text-blue-800 transition-transform active:scale-90"
    >
      {copiedDate === 'ALL' ? (
        <div className="flex items-center gap-1 text-green-600">
          <Check size={16} /> Copied!
        </div>
      ) : (
        <Clipboard size={16} />
      )}
    </button>

    {/* All grouped expenses shown below */}
    {Object.entries(groupedByDate).map(([date, exps]) => (
      <div key={date} className="mb-4">
        <h3 className="text-md font-semibold text-gray-700 mb-2">{date}</h3>
        <ul className="space-y-3">
          {exps.map((exp) => (
            <li key={exp.id} className="p-3 bg-gray-100 rounded-md">
              <div className="font-medium">₹{exp.amount}</div>
              <div className="text-sm text-gray-600">{exp.category}</div>
              {exp.note && (
                <div className="text-xs text-gray-500 mt-1">{exp.note}</div>
              )}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)}

      </section>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white text-3xl w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200"
        aria-label="Add expense"
      >
        +
      </button>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add Expense</h2>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const newExpense: Expense = {
                  id: crypto.randomUUID(),
                  amount: parseFloat(form.amount.value),
                  category: form.category.value,
                  note: form.note.value,
                  date: form.date.value,
                };
                const updated = [...expenses, newExpense];
                setExpenses(updated);
                localStorage.setItem('expenses', JSON.stringify(updated));
                setShowAddModal(false);
                form.reset();
              }}
            >
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  name="amount"
                  type="number"
                  required
                  className="w-full mt-1 p-2 border rounded-md text-sm"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  required
                  className="w-full mt-1 p-2 border rounded-md text-sm"
                >
                  <option value="">Select</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Misc">Misc</option>
                </select>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Note (optional)</label>
                <input
                  name="note"
                  type="text"
                  className="w-full mt-1 p-2 border rounded-md text-sm"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  name="date"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full mt-1 p-2 border rounded-md text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-sm text-gray-500 hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}