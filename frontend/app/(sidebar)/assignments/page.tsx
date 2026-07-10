'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@mui/x-data-grid';
import api from '@/lib/api';
import { Loading } from '@/components/Loading';
import { Trash ,SquarePen , Eye   } from 'lucide-react';

interface Assignment {
  id: string;
  type: 'PERMANENT' | 'RELIEVER' | 'VACATION';
  startDate?: string;
  endDate?: string;

  employee: {
    name: string;
    fileNumber: string;
  };

  location?: {
    name: string;
    contract?: {
      client?: {
        name: string;
      };
    };
  };
}

export default function AssignmentsPage() {
  const router = useRouter();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [isloading, setIsloading] = useState(false);

  // FETCH
  const fetchAssignments = async () => {
    try {
      setIsloading(true);
      const res = await api.get('/assignments');
      setAssignments(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        console.error(err);
      }
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (id: string) => {

    try {
      await api.delete(`/assignments/${id}`);
      setAssignments(prev => prev.filter(a => a.id !== id));
    } catch {
      alert('Failed to delete');
    }
  };

  // UNIQUE LOCATIONS
  const locations = Array.from(
    new Set(assignments.map(a => a.location?.name).filter(Boolean))
  );

  // FILTER
  const filtered = assignments.filter(a => {
    const term = search.toLowerCase();

    const matchSearch =
      a.employee.name.toLowerCase().includes(term) ||
      a.employee.fileNumber.toLowerCase().includes(term) ||
      a.location?.name?.toLowerCase().includes(term);

    const matchLocation = locationFilter
      ? a.location?.name === locationFilter
      : true;

    return matchSearch && matchLocation;
  });

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  // 👉 ROWS
  const rows = filtered.map(a => ({
    id: a.id,
    employeeName: a.employee.name,
    fileNumber: a.employee.fileNumber,
    type: a.type,
    location: a.location?.name || '—',
    client: a.location?.contract?.client?.name || '—',
    startDate: formatDate(a.startDate),
    endDate: formatDate(a.endDate),
  }));

  // 👉 COLUMNS
  const columns = [
    { field: 'employeeName', headerName: 'Employee', flex: 1 },
    { field: 'fileNumber', headerName: 'File #', width: 120 },

    {
      field: 'type',
      headerName: 'Type',
      width: 140,
      renderCell: (params: any) => {
        const type = params.value;

        const styles =
          type === 'PERMANENT'
            ? 'bg-green-100 text-green-700'
            : type === 'RELIEVER'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-gray-200 text-gray-600';

        return (
          <span className={`px-2 py-1 text-xs rounded ${styles}`}>
            {type}
          </span>
        );
      },
    },

    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'client', headerName: 'Client', flex: 1 },
    { field: 'startDate', headerName: 'Start', width: 120 },
    { field: 'endDate', headerName: 'End', width: 120 },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params: any) => (
        <div className="flex gap-4">
          <button
            onClick={() => router.push(`/assignments/${params.row.id}`)}
            className="text-blue-600 text-sm"
          >
            <Eye />
          </button>
          <button
            onClick={() => router.push(`/assignments/${params.row.id}/edit`)}
            className="text-blue-600 text-sm"
          >
            <SquarePen />
          </button>
          <button
            onClick={() => handleDelete(params.row.id)}
            className="text-red-500 text-sm"
          >
            <Trash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">

        <h2 className="text-2xl font-bold">Assignments</h2>

        <div className="flex gap-2 flex-wrap">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search name / file / location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1 rounded"
          />

          {/* LOCATION FILTER */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="">All Locations</option>
            {locations.map((loc, i) => (
              <option key={i} value={loc as string}>
                {loc}
              </option>
            ))}
          </select>

          {/* ADD BUTTON */}
          <button
            onClick={() => router.push('/assignments/create')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Assignment
          </button>

        </div>
      </div>

      {/* GRID */}
      {isloading ? (
        <Loading />
      ) : (
        <div style={{ height: 550, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            showToolbar 
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            disableRowSelectionOnClick
            
            isCellEditable={() => false} // 🔒 disable editing
          />
        </div>
      )}
    </div>
  );
}