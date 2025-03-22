import {
  CosmeticBenefitCreatingAction,
  CosmeticBenefitsList,
} from '#/client/entities/cosmetic/benefits';

export default function Page() {
  return (
    <div>
      <CosmeticBenefitCreatingAction />
      <CosmeticBenefitsList />
    </div>
  );
}
