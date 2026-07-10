'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Shift {
  id: string;
  startTime: string;
  endTime: string;
  location?: {
    name: string;
    contract?: {
      client?: {
        name: string;
      };
    };
  };
}

export default function ShiftsPage() {
  const router = useRouter();
  const [shifts, setShifts] = useState<Shift[]>([]);

  const fetchShifts = async () => {
    const res = await api.get('/shifts');
    setShifts(res.data);
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleDelete = async (id: string) => {
    if (!confirm('Delete shift?')) return;

    await api.delete(`/shifts/${id}`);
    setShifts(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="p-6">

      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Shifts</h2>

        <button
          onClick={() => router.push('/shifts/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Shift
        </button>
      </div>

      <div className="space-y-2">
        {shifts.map(shift => (
          <div key={shift.id} className="p-4 border rounded flex justify-between">

            <div>
              <p className="font-semibold">
                {formatTime(shift.startTime)} → {formatTime(shift.endTime)}
              </p>

              <p className="text-sm text-gray-500">
                Location: {shift.location?.name || 'N/A'}
              </p>

              <p className="text-sm text-gray-400">
                Client: {shift.location?.contract?.client?.name || 'N/A'}
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => router.push(`/shifts/${shift.id}`)} className="text-blue-500">View</button>
              <button onClick={() => router.push(`/shifts/${shift.id}/edit`)} className="text-yellow-500">Edit</button>
              <button onClick={() => handleDelete(shift.id)} className="text-red-500">Delete</button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}