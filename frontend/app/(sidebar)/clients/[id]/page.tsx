'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loading } from '@/components/Loading';

export default function ClientDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    const fetchClient = async () => {
      const res = await api.get(`/clients/${id}`);
      setClient(res.data);
    };

    if (id) fetchClient();
  }, [id]);

  if (!client) return <Loading/>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-xl bg-white shadow-md rounded-2xl p-6">

        <h1 className="text-2xl font-bold mb-4">Client Details</h1>

        <div className="space-y-3">
          <p><strong>Name:</strong> {client.name}</p>
          <p><strong>Contact:</strong> {client.contactInfo || 'N/A'}</p>
          <p className="text-sm text-gray-400">
            Created: {new Date(client.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => router.push('/clients')}
            className="px-4 py-2 border rounded"
          >
            Back
          </button>

          <button
            onClick={() => router.push(`/clients/${id}/edit`)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
        </div>

      </div>
    </div>
  );
}