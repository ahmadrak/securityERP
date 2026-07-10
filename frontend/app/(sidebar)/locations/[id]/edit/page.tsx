'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loading } from '@/components/Loading';

export default function EditLocation() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    requiredGuards: '',

    // 🆕 gender planning (future-ready)
    maleGuards: '',
    femaleGuards: '',

    malePrice: '',
    femalePrice: '',
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/locations/${id}`);
        const loc = res.data;

        setForm({
          name: loc.name || '',
          requiredGuards: loc.requiredGuards?.toString() || '',

          maleGuards: loc.maleGuards?.toString() || '',
          femaleGuards: loc.femaleGuards?.toString() || '',

          malePrice: loc.malePrice?.toString() || '',
          femalePrice: loc.femalePrice?.toString() || '',
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLocation();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.patch(`/locations/${id}`, {
      name: form.name,
      requiredGuards: Number(form.requiredGuards),

      maleGuards: form.maleGuards ? Number(form.maleGuards) : null,
      femaleGuards: form.femaleGuards ? Number(form.femaleGuards) : null,

      malePrice: form.malePrice ? Number(form.malePrice) : null,
      femalePrice: form.femalePrice ? Number(form.femalePrice) : null,
    });

    router.push(`/locations/${id}`);
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">

      <h2 className="text-xl font-bold mb-4">Edit Location</h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* NAME */}
        <div>
          <label className="text-sm text-gray-600">Location Name</label>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* TOTAL GUARDS */}
        <div>
          <label className="text-sm text-gray-600">Total Required Guards</label>
          <input
            type="number"
            value={form.requiredGuards}
            onChange={e => setForm({ ...form, requiredGuards: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* GENDER BREAKDOWN */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="text-sm text-gray-600">Male Guards</label>
            <input
              type="number"
              value={form.maleGuards}
              onChange={e => setForm({ ...form, maleGuards: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Female Guards</label>
            <input
              type="number"
              value={form.femaleGuards}
              onChange={e => setForm({ ...form, femaleGuards: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>

        </div>

        {/* PRICING */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="text-sm text-gray-600">Male Price</label>
            <input
              type="number"
              value={form.malePrice}
              onChange={e => setForm({ ...form, malePrice: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Female Price</label>
            <input
              type="number"
              value={form.femalePrice}
              onChange={e => setForm({ ...form, femalePrice: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4 border-t">

          <button
            type="button"
            onClick={() => router.push(`/locations/${id}`)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Update
          </button>

        </div>

      </form>
    </div>
  );
}