'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { id: 1,name: 'dashboard', path: '/' },
    { id: 2,name: 'Employees', path: '/employees' },
    { id: 3,name: 'Attendance', path: '/attendance' },
    { id: 4,name: 'contract', path: '/contracts' },
    { id: 5,name: 'Clients', path: '/clients' },
    { id: 6,name: 'Locations', path: '/locations' },
    { id: 7,name: 'payroll', path: '/payroll' },
    { id: 8,name: 'assignments', path: '/assignments' }
    
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="w-64 h-screen sticky top-0 bg-gray-900 text-white flex flex-col justify-between">

      {/* TOP */}
      <div>
        <div className="p-6 text-xl font-bold border-b border-gray-700">
          RAK Security
        </div>

        <nav className="mt-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`w-full text-left px-6 py-3 hover:bg-gray-700 transition ${
                pathname === item.path ? 'bg-gray-700' : ''
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}