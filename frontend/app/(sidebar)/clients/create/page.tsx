'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function CreateClient() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    contactInfo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/clients', form);
      router.push('/clients');
    } catch (err) {
      console.error(err);
      alert('Failed to create client');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-xl bg-white shadow-md rounded-2xl p-6">

        <h1 className="text-2xl font-bold mb-4">Add Client</h1>

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
              placeholder="Phone / Email"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push('/clients')}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              Create
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}