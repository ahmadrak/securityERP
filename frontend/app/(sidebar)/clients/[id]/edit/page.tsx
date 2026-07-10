'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loading } from '@/components/Loading';

export default function EditClient() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    contactInfo: '',
  });

  useEffect(() => {
    const fetchClient = async () => {
      setLoading(true)
      const res = await api.get(`/clients/${id}`);
      setForm({
        name: res.data.name || '',
        contactInfo: res.data.contactInfo || '',
      });
      setLoading(false)
    };
      
    if (id) fetchClient();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.patch(`/clients/${id}`, form);
      router.push(`/clients/${id}`);
    } catch {
      alert('Failed to update client');
    }
  };
 if (loading) return <Loading/>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-xl bg-white shadow-md rounded-2xl p-6">

        <h1 className="text-2xl font-bold mb-4">Edit Client</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm text-gray-600">Client Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Contact Info</label>
            <input
              name="contactInfo"
              value={form.contactInfo}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push(`/clients/${id}`)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              Update
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}