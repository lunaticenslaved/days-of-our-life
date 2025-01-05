import { PrismaTransaction } from '#/server/prisma';
import { BODY_WEIGHT_SELECTOR, convertBodyWeightSelector } from '#/server/selectors/body';
import { convertDayInfoSelector, DAY_INFO_SELECTOR } from '#/server/selectors/days';
import FemalePeriodService from '#/server/services/FemalePeriodService';
import { DateFormat, DateUtils } from '#/shared/models/date';
import { DayInfo } from '#/shared/models/day';
import { sumNutrients } from '#/shared/models/food';

class DayService {
  async getDay(dateArg: DateFormat, trx: PrismaTransaction) {
    const date = DateUtils.fromDateFormat(dateArg);

    const day = await trx.day.findFirst({
      where: { date },
    });

    if (day) {
      return day;
    }

    return await trx.day.create({
      data: { date },
    });
  }

  async list(
    arg: {
      startDate: DateFormat;
      endDate: DateFormat;
    },
    trx: PrismaTransaction,
  ): Promise<Record<DateFormat, DayInfo>> {
    const startDate = DateUtils.fromDateFormat(arg.startDate);
    const endDate = DateUtils.fromDateFormat(arg.endDate);

    const date = {
      gte: startDate,
      lte: endDate,
    };

    const dayInfos = await trx.day
      .findMany({
        where: { date },
        ...DAY_INFO_SELECTOR,
      })
      .then(items => items.map(convertDayInfoSelector));

    const femalePeriodsDesc = await FemalePeriodService.list(
      {
        startDate: arg.startDate,
        endDate: arg.endDate,
      },
      trx,
    ).then(items => [...items].reverse());

    const result: Record<DateFormat, DayInfo> = DateUtils.toMap(
      {
        start: arg.startDate,
        end: arg.endDate,
      },
      date => {
        const femalePeriod = femalePeriodsDesc.find(period => {
          return (
            DateUtils.isSame(date, period.startDate, 'day') ||
            DateUtils.isAfter(date, period.startDate, 'day')
          );
        });
        const dayInfo = dayInfos.find(info => DateUtils.isSame(info.date, date));

        return {
          date,
          femalePeriod: femalePeriod
            ? {
                startDate: femalePeriod.startDate,
              }
            : null,
          food: dayInfo
            ? dayInfo.food
            : {
                nutrients: sumNutrients([]),
              },
          medicamentIntakes: dayInfo?.medicamentIntakes || [],
          cosmeticProductApplications: dayInfo?.cosmeticProductApplications || [],
        };
      },
    );

    function addToResult(
      date: DateFormat,
      data: {
        weight?: number;
      },
    ) {
      const item: DayInfo = {
        ...(result[date] || {}),
        date,
      };

      if (typeof data.weight === 'number') {
        item.weight = data.weight;
      }

      result[date] = item;
    }

    const weights = await trx.bodyStatistics
      .findMany({
        ...BODY_WEIGHT_SELECTOR,
        where: { date },
      })
      .then(items => items.map(convertBodyWeightSelector));

    for (const { date, weight } of weights) {
      addToResult(date, { weight });
    }

    return result;
  }
}

export default new DayService();
