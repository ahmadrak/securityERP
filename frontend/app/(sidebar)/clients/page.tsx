'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loading } from '@/components/Loading';
import { Trash, SquarePen, Eye } from 'lucide-react';

// ✅ TYPE
interface Client {
  id: string;
  name: string;
  contactInfo?: string;
}

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [isloading, setIsloading] = useState(false)

  // ✅ FETCH CLIENTS
  const fetchClients = async () => {
    try {
      setIsloading(true)
      const res = await api.get('/clients'); // ✅ correct endpoint
      setClients(Array.isArray(res.data) ? res.data : []);
      setIsloading(false)
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // ✅ SEARCH FILTER
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ DELETE
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client?')) return;

    try {
      await api.delete(`/clients/${id}`);
      setClients(prev => prev.filter(c => c.id !== id));
    } catch {
      alert('Failed to delete client');
    }
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <h2 className="text-2xl font-bold">Clients</h2>

        <input
          type="text"
          placeholder="Search client..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-3 py-1 rounded"
        />

        <button
          onClick={() => router.push('/clients/create')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Client
        </button>
      </div>

      {/* LIST */}
      {isloading ? <Loading /> :
      <div className="space-y-2">
        {filteredClients.length === 0 && (
          <p className="text-gray-500">No clients found</p>
        )}

        {filteredClients.map(client => (
          <div
            key={client.id}
            className="p-4 border rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{client.name}</p>
              <p className="text-sm text-gray-500">
                {client.contactInfo || 'No contact info'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/clients/${client.id}`)}
                className="text-blue-500 hover:underline"
              >
                <Eye />
              </button>

              <button
                onClick={() => router.push(`/clients/${client.id}/edit`)}
                className="text-yellow-500 hover:underline"
              >
                <SquarePen />
              </button>

              <button
                onClick={() => handleDelete(client.id)}
                className="text-red-500 hover:underline"
              >
                <Trash />
              </button>
            </div>
          </div>
        ))}
      </div>
}
    </div>
  );
}