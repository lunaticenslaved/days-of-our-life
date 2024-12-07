import FemalePeriodService from '#server/services/FemalePeriodService';
import { Controller } from '#server/utils/Controller';

import { DateFormat } from '#shared/models/common';
import _ from 'lodash';

import { z } from 'zod';

interface DayPart {
  id: string;
  name: string;
}

const SELECT_DAY_PART = {
    
}

interface GetDayPartsRequest {}
type GetDayPartsResponse = DayPart[];

export default new Controller<'day-parts'>({
  'GET /day-parts': Controller.handler<GetDayPartsRequest, GetDayPartsResponse>({
    validator: z.object({}),
    parse: req => ({
      startDate: req.query.startDate as DateFormat,
      endDate: req.query.endDate as DateFormat,
    }),
    handler: async (_, { prisma }) => {
      return prisma.dayPart.findMany({
        orderBy: {
          order: 'asc',
        },
      });
    },
  }),
});
