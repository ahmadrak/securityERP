'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/employees');
  }, [router]);

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      router.push('/');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <Input
        placeholder="Email"
        type="email"
        className="mb-2"
        onChange={e => setEmail(e.target.value)}
      />
      <Input
        placeholder="Password"
        type="password"
        className="mb-4"
        onChange={e => setPassword(e.target.value)}
      />

      <Button onClick={handleLogin} className="w-full">
        Login
      </Button>
    </div>
  );
}