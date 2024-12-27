import { PrismaTransaction } from '#/server/prisma';
import { DateFormat, DateUtils } from '#/shared/models/date';

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
}

export default new DayService();
