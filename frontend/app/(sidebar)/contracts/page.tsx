'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loading } from '@/components/Loading';
import { Trash, SquarePen, Eye } from 'lucide-react';

interface Contract {
  id: string;
  clientId: string;
  startDate: string;
  endDate?: string;
  client?: {
    name: string;
  };
}

export default function ContractsPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isloading, setIsloading] = useState(false)

  const fetchContracts = async () => {
    setIsloading(true)
    const res = await api.get('/contracts');
    setContracts(res.data);
    setIsloading(false)
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete contract?')) return;

    await api.delete(`/contracts/${id}`);
    setContracts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Contracts</h2>

        <button
          onClick={() => router.push('/contracts/create')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Contract
        </button>
      </div>

      {/* LIST */}
      {isloading ? <Loading /> : 
      <div className="space-y-2">
        {contracts.map(contract => (
          <div key={contract.id} className="p-4 border rounded flex justify-between">

            <div>
              <p className="font-semibold">
                {contract.client?.name || 'Unknown Client'}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(contract.startDate).toLocaleDateString()} →
                {contract.endDate
                  ? new Date(contract.endDate).toLocaleDateString()
                  : 'Ongoing'}
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => router.push(`/contracts/${contract.id}`)} className="text-blue-500"><Eye/> </button>
              <button onClick={() => router.push(`/contracts/${contract.id}/edit`)} className="text-yellow-500"><SquarePen /> </button>
              <button onClick={() => handleDelete(contract.id)} className="text-red-500"><Trash /></button>
            </div>

          </div>
        ))}
      </div> }
    </div>
  );
}