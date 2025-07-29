// // utils/CookieData.ts
// 'use server';

// import { cookies } from 'next/headers';

// // Get token (can be sync)
// export const getAuthToken = () => {
//   const cookieStore = cookies();
//   return cookieStore.get('token')?.value;
// };

// // Set token (must be async in server action)
// export const setAuthToken = async (token) => {
//   const cookieStore = cookies();
//   cookieStore.set('token', token, {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'lax',
//     path: '/',
//     maxAge: 60 * 60 * 24 * 7, // 7 days
//   });
// };

// // Remove token
// export const removeAuthToken = async () => {
//   const cookieStore = cookies();
//   cookieStore.delete('token');
// };
