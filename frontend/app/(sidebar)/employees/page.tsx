'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Trash ,SquarePen , Eye   } from 'lucide-react';
import { Loading } from '@/components/Loading';

interface Employee {
  id: number;
  name?: string;
  type?: string;
  fileNumber?: string;
  salary?: number;
  emaratesId?: string;
  psbdId?: string;
  contract?: string;
  nsiCert?: string;
  pic?: string;
  passport?: string;
}

export default function Employees() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isloading, setIsloading] = useState(false)
  const [search, setSearch] = useState('');

  const filteredEmployees = employees.filter(emp => {
    const name = emp.name?.toLowerCase() || '';
    const file = emp.fileNumber?.toLowerCase() || '';
    const term = search.toLowerCase();
    return name.includes(term) || file.includes(term);
  });

  const fetchEmployees = async () => {
    try {
      setIsloading(true)
      const res = await api.get('/employees');
      
      setEmployees(Array.isArray(res.data) ? res.data : res.data.employees ?? []);
      setIsloading(false)
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token'); // remove invalid token
        router.push('/login');
      }
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: number) => {
    //if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/employees/${id}`);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch {
      alert('Failed to delete employee');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <h2 className="text-2xl font-bold">Employees</h2>
        <input
          type="text"
          placeholder="Search by name or file number"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={() => router.push('/employees/create')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Employee
        </button>
      </div>

      <div className="space-y-2">
        {isloading && <Loading/>}

        {filteredEmployees.map(emp => (
          <div key={emp.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{emp.name || 'No Name'}</p>
              <p className="text-sm text-gray-600">{emp.type || 'No Type'}</p>
              <p className="text-sm text-gray-500">{emp.salary ? `$${emp.salary}` : 'No salary'}</p>
              <p className="text-sm text-gray-400">File #: {emp.fileNumber ?? 'N/A'}</p>
            </div>

            <div className="flex gap-6">
              <button onClick={() => router.push(`/employees/${emp.id}/attendance`)} className="text-blue-500 hover:underline">attendance</button>
              <button onClick={() => router.push(`/employees/${emp.id}`)} className="text-blue-500 hover:underline"><Eye /></button>
              <button onClick={() => router.push(`/employees/${emp.id}/edit`)} className="text-blue-500 hover:underline"><SquarePen  /></button>
              <button onClick={() => handleDelete(emp.id)} className="text-red-500 hover:underline"><Trash/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}