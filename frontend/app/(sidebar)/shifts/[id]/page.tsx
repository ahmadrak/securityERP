'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function ShiftDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [shift, setShift] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get(`/shifts/${id}`);
      setShift(res.data);
    };
    if (id) fetch();
  }, [id]);

  if (!shift) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">

      <h2 className="text-xl font-bold mb-4">Shift Details</h2>

      <p><strong>Location:</strong> {shift.location?.name}</p>
      <p><strong>Client:</strong> {shift.location?.contract?.client?.name}</p>
      <p><strong>Start:</strong> {new Date(shift.startTime).toLocaleString()}</p>
      <p><strong>End:</strong> {new Date(shift.endTime).toLocaleString()}</p>

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={() => router.push('/shifts')} className="border px-4 py-2 rounded">
          Back
        </button>

        <button onClick={() => router.push(`/shifts/${id}/edit`)} className="bg-blue-500 text-white px-4 py-2 rounded">
          Edit
        </button>
      </div>

    </div>
  );
}