'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Row {
  employee?: {
    id: number;
    name: string;
    fileNumber: string;
  };

  assignmentType: 'PERMANENT' | 'RELIEVER' | 'VACATION';

  attendance?: {
    checkIn?: string;
    checkOut?: string;
  };
}

export default function AttendancePage() {
  const [data, setData] = useState<Row[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [locationId, setLocationId] = useState('');
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/locations').then(res => setLocations(res.data));
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get('/attendance', {
        params: { date, locationId }
      });

      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date, locationId]);

  const getStatus = (row: Row) => {
    if (row.assignmentType === 'VACATION') return 'VACATION';
    if (!row.attendance?.checkIn) return 'ABSENT';
    if (!row.attendance?.checkOut) return 'PRESENT';
    return 'DONE';
  };

  const badge = (status: string) => {
    switch (status) {
      case 'VACATION':
        return 'bg-gray-200 text-gray-600';
      case 'ABSENT':
        return 'bg-red-100 text-red-600';
      case 'PRESENT':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <div className="p-6 space-y-4">

      <h1 className="text-2xl font-bold">Attendance</h1>

      <div className="flex gap-3">

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Locations</option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>

        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>

      </div>

      <div className="bg-white rounded shadow overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">File #</th>
              <th className="p-3">Status</th>
              <th className="p-3">Check In</th>
              <th className="p-3">Check Out</th>
            </tr>
          </thead>

          <tbody>
            {data
              .filter(row => row.employee) // ✅ يمنع rows بدون employee
              .map((row, i) => {
                const status = getStatus(row);

                return (
                  <tr key={i} className="border-t">

                    <td className="p-3 font-medium">
                      {row.employee?.name || '—'}
                    </td>

                    <td className="p-3 text-gray-500">
                      #{row.employee?.fileNumber || '—'}
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded ${badge(status)}`}>
                        {status}
                      </span>
                    </td>

                    <td className="p-3">
                      {row.attendance?.checkIn || '-'}
                    </td>

                    <td className="p-3">
                      {row.attendance?.checkOut || '-'}
                    </td>

                  </tr>
                );
              })}
          </tbody>

        </table>

        {loading && (
          <div className="p-4 text-center text-gray-500">
            Loading...
          </div>
        )}

      </div>

    </div>
  );
}