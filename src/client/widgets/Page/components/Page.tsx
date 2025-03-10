import { Box } from '#/ui-lib/atoms/Box';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Text } from '#/ui-lib/atoms/Text';
import { ReactNode, useEffect } from 'react';

interface PageProps {
  title: string;
  actions: ReactNode;
  children: ReactNode;
}

export function Page({ title, actions, children }: PageProps) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <Flex direction="column" spacing={{ p: 4 }} gap={4}>
      <Flex direction="row" alignItems="center" justifyContent="space-between" gap={2}>
        <Text variant="header-m">{title}</Text>
        {actions}
      </Flex>

      <Box flexGrow={1} overflow="auto">
        {children}
      </Box>
    </Flex>
  );
}
