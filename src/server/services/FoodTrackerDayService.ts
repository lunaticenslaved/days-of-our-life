import { PrismaTransaction } from '#server/prisma';
import dayjs from '#shared/libs/dayjs';

class FoodTrackerDayService {
  async getDay(dateProp: string, trx: PrismaTransaction) {
    const date = dayjs(dateProp, { utc: true }).startOf('day').toISOString();

    const day = await trx.foodTrackerDay.findFirst({
      where: { date },
    });

    if (day) {
      return day;
    }

    return await trx.foodTrackerDay.create({
      data: { date },
    });
  }
}

export default new FoodTrackerDayService();
