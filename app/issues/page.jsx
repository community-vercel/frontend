import IssuesPageContent from "../components/issues/IssuesPageContent";
import { Suspense } from 'react';
import LoadingScreen from "../components/todos/LoadingScreen";

export default function IssuesPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
        
      <IssuesPageContent />
    </Suspense>
  );
}