import { Button } from '#/ui-lib/components/atoms/Button/Button';
import { Flex } from '#/ui-lib/components/atoms/Flex';
import { WithInputProps } from '#/ui-lib/types';
import { CosmeticBenefitsCombobox } from '../Combobox';
import { SortableCloud } from '#/ui-lib/components/molecules/SortableCloud';
import { Label } from '#/ui-lib/components';
import { CosmeticBenefit } from '#/shared/models/cosmetic';

type CloudComponentProps = WithInputProps<string[] | undefined> & {
  isFetchingBenefits: boolean;
  benefits: CosmeticBenefit[];
};

export function CloudComponent({
  value = [],
  onValueUpdate,
  isFetchingBenefits,
  benefits,
}: CloudComponentProps) {
  return (
    <Flex gap={2}>
      <SortableCloud
        strategy="rect-swapping"
        value={value}
        onValueUpdate={onValueUpdate}
        renderElement={({ id }) => {
          if (isFetchingBenefits) {
            return <div>skeleton</div>;
          }

          const benefit = benefits.find(item => item.id === id);

          return (
            <Label
              onRemove={() => {
                onValueUpdate?.(value.filter(id => id !== benefit?.id));
              }}>
              {benefit?.name || ''}
            </Label>
          );
        }}
      />

      <CosmeticBenefitsCombobox
        isFetchingBenefits={isFetchingBenefits}
        trigger={
          <Button size="s" view="toned">
            Добавить +
          </Button>
        }
        benefits={benefits}
        value={value}
        onValueUpdate={arg => {
          onValueUpdate?.(arg);
        }}
      />
    </Flex>
  );
}
