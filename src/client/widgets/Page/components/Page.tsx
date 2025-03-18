import { Box } from '#/ui-lib/atoms/Box';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Text } from '#/ui-lib/atoms/Text';
import { ReactNode, useEffect } from 'react';

interface PageProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
  filters?: ReactNode;
}

// FIXME refactor component to use Page Context

export function Page({ title, actions, children, filters }: PageProps) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <Flex direction="column" gap={4} height="100%">
      <Flex
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        spacing={{ pt: 4, px: 4 }}>
        <Text variant="header-m">{title}</Text>
        {actions}
      </Flex>

      {!!filters && <Box spacing={{ px: 4, pb: 4 }}>{filters}</Box>}

      <Box flexGrow={1} overflow="auto" spacing={{ px: 4, pb: 4 }}>
        {children}
      </Box>
    </Flex>
  );
}
