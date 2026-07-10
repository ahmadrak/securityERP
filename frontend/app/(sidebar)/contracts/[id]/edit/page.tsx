'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loading } from '@/components/Loading';

export default function EditContract() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const res = await api.get(`/contracts/${id}`);
      setForm({
        startDate: res.data.startDate,
        endDate: res.data.endDate || '',
      });
      setLoading(false)
    };

    if (id) fetch();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.patch(`/contracts/${id}`, form);
    router.push(`/contracts/${id}`);
  };
  if (loading) return <Loading/>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-xl bg-white shadow-md rounded-2xl p-6">

        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-4">Edit Contract</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={e => setForm({ ...form, startDate: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">End Date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={e => setForm({ ...form, endDate: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">

            <button
              type="button"
              onClick={() => router.push(`/contracts/${id}`)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}