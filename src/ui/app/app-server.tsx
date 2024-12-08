import { queryClient } from '#ui/utils/api';
import { QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';

export function AppServer() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
