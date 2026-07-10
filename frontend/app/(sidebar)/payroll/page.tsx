'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface PayrollRow {
  employee: string;
  present: number;
  absent: number;
  off: number;
  baseSalary: number;
  deductions: number;
  finalSalary: number;
}

export default function PayrollPage() {
  const [data, setData] = useState<PayrollRow[]>([]);
  const [month, setMonth] = useState('2026-04');
  const [loading, setLoading] = useState(false);

  const fetchPayroll = async () => {
    try {
      setLoading(true);

      const res = await api.post('/payroll/generate', {
        month,
      });

      setData(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  // 🔥 TOTALS
  const totals = data.reduce(
    (acc, item) => {
      acc.base += item.baseSalary;
      acc.deductions += item.deductions;
      acc.final += item.finalSalary;
      return acc;
    },
    { base: 0, deductions: 0, final: 0 }
  );

  return (
    <div className="p-6 space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payroll</h1>

        <div className="flex gap-2">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            onClick={fetchPayroll}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Generate
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Present</th>
              <th className="p-3">Absent</th>
              <th className="p-3">Off</th>
              <th className="p-3">Base Salary</th>
              <th className="p-3">Deductions</th>
              <th className="p-3">Final Salary</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t">

                <td className="p-3 font-medium">
                  {row.employee}
                </td>

                <td className="p-3 text-green-600">
                  {row.present}
                </td>

                <td className="p-3 text-red-600">
                  {row.absent}
                </td>

                <td className="p-3 text-yellow-600">
                  {row.off}
                </td>

                <td className="p-3">
                  ${row.baseSalary}
                </td>

                <td className="p-3 text-red-500">
                  -${row.deductions}
                </td>

                <td className="p-3 font-bold text-blue-600">
                  ${row.finalSalary}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

        {loading && (
          <p className="p-4 text-center text-gray-500">
            Generating payroll...
          </p>
        )}

      </div>

      {/* TOTALS CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-blue-100 p-4 rounded">
          <p className="text-sm text-gray-600">Total Base Salary</p>
          <p className="text-xl font-bold">${totals.base}</p>
        </div>

        <div className="bg-red-100 p-4 rounded">
          <p className="text-sm text-gray-600">Total Deductions</p>
          <p className="text-xl font-bold">-${totals.deductions}</p>
        </div>

        <div className="bg-green-100 p-4 rounded">
          <p className="text-sm text-gray-600">Net Payroll</p>
          <p className="text-xl font-bold">${totals.final}</p>
        </div>

      </div>

    </div>
  );
}