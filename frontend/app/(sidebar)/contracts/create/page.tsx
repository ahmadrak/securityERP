'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Client {
  id: string;
  name: string;
}

export default function CreateContract() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);

  const [form, setForm] = useState({
    clientId: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const fetchClients = async () => {
      const res = await api.get('/clients');
      setClients(res.data);
    };
    fetchClients();
  }, []);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!form.clientId) {
    alert('Please select a client');
    return;
  }

  try {
    await api.post('/contracts', {
      clientId: form.clientId,
      startDate: new Date(form.startDate),
      endDate: form.endDate ? new Date(form.endDate) : null,
    });

    router.push('/contracts');
  } catch (err) {
    console.error(err);
    alert('Failed to create contract');
  }
};
  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">

      <h2 className="text-xl font-bold mb-4">Create Contract</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label>Client</label>
          <select
            value={form.clientId}
            onChange={e => setForm({ ...form, clientId: e.target.value })}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select client</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Start Date</label>
          <input
            type="date"
            onChange={e => setForm({ ...form, startDate: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label>End Date</label>
          <input
            type="date"
            onChange={e => setForm({ ...form, endDate: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
        <button
              type="button"
              onClick={() => router.push(`/contracts`)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>

      </form>
    </div>
  );
}