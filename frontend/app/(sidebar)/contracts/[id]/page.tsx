'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loading } from '@/components/Loading';

export default function ContractDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get(`/contracts/${id}`);
      setContract(res.data);
    };

    if (id) fetch();
  }, [id]);

  if (!contract) return <Loading/>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-xl bg-white shadow-md rounded-2xl p-6">

        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-4">Contract Details</h2>

        {/* DATA */}
        <div className="space-y-3">
          <p><strong>Client:</strong> {contract.client?.name}</p>
          <p>
            <strong>Start:</strong>{' '}
            {new Date(contract.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong>End:</strong>{' '}
            {contract.endDate
              ? new Date(contract.endDate).toLocaleDateString()
              : 'Ongoing'}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">

          <button
            onClick={() => router.push('/contracts')}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Back
          </button>

          <button
            onClick={() => router.push(`/contracts/${id}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>

        </div>

      </div>
    </div>
  );
}