import { queryClient } from '#ui/utils/api';
import { AppRouter } from '#ui/router';
import { QueryClientProvider } from '@tanstack/react-query';

export function AppServer() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}
