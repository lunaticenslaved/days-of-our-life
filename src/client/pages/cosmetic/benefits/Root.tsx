import {
  CosmeticBenefitCreatingAction,
  CosmeticBenefitsList,
} from '#/client/entities/cosmetic/benefits';
import { Page } from '#/client/widgets/Page';

export default function CosmeticBenefitsPage() {
  return (
    <Page>
      <Page.Header>
        <Page.Title>Косметические преимущества</Page.Title>
        <Page.Actions>
          <CosmeticBenefitCreatingAction />
        </Page.Actions>
      </Page.Header>

      <Page.Content>
        <CosmeticBenefitsList />
      </Page.Content>
    </Page>
  );
}
