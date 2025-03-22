import {
  CosmeticBenefitCreatingAction,
  CosmeticBenefitsList,
} from '#/client/entities/cosmetic/benefits';
import { Page } from '#/client/widgets/Page';

export default function CosmeticBenefitsPage() {
  return (
    <Page title="Косметические преимущества" actions={<CosmeticBenefitCreatingAction />}>
      <CosmeticBenefitsList />
    </Page>
  );
}
