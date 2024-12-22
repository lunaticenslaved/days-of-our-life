import dayjs from '#/shared/libs/dayjs';
import { DateFormat, DateUtils } from '#/shared/models/date';

export function format(value: DateFormat) {
  return dayjs(DateUtils.fromDateFormat(value)).format('YYYY-MM-DD');
}
