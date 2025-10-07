export function onLogout() {
  console.log('Logging out...');

  localStorage.removeItem('accessToken');

  window.location.href = '/auth/login/';
}
