import { DateFormat, DateUtils } from '#/shared/models/date';
import { PrismaTransaction } from '#/server/prisma';
import {
  convertFemalePeriodSelector,
  FEMALE_PERIOD_SELECTOR,
} from '#/server/selectors/female-period';
import DayService from '#/server/services/DayService';

class FemalePeriodService {
  async create(startDate: DateFormat, trx: PrismaTransaction) {
    const day = await DayService.getDay(startDate, trx);

    const previousPeriod = await trx.femalePeriod.findFirst({
      where: {
        startDay: {
          date: { lt: DateUtils.fromDateFormat(startDate) },
        },
      },
      orderBy: {
        startDay: { date: 'desc' },
      },
    });

    const nextPeriod = await trx.femalePeriod.findFirst({
      where: {
        startDay: {
          date: { gt: DateUtils.fromDateFormat(startDate) },
        },
      },
      orderBy: {
        startDay: { date: 'asc' },
      },
    });

    return await trx.femalePeriod
      .create({
        data: {
          startDay: {
            connect: { id: day.id },
          },
          prevPeriod: previousPeriod
            ? {
                connect: { id: previousPeriod.id },
              }
            : undefined,
          nextPeriod: nextPeriod
            ? {
                connect: { id: nextPeriod.id },
              }
            : undefined,
        },
        ...FEMALE_PERIOD_SELECTOR,
      })
      .then(convertFemalePeriodSelector);
  }

  async delete(startDate: DateFormat, trx: PrismaTransaction) {
    const period = await trx.femalePeriod.findFirst({
      where: {
        startDay: {
          date: DateUtils.fromDateFormat(startDate),
        },
      },
      select: {
        id: true,
        nextPeriod: true,
        prevPeriod: true,
      },
    });

    if (!period) {
      return;
    }

    await trx.femalePeriod.deleteMany({
      where: { id: period.id },
    });

    const { prevPeriod, nextPeriod } = period;

    if (prevPeriod && nextPeriod) {
      await trx.femalePeriod.update({
        where: { id: prevPeriod.id },
        data: {
          nextPeriodId: nextPeriod.id,
        },
      });
    }
  }

  async list(
    arg: { startDate: DateFormat; endDate: DateFormat },
    trx: PrismaTransaction,
  ) {
    const before = await trx.femalePeriod.findFirst({
      ...FEMALE_PERIOD_SELECTOR,
      where: {
        startDay: {
          date: {
            lte: DateUtils.fromDateFormat(arg.startDate),
          },
        },
      },
      orderBy: {
        startDay: {
          date: 'desc',
        },
      },
    });

    const list = await trx.femalePeriod.findMany({
      where: {
        OR: [
          {
            startDay: {
              date: { lte: DateUtils.fromDateFormat(arg.endDate) },
            },
          },
          {
            startDay: {
              date: { gt: DateUtils.fromDateFormat(arg.startDate) },
            },
          },
        ],
      },
      orderBy: {
        startDay: { date: 'asc' },
      },
      ...FEMALE_PERIOD_SELECTOR,
    });

    return [...(before ? [before] : []), ...list].map(convertFemalePeriodSelector);
  }
}

export default new FemalePeriodService();
