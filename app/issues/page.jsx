import IssuesPageContent from "../components/issues/IssuesPageContent";
import { Suspense } from 'react';

export default function IssuesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IssuesPageContent />
    </Suspense>
  );
}