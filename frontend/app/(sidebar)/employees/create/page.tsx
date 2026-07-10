'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function CreateEmployee() {
  const router = useRouter();

  const [createUser, setCreateUser] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

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
    emaratesId: null as File | null,
    psbdId: null as File | null,
    contract: null as File | null,
    nsiCert: null as File | null,
    pic: null as File | null,
    passport: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, [e.target.name]: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.fileNumber) {
      alert('Name and File Number are required');
      return;
    }

    if (createUser && !form.email) {
      alert('Email is required to create login');
      return;
    }

    const formData = new FormData();

    Object.entries({
      name: form.name,
      email: form.email,
      type: form.type,
      fileNumber: form.fileNumber,
      salary: form.salary,
      phoneNumber: form.phoneNumber,
      whatsapp: form.whatsapp,
      psbdNumber: form.psbdNumber,
      startDate: form.startDate,
      birthDate: form.birthDate,
      psbdExpiry: form.psbdExpiry,
      createUser: String(createUser),
    }).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (form.emaratesId) formData.append('emaratesId', form.emaratesId);
    if (form.psbdId) formData.append('psbdId', form.psbdId);
    if (form.contract) formData.append('contract', form.contract);
    if (form.nsiCert) formData.append('nsiCert', form.nsiCert);
    if (form.pic) formData.append('pic', form.pic);
    if (form.passport) formData.append('passport', form.passport);

    try {
      const res = await api.post('/employees', formData);

      if (res.data?.tempPassword) {
        setTempPassword(res.data.tempPassword);
      } else {
        router.push('/employees');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating employee');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-2xl p-6">

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create Employee</h1>
          <p className="text-gray-500 text-sm">
            Add new employee details, documents, and HR data
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
                placeholder="Full Name"
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="fileNumber"
                placeholder="File Number"
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <select
                name="type"
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
                placeholder="Salary"
                onChange={handleChange}
                className="border p-2 rounded col-span-2"
              />
            </div>

            {/* 🔥 CREATE USER CHECKBOX */}
            <div className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                checked={createUser}
                onChange={(e) => setCreateUser(e.target.checked)}
              />
              <label className="text-sm text-gray-700">
                Create Login Account
              </label>
            </div>

          </div>

          {/* CONTACT INFO */}
          <div>
            <h2 className="font-semibold text-gray-700 mb-3">
              Contact Information
            </h2>

            <div className="grid grid-cols-3 gap-3">

              <input
                name="phoneNumber"
                placeholder="Phone"
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="whatsapp"
                placeholder="WhatsApp"
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="psbdNumber"
                placeholder="PSBD"
                onChange={handleChange}
                className="border p-2 rounded"
              />

            </div>
          </div>

          {/* HR INFO */}
          <div className="grid grid-cols-3 gap-3">
            <input type="date" name="startDate" onChange={handleChange} className="border p-2 rounded" />
            <input type="date" name="birthDate" onChange={handleChange} className="border p-2 rounded" />
            <input type="date" name="psbdExpiry" onChange={handleChange} className="border p-2 rounded" />
          </div>

          {/* DOCUMENTS */}
          <div className="grid grid-cols-2 gap-3">
            {['emaratesId','psbdId','contract','nsiCert','pic','passport'].map((field) => (
              <input key={field} type="file" name={field} onChange={handleFileChange} />
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/employees')}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              Create Employee
            </button>
          </div>

        </form>

        {/* 🔥 SHOW PASSWORD */}
        {tempPassword && (
          <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded">
            <p className="font-bold text-green-800">
              Employee Created 🎉
            </p>

            <p className="mt-2 text-sm">
              Temporary Password:
            </p>

            <p className="font-mono text-lg">
              {tempPassword}
            </p>

            <button
              onClick={() => router.push('/employees')}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Continue
            </button>
          </div>
        )}

      </div>
    </div>
  );
}