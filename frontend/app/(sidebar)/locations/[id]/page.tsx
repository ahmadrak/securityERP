'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loading } from '@/components/Loading';

export default function LocationDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await api.get(`/locations/${id}`);
        setLocation(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) fetchLocation();
  }, [id]);

  if (!location) return <Loading />;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* LOCATION INFO */}
      <div className="bg-white p-5 rounded shadow space-y-2">

        <h2 className="text-xl font-bold">Location Details</h2>

        <p>
          <span className="text-gray-500">Name:</span>{' '}
          <span className="font-medium">{location.name}</span>
        </p>

        <p>
          <span className="text-gray-500">Client:</span>{' '}
          <span className="font-medium">
            {location.contract?.client?.name || 'N/A'}
          </span>
        </p>

        <p>
          <span className="text-gray-500">Required Guards:</span>{' '}
          <span className="font-medium">{location.requiredGuards}</span>
        </p>

        {/* 👇 FUTURE GENDER BREAKDOWN */}
        {(location.maleGuards || location.femaleGuards) && (
          <div className="mt-3 text-sm text-gray-600">
            <p>
              👨 Male Guards: {location.maleGuards || 0}
            </p>
            <p>
              👩 Female Guards: {location.femaleGuards || 0}
            </p>
          </div>
        )}

      </div>

      {/* 👮 ASSIGNED GUARDS TABLE */}
      <div className="bg-white p-5 rounded shadow">

        <h3 className="text-lg font-semibold mb-4">
          Assigned Guards
        </h3>

        <div className="overflow-x-auto">

          <table className="w-full text-left border">

            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">File #</th>
                <th className="p-3">Type</th>
                <th className="p-3">Start Date</th>
                <th className="p-3">End Date</th>
              </tr>
            </thead>

            <tbody>

              {location.assignments?.length > 0 ? (
                location.assignments.map((a: any) => (
                  <tr key={a.id} className="border-t hover:bg-gray-50">

                    <td className="p-3 font-medium">
                      {a.employee?.name}
                    </td>

                    <td className="p-3 text-gray-500">
                      #{a.employee?.fileNumber}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded
                          ${a.type === 'VACATION'
                            ? 'bg-gray-200 text-gray-600'
                            : a.type === 'RELIEVER'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                          }`}
                      >
                        {a.type}
                      </span>
                    </td>

                    <td className="p-3">
                      {a.startDate
                        ? new Date(a.startDate).toLocaleDateString()
                        : '-'}
                    </td>

                    <td className="p-3">
                      {a.endDate
                        ? new Date(a.endDate).toLocaleDateString()
                        : '-'}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-4 text-center text-gray-500"
                  >
                    No guards assigned yet
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 ">

        <button
          onClick={() => router.push('/locations')}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Back
        </button>

        <button
          onClick={() => router.push(`/locations/${id}/edit`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit
        </button>

      </div>

    </div>
  );
}