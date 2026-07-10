'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loading } from '@/components/Loading';

export default function EditEmployee() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: '',
    email: '',
    type: 'GUARD',
    salary: '',
    fileNumber: '',
    phoneNumber: '',
    whatsapp: '',
    psbdNumber: '',
    startDate: '',
    birthDate: '',
    psbdExpiry: '',

    // FILES
    emaratesId: null as File | null,
    psbdId: null as File | null,
    contract: null as File | null,
    nsiCert: null as File | null,
    pic: null as File | null,
    passport: null as File | null,
  });

  // ================= FETCH =================
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/employees/${id}`);
        const emp = res.data;

        setForm({
          name: emp.name || '',
          email: emp.email || '',
          type: emp.type || 'GUARD',
          salary: emp.salary?.toString() || '',
          fileNumber: emp.fileNumber || '',
          phoneNumber: emp.phoneNumber || '',
          whatsapp: emp.whatsapp || '',
          psbdNumber: emp.psbdNumber || '',
          startDate: emp.startDate ? emp.startDate.split('T')[0] : '',
          birthDate: emp.birthDate ? emp.birthDate.split('T')[0] : '',
          psbdExpiry: emp.psbdExpiry ? emp.psbdExpiry.split('T')[0] : '',

          emaratesId: null,
          psbdId: null,
          contract: null,
          nsiCert: null,
          pic: null,
          passport: null,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEmployee();
  }, [id]);

  // ================= HANDLERS =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, [e.target.name]: file });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  await api.patch(`/employees/${id}`, {
    name: form.name,
    email: form.email,
    type: form.type,
    salary: form.salary,
    fileNumber: form.fileNumber,
    phoneNumber: form.phoneNumber,
    whatsapp: form.whatsapp,
    psbdNumber: form.psbdNumber,
    startDate: form.startDate,
    birthDate: form.birthDate,
    psbdExpiry: form.psbdExpiry,
  });

  router.push(`/employees/${id}`);
};

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-2xl p-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Update Employee</h1>
          <p className="text-gray-500 text-sm">
            Edit employee details and documents
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* BASIC INFO */}
          <div>
            <h2 className="font-semibold text-gray-700 mb-3">
              Basic Information
            </h2>

            <div className="grid grid-cols-2 gap-3">

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Full Name"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Email"
              />

              <input
                name="fileNumber"
                value={form.fileNumber}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="File Number"
              />

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="MANAGER">MANAGER</option>
                <option value="HR">HR</option>
                <option value="SUPERVISOR">SUPERVISOR</option>
                <option value="GUARD">GUARD</option>
              </select>

              <input
                name="salary"
                type="number"
                value={form.salary}
                onChange={handleChange}
                className="border p-2 rounded col-span-2"
                placeholder="Salary"
              />
            </div>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h2 className="font-semibold text-gray-700 mb-3">
              Contact Information
            </h2>

            <div className="grid grid-cols-3 gap-3">

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Phone Number</label>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">WhatsApp</label>
                <input
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">PSBD Number</label>
                <input
                  name="psbdNumber"
                  value={form.psbdNumber}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              </div>

            </div>
          </div>

          {/* HR INFO */}
          <div>
            <h2 className="font-semibold text-gray-700 mb-3">
              HR Information
            </h2>

            <div className="grid grid-cols-3 gap-3">

              <div>
                <label className="text-sm text-gray-600">Start Working Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Birth Date</label>
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">PSBD License Expiry</label>
                <input
                  type="date"
                  name="psbdExpiry"
                  value={form.psbdExpiry}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>

            </div>
          </div>

          {/* DOCUMENTS */}
          <div>
            <h2 className="font-semibold text-gray-700 mb-3">Documents</h2>

            <div className="grid grid-cols-2 gap-3">

              {[
                'emaratesId',
                'psbdId',
                'contract',
                'nsiCert',
                'pic',
                'passport',
              ].map((field) => (
                <label key={field} className="border p-3 rounded flex flex-col gap-1">
                  <span className="capitalize text-gray-600">{field}</span>
                  <input type="file" name={field} onChange={handleFileChange} />
                </label>
              ))}

            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">

            <button
              type="button"
              onClick={() => router.push(`/employees/${id}`)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update Employee
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}