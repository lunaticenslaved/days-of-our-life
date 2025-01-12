import {
  CosmeticBenefitsList,
  CreateCosmeticBenefitAction,
} from '#/client/entities/cosmetic';

export default function Page() {
  return (
    <div>
      <CreateCosmeticBenefitAction />
      <CosmeticBenefitsList />
    </div>
  );
}
