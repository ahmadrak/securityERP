'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Employee {
  id: number;
  name: string;
}

interface Location {
  id: string;
  name: string;
}

interface Contract {
  id: string;
  client: {
    name: string;
  };
}

export default function CreateAssignment() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);

  const [form, setForm] = useState({
    employeeId: '',
    type: 'PERMANENT',
    locationId: '',
    contractId: '',
    startDate: '',
    endDate: '',
  });

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      const [empRes, locRes, conRes] = await Promise.all([
        api.get('/employees'),
        api.get('/locations'),
        api.get('/contracts'),
      ]);

      setEmployees(empRes.data);
      setLocations(locRes.data);
      setContracts(conRes.data);
    };

    fetchData();
  }, []);

  // 🔥 HANDLE CHANGE
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // reset location if VACATION
    if (name === 'type' && value === 'VACATION') {
      setForm({
        ...form,
        type: value,
        locationId: '',
        contractId: '',
      });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/assignments', {
        employeeId: Number(form.employeeId),
        type: form.type,
        locationId: form.locationId || null,
        contractId: form.contractId || null,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      });

      router.push('/assignments');
    } catch (err) {
      console.error(err);
      alert('Failed to create assignment');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow rounded-2xl p-6">

        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-6">Create Assignment</h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMPLOYEE */}
          <div>
            <label className="block text-sm font-medium mb-1">Employee</label>
            <select
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* TYPE */}
          <div>
            <label className="block text-sm font-medium mb-1">Assignment Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="PERMANENT">Permanent</option>
              <option value="RELIEVER">Reliever</option>
              <option value="VACATION">Vacation</option>
            </select>
          </div>

          
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <select
                name="locationId"
                value={form.locationId}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required={form.type === 'PERMANENT'}
              >
                <option value="">Select location</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
    
            <div>
              <label className="block text-sm font-medium mb-1">Contract</label>
              <select
                name="contractId"
                value={form.contractId}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select contract</option>
                {contracts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.client?.name || 'Client'}
                  </option>
                ))}
              </select>
            </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.push('/assignments')}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Assignment
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}