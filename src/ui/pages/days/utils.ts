import dayjs from '#shared/libs/dayjs';

export function formatDate(date: string) {
  return dayjs(date).format('DD-MM-YYYY') as `${number}-${number}-${number}`;
}

export function getDate(date: `${number}-${number}-${number}`) {
  return dayjs(date, 'DD-MM-YYYY');
}
