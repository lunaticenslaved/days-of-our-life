import { Button } from '#/ui-lib/atoms/Button';

interface StartFemalePeriodButtonProps {
  onStartPeriod(): void;
}

export function StartFemalePeriodButton({ onStartPeriod }: StartFemalePeriodButtonProps) {
  return <Button onClick={onStartPeriod}>Отметить менструацию</Button>;
}
