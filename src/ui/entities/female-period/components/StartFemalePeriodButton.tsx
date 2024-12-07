import { Button } from '#ui/components/Button';

interface StartFemalePeriodButtonProps {
  onStartPeriod(): void;
}

export function StartFemalePeriodButton({ onStartPeriod }: StartFemalePeriodButtonProps) {
  return <Button onClick={onStartPeriod}>Отметить менструацию</Button>;
}
