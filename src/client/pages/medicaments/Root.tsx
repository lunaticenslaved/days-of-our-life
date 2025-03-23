import { MedicamentsList } from '#/client/entities/medicaments/medicament';
import { Page } from '#/client/widgets/Page';
import { MedicamentCreatingAction } from '#/client/entities/medicaments/medicament';

export default function MedicamentsRootPage() {
  return (
    <Page>
      <Page.Header>
        <Page.Title>Медикаменты</Page.Title>
        <Page.Actions>
          <MedicamentCreatingAction />
        </Page.Actions>
      </Page.Header>

      <Page.Content>
        <MedicamentsList />
      </Page.Content>
    </Page>
  );
}
