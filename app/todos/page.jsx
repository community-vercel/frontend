import TodosPageContent from "../components/todos/TodosPageContent"
import { Suspense } from 'react';
import LoadingScreen from '../components/todos/LoadingScreen';

export default function TodosPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <TodosPageContent />
    </Suspense>
  );
}