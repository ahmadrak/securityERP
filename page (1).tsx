'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Row {
  employee: {
    id: number;
    name: string;
    fileNumber: string;
  };
  assignmentType: 'PERMANENT' | 'RELIEVER' | 'VACATION';
  presentDays: number;
  leaveDays: number;
  totalDays: number;
}

// default to current month, e.g. "2026-07"
function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default function AttendancePage() {
  const [data, setData] = useState<Row[]>([]);
  const [month, setMonth] = useState(currentMonth());
  const [locationId, setLocationId] = useState('');
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/locations').then((res) => setLocations(res.data));
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/attendance', {
        params: { month, locationId },
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
  }, [month, locationId]);

  const attendanceRate = (row: Row) =>
    row.totalDays === 0 ? 0 : Math.round((row.presentDays / row.totalDays) * 100);

  const rateBadge = (rate: number) => {
    if (rate >= 90) return 'bg-green-100 text-green-700';
    if (rate >= 75) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Monthly Attendance</h1>

      <div className="flex gap-3">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
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
              <th className="p-3">Assignment Type</th>
              <th className="p-3">Present Days</th>
              <th className="p-3">Leave Days</th>
              <th className="p-3">Attendance Rate</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => {
              const rate = attendanceRate(row);
              return (
                <tr key={i} className="border-t">
                  <td className="p-3 font-medium">{row.employee?.name || '—'}</td>
                  <td className="p-3 text-gray-500">#{row.employee?.fileNumber || '—'}</td>
                  <td className="p-3 text-gray-500">{row.assignmentType}</td>
                  <td className="p-3 text-green-700 font-medium">{row.presentDays}</td>
                  <td className="p-3 text-red-600 font-medium">{row.leaveDays}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded ${rateBadge(rate)}`}>
                      {rate}%
                    </span>
                  </td>
                </tr>
              );
            })}

            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No data for this month
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {loading && (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        )}
      </div>
    </div>
  );
}
