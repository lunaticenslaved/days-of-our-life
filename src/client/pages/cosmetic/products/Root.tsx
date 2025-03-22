import {
  CosmeticProductCreatingAction,
  CosmeticProductsList,
} from '#/client/entities/cosmetic/products';
import { Page } from '#/client/widgets/Page';

export default function CosmeticProductsRootPage() {
  return (
    <Page title="Косметические продукты" actions={<CosmeticProductCreatingAction />}>
      <CosmeticProductsList />
    </Page>
  );
}
