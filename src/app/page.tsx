
import { redirect } from 'next/navigation';
 
// This page only redirects to the default locale to ensure the
// internationalization context is always available.
export default function RootPage() {
  redirect('/en');
}
