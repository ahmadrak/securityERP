'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loading } from '@/components/Loading';
import { Trash, SquarePen, Eye } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  requiredGuards: number;

  // 👇 future-ready fields (safe even if backend not added yet)
  maleGuards?: number;
  femaleGuards?: number;
  malePrice?: number;
  femalePrice?: number;

  contract?: {
    client?: {
      name: string;
    };
  };
}

export default function LocationsPage() {
  const router = useRouter();

  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/locations');
      setLocations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/locations/${id}`);
      setLocations(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete location');
    }
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-6 items-center">
        <h2 className="text-2xl font-bold">Locations</h2>

        <button
          onClick={() => router.push('/locations/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Location
        </button>
      </div>

      {/* LOADING */}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-3">

          {locations.map(loc => (
            <div
              key={loc.id}
              className="p-4 border rounded bg-white flex justify-between items-start"
            >

              {/* LEFT INFO */}
              <div className="space-y-1">

                <p className="font-semibold text-lg">{loc.name}</p>

                <p className="text-sm text-gray-500">
                  Client: {loc.contract?.client?.name || 'N/A'}
                </p>

                <p className="text-sm text-gray-400">
                  Total Guards: {loc.requiredGuards}
                </p>

                {/* 👇 future breakdown display (safe fallback) */}
                {(loc.maleGuards || loc.femaleGuards) && (
                  <div className="text-xs text-gray-500 mt-1">
                    Male: {loc.maleGuards || 0} | Female: {loc.femaleGuards || 0}
                  </div>
                )}

              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 items-center">

                <button
                  onClick={() => router.push(`/locations/${loc.id}`)}
                  className="text-blue-500 hover:scale-110 transition"
                >
                  <Eye  />
                </button>

                <button
                  onClick={() => router.push(`/locations/${loc.id}/edit`)}
                  className="text-yellow-500 hover:scale-110 transition"
                >
                  <SquarePen  />
                </button>

                <button
                  onClick={() => handleDelete(loc.id)}
                  className="text-red-500 hover:scale-110 transition"
                >
                  <Trash  />
                </button>

              </div>

            </div>
          ))}

          {locations.length === 0 && (
            <p className="text-gray-500 text-center mt-6">
              No locations found
            </p>
          )}

        </div>
      )}
    </div>
  );
}