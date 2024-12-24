// import {
//   CreateDayPartRequest,
//   CreateDayPartResponse,
//   DeleteDayPartRequest,
//   DeleteDayPartResponse,
//   ListDayPartsRequest,
//   ListDayPartsResponse,
//   UpdateDayPartsResponse,
// } from '#/shared/api/types/days';
// import { DayPart } from '#/shared/models/day';
// import { Controller } from '#server/utils/Controller';

// import { CommonValidators, DateFormat } from '#shared/models/common';
// import _ from 'lodash';

// import { z } from 'zod';

// interface CosmeticProduct {
//   id: string;
//   name: string;
//   manufacturer: string;
// }

// type CreateCosmeticProductResponse = CosmeticProduct;
// interface CreateCosmeticProductRequest {
//   name: string;
//   manufacturer: string;
// }

// export default new Controller<'cosmetic/products'>({
//   'POST /cosmetic/products': Controller.handler<
//     CreateCosmeticProductRequest,
//     CreateCosmeticProductResponse
//   >({
//     validator: z.object({
//       name: CommonValidators.str(255),
//       manufacturer: CommonValidators.str(255),
//     }),
//     parse: req => ({
//       name: req.body.name,
//       manufacturer: req.body.manufacturer,
//     }),
//     handler: async (_, { prisma }) => {
//       return prisma.dayPart
//         .findMany({
//           orderBy: { order: 'asc' },
//           ...SELECT_DAY_PART,
//         })
//         .then(items => items.map(convertDayPart));
//     },
//   }),
// });
