'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Contract {
  id: string;
  client?: {
    name: string;
  };
}

export default function CreateLocation() {
  const router = useRouter();

  const [contracts, setContracts] = useState<Contract[]>([]);

  const [form, setForm] = useState({
    contractId: '',
    name: '',
    maleGuards: '',
    femaleGuards: '',
    malePrice: '',
    femalePrice: '',
  });

  useEffect(() => {
    const fetchContracts = async () => {
      const res = await api.get('/contracts');
      setContracts(res.data);
    };
    fetchContracts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const totalGuards =
    (Number(form.maleGuards) || 0) +
    (Number(form.femaleGuards) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.contractId) {
      alert('Select contract');
      return;
    }

    try {
      await api.post('/locations', {
        contractId: form.contractId,
        name: form.name,
        maleGuards: Number(form.maleGuards),
        femaleGuards: Number(form.femaleGuards),
        malePrice: Number(form.malePrice),
        femalePrice: Number(form.femalePrice),
        requiredGuards: totalGuards, // auto-calculated
      });

      router.push('/locations');
    } catch (err) {
      console.error(err);
      alert('Failed to create location');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">

        <h2 className="text-xl font-bold mb-4">Create Location</h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* CONTRACT */}
          <div>
            <label className="text-sm font-medium">Contract</label>
            <select
              name="contractId"
              value={form.contractId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select contract</option>
              {contracts.map(c => (
                <option key={c.id} value={c.id}>
                  {c.client?.name || 'Client'} - {c.id.slice(0, 6)}
                </option>
              ))}
            </select>
          </div>

          {/* NAME */}
          <div>
            <label className="text-sm font-medium">Location Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="e.g. RAK Mall"
            />
          </div>

          {/* GUARDS */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Guards توزيع الحراس</h3>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                name="maleGuards"
                placeholder="Male Guards"
                value={form.maleGuards}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                type="number"
                name="femaleGuards"
                placeholder="Female Guards"
                value={form.femaleGuards}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Total Guards: {totalGuards}
            </p>
          </div>

          {/* PRICING */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Pricing التسعير</h3>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                name="malePrice"
                placeholder="Male Guard Price"
                value={form.malePrice}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                type="number"
                name="femalePrice"
                placeholder="Female Guard Price"
                value={form.femalePrice}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.push('/locations')}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Create Location
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}