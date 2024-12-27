import { Select, SelectProps } from '#/client/components/Select';
import { CosmeticProduct } from '#/shared/models/cosmetic';

interface CosmeticProductSelectProps extends SelectProps {
  cosmeticProducts: CosmeticProduct[];
}

export function CosmeticProductSelect({
  cosmeticProducts,
  ...props
}: CosmeticProductSelectProps) {
  return (
    <Select {...props}>
      {cosmeticProducts.map(cosmeticProduct => {
        return (
          <Select.Option key={cosmeticProduct.id} value={cosmeticProduct.id}>
            {cosmeticProduct.name}
          </Select.Option>
        );
      })}
    </Select>
  );
}
