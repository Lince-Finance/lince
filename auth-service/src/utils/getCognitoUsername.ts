import jwt from 'jsonwebtoken';

export function getCognitoUsername(idToken?: string): string {
  if (!idToken) return '';
  const decoded: any = jwt.decode(idToken);
  return (
    decoded?.['cognito:username'] ||
    decoded?.email ||
    ''
  ).toString();
}
