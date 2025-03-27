import { Box } from '#/ui-lib/atoms/Box';
import { ReactNode, Suspense } from 'react';
import { PageContextProvider, usePageContextStrict } from '../context';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Text } from '#/ui-lib/atoms/Text';

const PADDING = 4;

// FIXME add content scrolling

// --- Page Root -------------------------------------------------------
function Page({ children }: { children: ReactNode }) {
  return (
    <PageContextProvider>
      <Flex direction="column" height="100%" width="100%">
        {children}
      </Flex>
    </PageContextProvider>
  );
}

// --- Page Header ------------------------------------------------------
function PageHeader({ children }: { children: ReactNode }) {
  return (
    <Flex
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      gap={2}
      spacing={{ pt: PADDING, px: PADDING }}>
      {children}
    </Flex>
  );
}

// --- Page Title ------------------------------------------------------
function PageTitle({ children }: { children: ReactNode }) {
  return <Text variant="header-m">{children}</Text>;
}

// --- Page Actions ----------------------------------------------------
function PageActions({ children }: { children: ReactNode }) {
  return (
    <Flex direction="row" alignItems="center" justifyContent="space-between" gap={2}>
      {children}
    </Flex>
  );
}

// --- Page Content ----------------------------------------------------
function PageContent({ children }: { children: ReactNode }) {
  const pageContext = usePageContextStrict();

  if (pageContext.isLoading) {
    return <PageLoading />;
  }

  return (
    <Box overflow="auto" height="100%" flexGrow={1} spacing={{ p: PADDING }}>
      <Suspense fallback={<PageLoading />}>{children}</Suspense>
    </Box>
  );
}

// --- Page Loading ----------------------------------------------------
function PageLoading() {
  // TODO add beautiful component
  return (
    <Flex height="100%" width="100%" alignItems="center" justifyContent="center">
      <Text>Loading...</Text>
    </Flex>
  );
}

// --- Page Empty ----------------------------------------------------
function PageEmpty() {
  // TODO add beautiful component
  return (
    <Flex height="100%" width="100%" alignItems="center" justifyContent="center">
      <Text>Empty...</Text>
    </Flex>
  );
}

// --- Page Error ----------------------------------------------------
function PageError() {
  // TODO add beautiful component
  return (
    <Flex height="100%" width="100%" alignItems="center" justifyContent="center">
      <Text>Error...</Text>
    </Flex>
  );
}

Page.Header = PageHeader;
Page.Title = PageTitle;
Page.Actions = PageActions;
Page.Content = PageContent;
Page.Loading = PageLoading;
Page.Empty = PageEmpty;
Page.Error = PageError;

export { Page };
