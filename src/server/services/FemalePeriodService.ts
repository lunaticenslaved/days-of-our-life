import { PrismaTransaction } from '#server/prisma';
import {
  convertFemalePeriod,
  SELECT_FEMALE_PERIOD,
} from '#server/selectors/female-period';
import dayjs from '#shared/libs/dayjs';
import { DateFormat, fromDateFormat } from '#shared/models/common';

class FemalePeriodService {
  async orderPeriods(_arg: unknown, trx: PrismaTransaction) {
    const periods = await trx.femalePeriod.findMany({
      orderBy: { startDate: 'asc' },
    });

    for (let i = 0; i < periods.length; i++) {
      const currentPeriod = periods[i];
      const nextPeriod = i < periods.length ? periods[i + 1] : undefined;

      if (!nextPeriod) {
        continue;
      }

      const endDate = dayjs(nextPeriod.startDate).subtract(1, 'day').toDate();

      if (dayjs(currentPeriod.endDate).isSame(endDate)) {
        continue;
      }

      await trx.femalePeriod.update({
        where: { id: currentPeriod.id },
        data: { endDate },
      });
    }
  }

  async list(
    arg: { startDate: DateFormat; endDate: DateFormat },
    trx: PrismaTransaction,
  ) {
    const startDate = fromDateFormat(arg.startDate);
    const endDate = fromDateFormat(arg.endDate);

    return await trx.femalePeriod
      .findMany({
        where: {
          OR: [{ startDate: { lte: endDate } }, { endDate: { gte: startDate } }],
        },
        orderBy: { startDate: 'asc' },
        ...SELECT_FEMALE_PERIOD,
      })
      .then(items => items.map(convertFemalePeriod));
  }
}

export default new FemalePeriodService();
