import { Button } from '#/ui-lib/components/atoms/Button/Button';

interface StartFemalePeriodButtonProps {
  onStartPeriod(): void;
}

export function StartFemalePeriodButton({ onStartPeriod }: StartFemalePeriodButtonProps) {
  return <Button onClick={onStartPeriod}>Отметить менструацию</Button>;
}
