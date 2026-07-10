'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Loading } from '@/components/Loading';

interface Attendance {
  id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'OFF' | 'VACATION';
  checkIn?: string;
  checkOut?: string;
}

export default function EmployeeAttendance() {
  const { id } = useParams();

  const [month, setMonth] = useState('2026-04');
  const [selectedDay, setSelectedDay] = useState<Attendance | null>(null);

  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/attendance?employeeId=${id}`);
        setAttendance(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // ================= HELPERS =================

  const [year, monthNum] = month.split('-').map(Number);

  const daysInMonth = new Date(year, monthNum, 0).getDate();
  const firstDay = new Date(year, monthNum - 1, 1).getDay();
  const startDay = (firstDay + 6) % 7;

  // Normalize date from DB → YYYY-MM-DD
  const normalizeDate = (d: string) =>
    d ? d.split('T')[0].split(' ')[0] : '';

  // Extract time only (08:00)
  const getTime = (dt?: string) => {
    if (!dt) return '-';
    return new Date(dt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format date for modal
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB');

  // ================= MAP =================
  const attendanceMap = useMemo(() => {
    return new Map(
      attendance.map((a) => [
        normalizeDate(a.date),
        a,
      ])
    );
  }, [attendance]);

  // ================= COLORS =================
  const getColor = (status?: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500 text-white';
      case 'absent':
        return 'bg-red-500 text-white';
      case 'off':
        return 'bg-yellow-300 text-black';
      default:
        return 'bg-gray-100';
    }
  };

  if (loading) return <Loading />;

  // ================= CALENDAR =================
  const cells = [];

  // Empty cells before first day
  for (let i = 0; i < startDay; i++) {
    cells.push(<div key={`empty-${i}`} />);
  }

  // Days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${month}-${String(day).padStart(2, '0')}`;
    const record = attendanceMap.get(dateKey);

    cells.push(
      <div
        key={day}
        onClick={() => record && setSelectedDay(record)}
        className={`
          h-20 rounded flex flex-col items-center justify-center
          cursor-pointer transition
          ${getColor(record?.status)}
        `}
      >
        <p className="font-bold text-lg">{day}</p>
        <p className="text-xs">
          {record?.status || ''}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      <h2 className="text-2xl font-bold mb-4">
        Employee Attendance (ID: {id})
      </h2>

      {/* MONTH SELECT */}
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border px-3 py-2 rounded mb-6"
      />

      {/* WEEK DAYS */}
      <div className="grid grid-cols-7 text-center font-bold mb-2">
        <div>Mon</div><div>Tue</div><div>Wed</div>
        <div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
      </div>

      {/* CALENDAR */}
      <div className="grid grid-cols-7 gap-2">
        {cells}
      </div>

      {/* MODAL */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded p-6 w-80 shadow-lg">

            <h3 className="text-xl font-bold mb-3">
              {formatDate(selectedDay.date)}
            </h3>

            <p className="mb-2">
              Status:{' '}
              <span className="font-semibold">
                {selectedDay.status}
              </span>
            </p>

            {(selectedDay.checkIn || selectedDay.checkOut) && (
              <div className="mt-2">
                <p>🕒 Check In: {getTime(selectedDay.checkIn)}</p>
                <p>🕔 Check Out: {getTime(selectedDay.checkOut)}</p>
              </div>
            )}

            {!selectedDay.checkIn && !selectedDay.checkOut && (
              <p className="text-gray-500 mt-2">
                No check-in data
              </p>
            )}

            <button
              onClick={() => setSelectedDay(null)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}