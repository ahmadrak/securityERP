'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loading } from '@/components/Loading';

interface Stats {
  employees: number;
  assignments: number;
  vacations: number;
  locations: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    employees: 0,
    assignments: 0,
    vacations: 0,
    locations: 0,
  });

  const [recentEmployees, setRecentEmployees] = useState<any[]>([]);
  const [todayAssignments, setTodayAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, assRes, locRes] = await Promise.all([
          api.get('/employees'),
          api.get('/assignments'),
          api.get('/locations'),
        ]);

        const employees = empRes.data;
        const assignments = assRes.data;
        const locations = locRes.data;

        // 📊 Stats
        setStats({
          employees: employees.length,
          assignments: assignments.length,
          locations: locations.length,
          vacations: assignments.filter((a: any) => a.type === 'VACATION').length,
        });

        // 👤 Recent Employees
        setRecentEmployees(
          employees.slice(-5).reverse()
        );

        // 📅 Today's assignments
        const today = new Date().toDateString();

        const todayData = assignments.filter((a: any) => {
          if (!a.startDate) return false;
          return new Date(a.startDate).toDateString() === today;
        });

        setTodayAssignments(todayData);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* STATS */}
      {loading ? <Loading/> : <>
      <div className="grid grid-cols-4 gap-4">

        <Card title="Employees" value={stats.employees} />
        <Card title="Assignments" value={stats.assignments} />
        <Card title="Vacations" value={stats.vacations} />
        <Card title="Locations" value={stats.locations} />

      </div>

      {/* TODAY ASSIGNMENTS */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Today's Assignments</h2>

        {todayAssignments.length === 0 ? (
          <p className="text-gray-500 text-sm">No assignments today</p>
        ) : (
          <div className="space-y-2">
            {todayAssignments.map((a: any) => (
              <div key={a.id} className="border p-2 rounded flex justify-between">
                <span>{a.employee?.name}</span>
                <span className="text-sm text-gray-500">
                  {a.location?.name || '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECENT EMPLOYEES */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Recent Employees</h2>

        {recentEmployees.length === 0 ? (
          <p className="text-gray-500 text-sm">No employees</p>
        ) : (
          <div className="space-y-2">
            {recentEmployees.map((e: any) => (
              <div key={e.id} className="border p-2 rounded flex justify-between">
                <span>{e.name}</span>
                <span className="text-sm text-gray-500">
                  #{e.fileNumber}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      </>
}
      

    </div>
  );
}

// 🔹 Small reusable card
function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}