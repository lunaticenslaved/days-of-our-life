import {
  CosmeticProductCreatingAction,
  CosmeticProductsList,
} from '#/client/entities/cosmetic/products';

export default function Page() {
  return (
    <div>
      <h3>Косметические продукты</h3>
      <div>
        <CosmeticProductCreatingAction />
      </div>

      <CosmeticProductsList />
    </div>
  );
}
