import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from '#ui/router';
import { queryClient } from '#ui/api';
import { DialogContextProvider } from '#ui/components/Dialog';

export function AppClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DialogContextProvider>
          <AppRouter />
        </DialogContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
