import { Flex, Text, Box, Button } from '#/ui-lib/components';
import { ReactNode } from 'react';
import { FaXmark } from 'react-icons/fa6';

export function Label({
  children,
  onRemove,
  append,
  prepend,
}: {
  children: ReactNode;
  onRemove?: () => void;
  append?: ReactNode;
  prepend?: ReactNode;
}) {
  return (
    <Box style={{ background: 'rgba(255,255,255,0.1)' }}>
      <Flex gap={2} alignItems="center">
        {!!prepend && <Box>{prepend}</Box>}

        <Text component="div" wordWrap="unset" minWidth="max-content">
          {children}
        </Text>

        {!!append && <Box>{append}</Box>}

        {!!onRemove && (
          <Button view="clear" size="s" onClick={onRemove}>
            <FaXmark style={{ fontSize: '1rem' }} />
          </Button>
        )}
      </Flex>
    </Box>
  );
}
