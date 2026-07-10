'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function EditLocation() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    requiredGuards: '',
  });

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get(`/shifts/${id}`);
      setForm({
        name: res.data.name,
        requiredGuards: res.data.requiredGuards.toString(),
      });
    };

    if (id) fetch();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.patch(`/shifts/${id}`, {
      name: form.name,
      requiredGuards: Number(form.requiredGuards),
    });

    router.push(`/shifts/${id}`);
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">

      <h2 className="text-xl font-bold mb-4">Edit shift</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label>Name</label>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Required Guards</label>
          <input
            type="number"
            value={form.requiredGuards}
            onChange={e => setForm({ ...form, requiredGuards: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.push(`/locations/${id}`)} className="border px-4 py-2 rounded">
            Cancel
          </button>

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Update
          </button>
        </div>

      </form>
    </div>
  );
}