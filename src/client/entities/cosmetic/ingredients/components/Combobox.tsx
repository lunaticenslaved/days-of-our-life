import { Box } from '#/ui-lib/atoms/Box';
import { Combobox } from '#/ui-lib/atoms/Combobox';
import { List } from '#/ui-lib/molecules/List';

export function ComboboxComponent() {
  return (
    <Combobox>
      <Combobox.Trigger>
        <div>trigger</div>
      </Combobox.Trigger>

      <Combobox.Content>
        {/* TODO добавить Paper компонент? */}
        <Box color="background" spacing={{ p: 4 }}>
          <List>
            <List.Search placeholder="Поиск..." />
            <List.Empty>No items found</List.Empty>
            <List.Group>
              <List.Item value="item-1">item 1</List.Item>
            </List.Group>
          </List>
        </Box>
      </Combobox.Content>
    </Combobox>
  );
}
