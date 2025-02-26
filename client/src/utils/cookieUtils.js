// Вспомогательная функция для получения JWT из cookie
export const getJwtFromCookie = () => {
  const cookies = document.cookie.split(';');
  const jwtCookie = cookies.find(cookie => cookie.trim().startsWith('jwt='));
  if (jwtCookie) {
    return jwtCookie.trim().substring(4); // отрезаем 'jwt='
  }
  return null;
}; 