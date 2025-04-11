/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Mic, MicOff, Trash2 } from 'lucide-react';
import * as chrono from 'chrono-node';

type Expense = {
  id: string;
  amount: number;
  category: string;
  note?: string;
  date: string;
};
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceExpense, setVoiceExpense] = useState<Partial<Expense>>({});
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

  const startListening = () => {
    const isSupported =
        typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

      if (!isSupported) {
        alert("Voice input isn’t supported on this device yet. Works best on Chrome/Android.");
        return;
      }

    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setListening(true);

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      parseVoiceText(result);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
  };

  const parseVoiceText = (text: string) => {
    const words = text.toLowerCase().split(' ');
    const amount = parseFloat(words.find((w) => !isNaN(Number(w))) || '0');
    const category = words.find(
      (w) => isNaN(Number(w)) && !['for', 'today'].includes(w)
    ) || 'misc';

    const parsedDate = chrono.parseDate(text, new Date(), { forwardDate: true });
    const date = parsedDate ? parsedDate : new Date();

    setVoiceExpense({
      amount,
      category,
      date: date.toISOString().split('T')[0],
    });
  };

  const confirmVoiceExpense = () => {
    if (!voiceExpense.amount || !voiceExpense.date || !voiceExpense.category) return;

    const newExp: Expense = {
      id: crypto.randomUUID(),
      amount: voiceExpense.amount,
      category: voiceExpense.category,
      note: '',
      date: voiceExpense.date,
    };

    const updated = [...expenses, newExp];
    setExpenses(updated);
    localStorage.setItem('expenses', JSON.stringify(updated));
    const audio = new Audio('/sounds/success.wav');
    audio.play();

    setTranscript('');
    setVoiceExpense({});
  };

  return (
    <main className="flex flex-col min-h-screen bg-white text-gray-900">
      <Header />

      <section className="p-4">
        <h4 className="text-sm font-medium text-gray-600 mb-1">
        Select a date range to filter your expenses:
        </h4>
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

        {startDate && endDate && (
          <div className="mb-4 text-sm text-gray-700">
            Showing expenses from <strong>{startDate}</strong> to <strong>{endDate}</strong>
            <div className="text-md font-semibold mt-1">Total: ₹{totalInRange}</div>
          </div>
        )}

        {Object.keys(groupedByDate).length === 0 ? (
          <p className="text-center text-gray-400">No expenses. Tap '+' below to add an expense.</p>
        ) : (
              
          <div className="mb-6 p-4 bg-yellow-50 rounded-md relative">
            {Object.keys(groupedByDate).length > 0 && (
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
    className={`mb-4 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all duration-200
      ${copiedDate === 'ALL'
        ? 'bg-green-100 text-green-800 scale-95'
        : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'}`}
  >
    {copiedDate === 'ALL' ? (
      <>
        <span className="animate-pulse">✅ Copied!</span>
      </>
    ) : (
      <>
        📋 Copy All
      </>
    )}
  </button>
)}

{Object.entries(groupedByDate).map(([date, exps]) => (
  <div key={date} className="mb-4">
    <h3 className="text-md font-semibold text-gray-700 mb-2">{date}</h3>
    <ul className="space-y-3">
      {exps.map((exp) => (
        <li key={exp.id} className="p-3 bg-gray-100 rounded-md flex justify-between items-start">
          <div>
            <div className="font-medium">₹{exp.amount}</div>
            <div className="text-sm text-gray-600">{exp.category}</div>
            {exp.note && (
              <div className="text-xs text-gray-500 mt-1">{exp.note}</div>
            )}
          </div>
          <button
            onClick={() => {
              if (confirm('Delete this expense?')) {
                const updated = expenses.filter((e) => e.id !== exp.id);
                setExpenses(updated);
                localStorage.setItem('expenses', JSON.stringify(updated));
              }
            }}
            className="text-red-500 hover:text-red-700 ml-4"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </li>
      ))}
    </ul>
  </div>
))}
          </div>
        )}

        {/* Voice Transcript UI */}
        {transcript && (
          <div className="mt-4 bg-gray-100 p-4 rounded-md">
            <p className="italic text-gray-500 mb-1">Heard: “{transcript}”</p>
            <p><strong>Amount:</strong> ₹{voiceExpense.amount}</p>
            <p><strong>Category:</strong> {voiceExpense.category}</p>
            <p><strong>Date:</strong> {voiceExpense.date}</p>
            <div className="flex gap-3 mt-3">
            <button
              onClick={confirmVoiceExpense}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Confirm Expense
            </button>
            <button
              onClick={() => {
                setTranscript('');
                setVoiceExpense({});
              }}
              className="text-sm text-gray-600 underline hover:text-gray-800"
            >
              Cancel
            </button>
        </div>

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

      {/* Floating Mic Button */}
      <button
        onClick={startListening}
        className="fixed bottom-6 right-24 bg-green-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-green-700 flex items-center justify-center transition-all duration-200"
        aria-label="Voice add"
      >
        {listening ? <MicOff size={24} /> : <Mic size={24} />}
      </button>

      {/* Modal remains unchanged — can keep it here if needed */}
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
                const audio = new Audio('/sounds/success.wav');
                audio.play();
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
