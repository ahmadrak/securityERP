'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Location {
  id: string;
  name: string;
  contract?: {
    client?: {
      name: string;
    };
  };
}

export default function CreateShift() {
  const router = useRouter();

  const [locations, setLocations] = useState<Location[]>([]);

  const [form, setForm] = useState({
    locationId: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    const fetchLocations = async () => {
      const res = await api.get('/locations');
      setLocations(res.data);
    };
    fetchLocations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.locationId) {
      alert('Select location');
      return;
    }

    await api.post('/shifts', {
         locationId: form.locationId,
         startTime: form.startTime,   // ✅ string
         endTime: form.endTime,       // ✅ string
        });

    router.push('/shifts');
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">

      <h2 className="text-xl font-bold mb-4">Create Shift</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label>Location</label>
          <select
            value={form.locationId}
            onChange={e => setForm({ ...form, locationId: e.target.value })}
            className="w-full border p-2 rounded"
          >
            <option value="">Select location</option>
            {locations.map(l => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.contract?.client?.name})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Start Time</label>
          <input
            type="datetime-local"
            onChange={e => setForm({ ...form, startTime: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>End Time</label>
          <input
            type="datetime-local"
            onChange={e => setForm({ ...form, endTime: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.push('/shifts')} className="border px-4 py-2 rounded">
            Cancel
          </button>

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Create
          </button>
        </div>

      </form>
    </div>
  );
}