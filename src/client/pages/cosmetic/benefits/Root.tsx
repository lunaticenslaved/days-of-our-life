import {
  CosmeticBenefitCreatingAction,
  CosmeticBenefitsList,
  useCosmeticBenefitCreatingActionContainer,
  useCosmeticBenefitsListContainer,
} from '#/client/entities/cosmetic/benefits';
import { Page } from '#/client/widgets/Page';

export default function CosmeticBenefitsPage() {
  const listContainer = useCosmeticBenefitsListContainer({ withActions: true });
  const creatingActionContainer = useCosmeticBenefitCreatingActionContainer();

  return (
    <Page>
      <Page.Header>
        <Page.Title>Косметические преимущества</Page.Title>
        <Page.Actions>
          <CosmeticBenefitCreatingAction {...creatingActionContainer} />
        </Page.Actions>
      </Page.Header>

      <Page.Content>
        <CosmeticBenefitsList {...listContainer} />
      </Page.Content>
    </Page>
  );
}
