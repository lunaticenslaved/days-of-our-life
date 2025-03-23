import {
  CosmeticProductCreatingAction,
  CosmeticProductsList,
} from '#/client/entities/cosmetic/products';
import { Page } from '#/client/widgets/Page';

export default function CosmeticProductsRootPage() {
  return (
    <Page>
      <Page.Header>
        <Page.Title>Косметические продукты</Page.Title>
        <Page.Actions>
          <CosmeticProductCreatingAction />
        </Page.Actions>
      </Page.Header>

      <Page.Content>
        <CosmeticProductsList />
      </Page.Content>
    </Page>
  );
}
