'use server';

import { cookies } from 'next/headers';

export const getAuthToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  return token;
};

export const setAuthToken = async (token) => {
  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const removeAuthToken = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('token');
};
