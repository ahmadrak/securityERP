'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loading } from '@/components/Loading';

export default function EmployeeView() {
  const { id } = useParams();
  const router = useRouter();

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/employees/${id}`);
        setEmployee(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEmployee();
  }, [id]);

  // ================= HELPERS =================
  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  const DocumentLink = ({ url, label }: { url: string; label: string }) => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
    >
      {label}
    </a>
  );

  if (loading) return <Loading />;

  if (!employee) {
    return <div className="p-6 text-center text-gray-500">Employee not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-2xl p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">{employee.name}</h1>
            <p className="text-gray-500">{employee.type}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push('/employees')}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Back
            </button>

            <button
              onClick={() => router.push(`/employees/${id}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit
            </button>
          </div>
        </div>

        {/* BASIC INFO */}
        <div>
          <h2 className="font-semibold mb-3">Basic Information</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

            <Info label="Email" value={employee.email} />
            <Info label="File Number" value={employee.fileNumber} />
            <Info label="Salary" value={employee.salary ? `$${employee.salary}` : '-'} />
            <Info label="Type" value={employee.type} />

          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h2 className="font-semibold mb-3">Contact Information</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

            <Info label="Phone Number" value={employee.phoneNumber} />
            <Info label="WhatsApp" value={employee.whatsapp} />
            <Info label="PSBD Number" value={employee.psbdNumber} />

          </div>
        </div>

        {/* HR INFO */}
        <div>
          <h2 className="font-semibold mb-3">HR Information</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

            <Info label="Start Date" value={formatDate(employee.startDate)} />
            <Info label="Birth Date" value={formatDate(employee.birthDate)} />
            <Info label="PSBD Expiry" value={formatDate(employee.psbdExpiry)} />

          </div>
        </div>

        {/* DOCUMENTS */}
        <div>
          <h2 className="font-semibold mb-3">Documents</h2>

          <div className="flex flex-wrap gap-3">

            {employee.emaratesId && (
              <DocumentLink url={employee.emaratesId} label="Emirates ID" />
            )}

            {employee.psbdId && (
              <DocumentLink url={employee.psbdId} label="PSBD ID" />
            )}

            {employee.passport && (
              <DocumentLink url={employee.passport} label="Passport" />
            )}

            {employee.contract && (
              <DocumentLink url={employee.contract} label="Contract" />
            )}

            {employee.nsiCert && (
              <DocumentLink url={employee.nsiCert} label="NSI Certificate" />
            )}

            {!employee.emaratesId &&
              !employee.psbdId &&
              !employee.passport &&
              !employee.contract &&
              !employee.nsiCert && (
                <p className="text-gray-500 text-sm">No documents uploaded</p>
              )}
          </div>
        </div>

      </div>
    </div>
  );
}

// 🔹 Reusable Info Card
function Info({ label, value }: { label: string; value?: any }) {
  return (
    <div className="p-3 border rounded">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-medium">{value || '-'}</p>
    </div>
  );
}