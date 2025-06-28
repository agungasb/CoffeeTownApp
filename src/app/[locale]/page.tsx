import { redirect } from 'next/navigation';
 
// This page now redirects to the root page to avoid confusion with locales.
export default function LocalePage() {
  redirect('/');
}
