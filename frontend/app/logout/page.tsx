"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    router.replace('/login');
  }, [logout, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-slate-600">Cerrando sesión…</p>
    </div>
  );
}
