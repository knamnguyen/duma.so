import { z } from 'zod';
import { Prisma } from '../node';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','firstName','lastName','username','primaryEmailAddress','imageUrl','clerkUserProperties','stripeCustomerId','accessType','stripeUserProperties','dailyAIcomments','creditConsumed','createdAt','updatedAt']);

export const UserUploadScalarFieldEnumSchema = z.enum(['id','userId','path','mime','defaultStyle','defaultBgColor','createdAt']);

export const BackgroundRemovedScalarFieldEnumSchema = z.enum(['id','userId','sourceUploadId','path','createdAt']);

export const UserResultScalarFieldEnumSchema = z.enum(['id','userId','path','sourceUploadId','createdAt']);

export const SocialSubmissionScalarFieldEnumSchema = z.enum(['id','userId','platform','originalUrl','urlNormalized','status','requiredKeywords','missingKeywords','matchedKeywords','postText','likes','comments','shares','bestEngagementTotal','creditAwarded','creditPenalty','rescanCount','verifiedAt','lastAttemptAt','errorMessage','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const NullsOrderSchema = z.enum(['first','last']);

export const AccessTypeSchema = z.enum(['FREE','WEEKLY','MONTHLY','YEARLY']);

export type AccessTypeType = `${z.infer<typeof AccessTypeSchema>}`

export const SocialPlatformSchema = z.enum(['X','THREADS','FACEBOOK','LINKEDIN']);

export type SocialPlatformType = `${z.infer<typeof SocialPlatformSchema>}`

export const SocialSubmissionStatusSchema = z.enum(['VERIFYING','VALIDATED','INVALID','DUPLICATE','VALIDATION_FAILED']);

export type SocialSubmissionStatusType = `${z.infer<typeof SocialSubmissionStatusSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  accessType: AccessTypeSchema,
  id: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  username: z.string().nullable(),
  primaryEmailAddress: z.string(),
  imageUrl: z.string().nullable(),
  clerkUserProperties: JsonValueSchema.nullable(),
  stripeCustomerId: z.string().nullable(),
  stripeUserProperties: JsonValueSchema.nullable(),
  dailyAIcomments: z.number().int(),
  creditConsumed: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER UPLOAD SCHEMA
/////////////////////////////////////////

/**
 * Minimal asset tracking for Gif Avatar
 */
export const UserUploadSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  path: z.string(),
  mime: z.string(),
  defaultStyle: z.string().nullable(),
  defaultBgColor: z.string().nullable(),
  createdAt: z.coerce.date(),
})

export type UserUpload = z.infer<typeof UserUploadSchema>

/////////////////////////////////////////
// BACKGROUND REMOVED SCHEMA
/////////////////////////////////////////

export const BackgroundRemovedSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  sourceUploadId: z.string(),
  path: z.string(),
  createdAt: z.coerce.date(),
})

export type BackgroundRemoved = z.infer<typeof BackgroundRemovedSchema>

/////////////////////////////////////////
// USER RESULT SCHEMA
/////////////////////////////////////////

export const UserResultSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  path: z.string(),
  sourceUploadId: z.string().nullable(),
  createdAt: z.coerce.date(),
})

export type UserResult = z.infer<typeof UserResultSchema>

/////////////////////////////////////////
// SOCIAL SUBMISSION SCHEMA
/////////////////////////////////////////

export const SocialSubmissionSchema = z.object({
  platform: SocialPlatformSchema,
  status: SocialSubmissionStatusSchema,
  id: z.string().cuid(),
  userId: z.string(),
  originalUrl: z.string(),
  urlNormalized: z.string(),
  requiredKeywords: z.string().array(),
  missingKeywords: z.string().array(),
  matchedKeywords: z.string().array(),
  postText: z.string().nullable(),
  likes: z.number().int(),
  comments: z.number().int(),
  shares: z.number().int(),
  bestEngagementTotal: z.number().int(),
  creditAwarded: z.number().int(),
  creditPenalty: z.number().int(),
  rescanCount: z.number().int(),
  verifiedAt: z.coerce.date().nullable(),
  lastAttemptAt: z.coerce.date().nullable(),
  errorMessage: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type SocialSubmission = z.infer<typeof SocialSubmissionSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  username: z.boolean().optional(),
  primaryEmailAddress: z.boolean().optional(),
  imageUrl: z.boolean().optional(),
  clerkUserProperties: z.boolean().optional(),
  stripeCustomerId: z.boolean().optional(),
  accessType: z.boolean().optional(),
  stripeUserProperties: z.boolean().optional(),
  dailyAIcomments: z.boolean().optional(),
  creditConsumed: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
}).strict()

// USER UPLOAD
//------------------------------------------------------

export const UserUploadSelectSchema: z.ZodType<Prisma.UserUploadSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  path: z.boolean().optional(),
  mime: z.boolean().optional(),
  defaultStyle: z.boolean().optional(),
  defaultBgColor: z.boolean().optional(),
  createdAt: z.boolean().optional(),
}).strict()

// BACKGROUND REMOVED
//------------------------------------------------------

export const BackgroundRemovedSelectSchema: z.ZodType<Prisma.BackgroundRemovedSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  sourceUploadId: z.boolean().optional(),
  path: z.boolean().optional(),
  createdAt: z.boolean().optional(),
}).strict()

// USER RESULT
//------------------------------------------------------

export const UserResultSelectSchema: z.ZodType<Prisma.UserResultSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  path: z.boolean().optional(),
  sourceUploadId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
}).strict()

// SOCIAL SUBMISSION
//------------------------------------------------------

export const SocialSubmissionSelectSchema: z.ZodType<Prisma.SocialSubmissionSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  platform: z.boolean().optional(),
  originalUrl: z.boolean().optional(),
  urlNormalized: z.boolean().optional(),
  status: z.boolean().optional(),
  requiredKeywords: z.boolean().optional(),
  missingKeywords: z.boolean().optional(),
  matchedKeywords: z.boolean().optional(),
  postText: z.boolean().optional(),
  likes: z.boolean().optional(),
  comments: z.boolean().optional(),
  shares: z.boolean().optional(),
  bestEngagementTotal: z.boolean().optional(),
  creditAwarded: z.boolean().optional(),
  creditPenalty: z.boolean().optional(),
  rescanCount: z.boolean().optional(),
  verifiedAt: z.boolean().optional(),
  lastAttemptAt: z.boolean().optional(),
  errorMessage: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  username: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  primaryEmailAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  clerkUserProperties: z.lazy(() => JsonNullableFilterSchema).optional(),
  stripeCustomerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  accessType: z.union([ z.lazy(() => EnumAccessTypeFilterSchema),z.lazy(() => AccessTypeSchema) ]).optional(),
  stripeUserProperties: z.lazy(() => JsonNullableFilterSchema).optional(),
  dailyAIcomments: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  creditConsumed: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  username: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  primaryEmailAddress: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  clerkUserProperties: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  stripeCustomerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  accessType: z.lazy(() => SortOrderSchema).optional(),
  stripeUserProperties: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dailyAIcomments: z.lazy(() => SortOrderSchema).optional(),
  creditConsumed: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    username: z.string(),
    primaryEmailAddress: z.string(),
    stripeCustomerId: z.string()
  }),
  z.object({
    id: z.string(),
    username: z.string(),
    primaryEmailAddress: z.string(),
  }),
  z.object({
    id: z.string(),
    username: z.string(),
    stripeCustomerId: z.string(),
  }),
  z.object({
    id: z.string(),
    username: z.string(),
  }),
  z.object({
    id: z.string(),
    primaryEmailAddress: z.string(),
    stripeCustomerId: z.string(),
  }),
  z.object({
    id: z.string(),
    primaryEmailAddress: z.string(),
  }),
  z.object({
    id: z.string(),
    stripeCustomerId: z.string(),
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    username: z.string(),
    primaryEmailAddress: z.string(),
    stripeCustomerId: z.string(),
  }),
  z.object({
    username: z.string(),
    primaryEmailAddress: z.string(),
  }),
  z.object({
    username: z.string(),
    stripeCustomerId: z.string(),
  }),
  z.object({
    username: z.string(),
  }),
  z.object({
    primaryEmailAddress: z.string(),
    stripeCustomerId: z.string(),
  }),
  z.object({
    primaryEmailAddress: z.string(),
  }),
  z.object({
    stripeCustomerId: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  username: z.string().optional(),
  primaryEmailAddress: z.string().optional(),
  stripeCustomerId: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  firstName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  clerkUserProperties: z.lazy(() => JsonNullableFilterSchema).optional(),
  accessType: z.union([ z.lazy(() => EnumAccessTypeFilterSchema),z.lazy(() => AccessTypeSchema) ]).optional(),
  stripeUserProperties: z.lazy(() => JsonNullableFilterSchema).optional(),
  dailyAIcomments: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  creditConsumed: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  username: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  primaryEmailAddress: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  clerkUserProperties: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  stripeCustomerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  accessType: z.lazy(() => SortOrderSchema).optional(),
  stripeUserProperties: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dailyAIcomments: z.lazy(() => SortOrderSchema).optional(),
  creditConsumed: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  username: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  primaryEmailAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  imageUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  clerkUserProperties: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  stripeCustomerId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  accessType: z.union([ z.lazy(() => EnumAccessTypeWithAggregatesFilterSchema),z.lazy(() => AccessTypeSchema) ]).optional(),
  stripeUserProperties: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  dailyAIcomments: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  creditConsumed: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserUploadWhereInputSchema: z.ZodType<Prisma.UserUploadWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserUploadWhereInputSchema),z.lazy(() => UserUploadWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserUploadWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserUploadWhereInputSchema),z.lazy(() => UserUploadWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  path: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  mime: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  defaultStyle: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  defaultBgColor: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserUploadOrderByWithRelationInputSchema: z.ZodType<Prisma.UserUploadOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  mime: z.lazy(() => SortOrderSchema).optional(),
  defaultStyle: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  defaultBgColor: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserUploadWhereUniqueInputSchema: z.ZodType<Prisma.UserUploadWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => UserUploadWhereInputSchema),z.lazy(() => UserUploadWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserUploadWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserUploadWhereInputSchema),z.lazy(() => UserUploadWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  path: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  mime: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  defaultStyle: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  defaultBgColor: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const UserUploadOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserUploadOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  mime: z.lazy(() => SortOrderSchema).optional(),
  defaultStyle: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  defaultBgColor: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserUploadCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserUploadMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserUploadMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserUploadScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserUploadScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserUploadScalarWhereWithAggregatesInputSchema),z.lazy(() => UserUploadScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserUploadScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserUploadScalarWhereWithAggregatesInputSchema),z.lazy(() => UserUploadScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  path: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  mime: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  defaultStyle: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  defaultBgColor: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const BackgroundRemovedWhereInputSchema: z.ZodType<Prisma.BackgroundRemovedWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BackgroundRemovedWhereInputSchema),z.lazy(() => BackgroundRemovedWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BackgroundRemovedWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BackgroundRemovedWhereInputSchema),z.lazy(() => BackgroundRemovedWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sourceUploadId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  path: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const BackgroundRemovedOrderByWithRelationInputSchema: z.ZodType<Prisma.BackgroundRemovedOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  sourceUploadId: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BackgroundRemovedWhereUniqueInputSchema: z.ZodType<Prisma.BackgroundRemovedWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => BackgroundRemovedWhereInputSchema),z.lazy(() => BackgroundRemovedWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BackgroundRemovedWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BackgroundRemovedWhereInputSchema),z.lazy(() => BackgroundRemovedWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sourceUploadId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  path: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const BackgroundRemovedOrderByWithAggregationInputSchema: z.ZodType<Prisma.BackgroundRemovedOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  sourceUploadId: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => BackgroundRemovedCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BackgroundRemovedMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BackgroundRemovedMinOrderByAggregateInputSchema).optional()
}).strict();

export const BackgroundRemovedScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BackgroundRemovedScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => BackgroundRemovedScalarWhereWithAggregatesInputSchema),z.lazy(() => BackgroundRemovedScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BackgroundRemovedScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BackgroundRemovedScalarWhereWithAggregatesInputSchema),z.lazy(() => BackgroundRemovedScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  sourceUploadId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  path: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserResultWhereInputSchema: z.ZodType<Prisma.UserResultWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserResultWhereInputSchema),z.lazy(() => UserResultWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserResultWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserResultWhereInputSchema),z.lazy(() => UserResultWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  path: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sourceUploadId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserResultOrderByWithRelationInputSchema: z.ZodType<Prisma.UserResultOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  sourceUploadId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserResultWhereUniqueInputSchema: z.ZodType<Prisma.UserResultWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => UserResultWhereInputSchema),z.lazy(() => UserResultWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserResultWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserResultWhereInputSchema),z.lazy(() => UserResultWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  path: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sourceUploadId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const UserResultOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserResultOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  sourceUploadId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserResultCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserResultMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserResultMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserResultScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserResultScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserResultScalarWhereWithAggregatesInputSchema),z.lazy(() => UserResultScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserResultScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserResultScalarWhereWithAggregatesInputSchema),z.lazy(() => UserResultScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  path: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  sourceUploadId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const SocialSubmissionWhereInputSchema: z.ZodType<Prisma.SocialSubmissionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SocialSubmissionWhereInputSchema),z.lazy(() => SocialSubmissionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SocialSubmissionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SocialSubmissionWhereInputSchema),z.lazy(() => SocialSubmissionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  platform: z.union([ z.lazy(() => EnumSocialPlatformFilterSchema),z.lazy(() => SocialPlatformSchema) ]).optional(),
  originalUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  urlNormalized: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumSocialSubmissionStatusFilterSchema),z.lazy(() => SocialSubmissionStatusSchema) ]).optional(),
  requiredKeywords: z.lazy(() => StringNullableListFilterSchema).optional(),
  missingKeywords: z.lazy(() => StringNullableListFilterSchema).optional(),
  matchedKeywords: z.lazy(() => StringNullableListFilterSchema).optional(),
  postText: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  likes: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  comments: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  shares: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  bestEngagementTotal: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  creditAwarded: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  creditPenalty: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  rescanCount: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  verifiedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  lastAttemptAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  errorMessage: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const SocialSubmissionOrderByWithRelationInputSchema: z.ZodType<Prisma.SocialSubmissionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  platform: z.lazy(() => SortOrderSchema).optional(),
  originalUrl: z.lazy(() => SortOrderSchema).optional(),
  urlNormalized: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  requiredKeywords: z.lazy(() => SortOrderSchema).optional(),
  missingKeywords: z.lazy(() => SortOrderSchema).optional(),
  matchedKeywords: z.lazy(() => SortOrderSchema).optional(),
  postText: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  likes: z.lazy(() => SortOrderSchema).optional(),
  comments: z.lazy(() => SortOrderSchema).optional(),
  shares: z.lazy(() => SortOrderSchema).optional(),
  bestEngagementTotal: z.lazy(() => SortOrderSchema).optional(),
  creditAwarded: z.lazy(() => SortOrderSchema).optional(),
  creditPenalty: z.lazy(() => SortOrderSchema).optional(),
  rescanCount: z.lazy(() => SortOrderSchema).optional(),
  verifiedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastAttemptAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  errorMessage: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SocialSubmissionWhereUniqueInputSchema: z.ZodType<Prisma.SocialSubmissionWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    urlNormalized: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    urlNormalized: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  urlNormalized: z.string().optional(),
  AND: z.union([ z.lazy(() => SocialSubmissionWhereInputSchema),z.lazy(() => SocialSubmissionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SocialSubmissionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SocialSubmissionWhereInputSchema),z.lazy(() => SocialSubmissionWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  platform: z.union([ z.lazy(() => EnumSocialPlatformFilterSchema),z.lazy(() => SocialPlatformSchema) ]).optional(),
  originalUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumSocialSubmissionStatusFilterSchema),z.lazy(() => SocialSubmissionStatusSchema) ]).optional(),
  requiredKeywords: z.lazy(() => StringNullableListFilterSchema).optional(),
  missingKeywords: z.lazy(() => StringNullableListFilterSchema).optional(),
  matchedKeywords: z.lazy(() => StringNullableListFilterSchema).optional(),
  postText: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  likes: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  comments: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  shares: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  bestEngagementTotal: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  creditAwarded: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  creditPenalty: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  rescanCount: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  verifiedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  lastAttemptAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  errorMessage: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const SocialSubmissionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SocialSubmissionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  platform: z.lazy(() => SortOrderSchema).optional(),
  originalUrl: z.lazy(() => SortOrderSchema).optional(),
  urlNormalized: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  requiredKeywords: z.lazy(() => SortOrderSchema).optional(),
  missingKeywords: z.lazy(() => SortOrderSchema).optional(),
  matchedKeywords: z.lazy(() => SortOrderSchema).optional(),
  postText: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  likes: z.lazy(() => SortOrderSchema).optional(),
  comments: z.lazy(() => SortOrderSchema).optional(),
  shares: z.lazy(() => SortOrderSchema).optional(),
  bestEngagementTotal: z.lazy(() => SortOrderSchema).optional(),
  creditAwarded: z.lazy(() => SortOrderSchema).optional(),
  creditPenalty: z.lazy(() => SortOrderSchema).optional(),
  rescanCount: z.lazy(() => SortOrderSchema).optional(),
  verifiedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastAttemptAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  errorMessage: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SocialSubmissionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => SocialSubmissionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SocialSubmissionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SocialSubmissionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => SocialSubmissionSumOrderByAggregateInputSchema).optional()
}).strict();

export const SocialSubmissionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SocialSubmissionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SocialSubmissionScalarWhereWithAggregatesInputSchema),z.lazy(() => SocialSubmissionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SocialSubmissionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SocialSubmissionScalarWhereWithAggregatesInputSchema),z.lazy(() => SocialSubmissionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  platform: z.union([ z.lazy(() => EnumSocialPlatformWithAggregatesFilterSchema),z.lazy(() => SocialPlatformSchema) ]).optional(),
  originalUrl: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  urlNormalized: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumSocialSubmissionStatusWithAggregatesFilterSchema),z.lazy(() => SocialSubmissionStatusSchema) ]).optional(),
  requiredKeywords: z.lazy(() => StringNullableListFilterSchema).optional(),
  missingKeywords: z.lazy(() => StringNullableListFilterSchema).optional(),
  matchedKeywords: z.lazy(() => StringNullableListFilterSchema).optional(),
  postText: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  likes: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  comments: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  shares: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  bestEngagementTotal: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  creditAwarded: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  creditPenalty: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  rescanCount: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  verifiedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  lastAttemptAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  errorMessage: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  primaryEmailAddress: z.string(),
  imageUrl: z.string().optional().nullable(),
  clerkUserProperties: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  stripeCustomerId: z.string().optional().nullable(),
  accessType: z.lazy(() => AccessTypeSchema).optional(),
  stripeUserProperties: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  dailyAIcomments: z.number().int().optional(),
  creditConsumed: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  primaryEmailAddress: z.string(),
  imageUrl: z.string().optional().nullable(),
  clerkUserProperties: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  stripeCustomerId: z.string().optional().nullable(),
  accessType: z.lazy(() => AccessTypeSchema).optional(),
  stripeUserProperties: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  dailyAIcomments: z.number().int().optional(),
  creditConsumed: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  primaryEmailAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clerkUserProperties: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  stripeCustomerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accessType: z.union([ z.lazy(() => AccessTypeSchema),z.lazy(() => EnumAccessTypeFieldUpdateOperationsInputSchema) ]).optional(),
  stripeUserProperties: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  dailyAIcomments: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creditConsumed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  primaryEmailAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clerkUserProperties: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  stripeCustomerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accessType: z.union([ z.lazy(() => AccessTypeSchema),z.lazy(() => EnumAccessTypeFieldUpdateOperationsInputSchema) ]).optional(),
  stripeUserProperties: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  dailyAIcomments: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creditConsumed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  primaryEmailAddress: z.string(),
  imageUrl: z.string().optional().nullable(),
  clerkUserProperties: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  stripeCustomerId: z.string().optional().nullable(),
  accessType: z.lazy(() => AccessTypeSchema).optional(),
  stripeUserProperties: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  dailyAIcomments: z.number().int().optional(),
  creditConsumed: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  primaryEmailAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clerkUserProperties: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  stripeCustomerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accessType: z.union([ z.lazy(() => AccessTypeSchema),z.lazy(() => EnumAccessTypeFieldUpdateOperationsInputSchema) ]).optional(),
  stripeUserProperties: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  dailyAIcomments: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creditConsumed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  primaryEmailAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clerkUserProperties: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  stripeCustomerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accessType: z.union([ z.lazy(() => AccessTypeSchema),z.lazy(() => EnumAccessTypeFieldUpdateOperationsInputSchema) ]).optional(),
  stripeUserProperties: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  dailyAIcomments: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creditConsumed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUploadCreateInputSchema: z.ZodType<Prisma.UserUploadCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  path: z.string(),
  mime: z.string(),
  defaultStyle: z.string().optional().nullable(),
  defaultBgColor: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserUploadUncheckedCreateInputSchema: z.ZodType<Prisma.UserUploadUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  path: z.string(),
  mime: z.string(),
  defaultStyle: z.string().optional().nullable(),
  defaultBgColor: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserUploadUpdateInputSchema: z.ZodType<Prisma.UserUploadUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultStyle: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  defaultBgColor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUploadUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUploadUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultStyle: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  defaultBgColor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUploadCreateManyInputSchema: z.ZodType<Prisma.UserUploadCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  path: z.string(),
  mime: z.string(),
  defaultStyle: z.string().optional().nullable(),
  defaultBgColor: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserUploadUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUploadUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultStyle: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  defaultBgColor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUploadUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUploadUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultStyle: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  defaultBgColor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BackgroundRemovedCreateInputSchema: z.ZodType<Prisma.BackgroundRemovedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  sourceUploadId: z.string(),
  path: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();

export const BackgroundRemovedUncheckedCreateInputSchema: z.ZodType<Prisma.BackgroundRemovedUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  sourceUploadId: z.string(),
  path: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();

export const BackgroundRemovedUpdateInputSchema: z.ZodType<Prisma.BackgroundRemovedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceUploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BackgroundRemovedUncheckedUpdateInputSchema: z.ZodType<Prisma.BackgroundRemovedUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceUploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BackgroundRemovedCreateManyInputSchema: z.ZodType<Prisma.BackgroundRemovedCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  sourceUploadId: z.string(),
  path: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();

export const BackgroundRemovedUpdateManyMutationInputSchema: z.ZodType<Prisma.BackgroundRemovedUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceUploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BackgroundRemovedUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BackgroundRemovedUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceUploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserResultCreateInputSchema: z.ZodType<Prisma.UserResultCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  path: z.string(),
  sourceUploadId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserResultUncheckedCreateInputSchema: z.ZodType<Prisma.UserResultUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  path: z.string(),
  sourceUploadId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserResultUpdateInputSchema: z.ZodType<Prisma.UserResultUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceUploadId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserResultUncheckedUpdateInputSchema: z.ZodType<Prisma.UserResultUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceUploadId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserResultCreateManyInputSchema: z.ZodType<Prisma.UserResultCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  path: z.string(),
  sourceUploadId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserResultUpdateManyMutationInputSchema: z.ZodType<Prisma.UserResultUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceUploadId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserResultUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserResultUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceUploadId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SocialSubmissionCreateInputSchema: z.ZodType<Prisma.SocialSubmissionCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  platform: z.lazy(() => SocialPlatformSchema),
  originalUrl: z.string(),
  urlNormalized: z.string(),
  status: z.lazy(() => SocialSubmissionStatusSchema).optional(),
  requiredKeywords: z.union([ z.lazy(() => SocialSubmissionCreaterequiredKeywordsInputSchema),z.string().array() ]).optional(),
  missingKeywords: z.union([ z.lazy(() => SocialSubmissionCreatemissingKeywordsInputSchema),z.string().array() ]).optional(),
  matchedKeywords: z.union([ z.lazy(() => SocialSubmissionCreatematchedKeywordsInputSchema),z.string().array() ]).optional(),
  postText: z.string().optional().nullable(),
  likes: z.number().int().optional(),
  comments: z.number().int().optional(),
  shares: z.number().int().optional(),
  bestEngagementTotal: z.number().int().optional(),
  creditAwarded: z.number().int().optional(),
  creditPenalty: z.number().int().optional(),
  rescanCount: z.number().int().optional(),
  verifiedAt: z.coerce.date().optional().nullable(),
  lastAttemptAt: z.coerce.date().optional().nullable(),
  errorMessage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SocialSubmissionUncheckedCreateInputSchema: z.ZodType<Prisma.SocialSubmissionUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  platform: z.lazy(() => SocialPlatformSchema),
  originalUrl: z.string(),
  urlNormalized: z.string(),
  status: z.lazy(() => SocialSubmissionStatusSchema).optional(),
  requiredKeywords: z.union([ z.lazy(() => SocialSubmissionCreaterequiredKeywordsInputSchema),z.string().array() ]).optional(),
  missingKeywords: z.union([ z.lazy(() => SocialSubmissionCreatemissingKeywordsInputSchema),z.string().array() ]).optional(),
  matchedKeywords: z.union([ z.lazy(() => SocialSubmissionCreatematchedKeywordsInputSchema),z.string().array() ]).optional(),
  postText: z.string().optional().nullable(),
  likes: z.number().int().optional(),
  comments: z.number().int().optional(),
  shares: z.number().int().optional(),
  bestEngagementTotal: z.number().int().optional(),
  creditAwarded: z.number().int().optional(),
  creditPenalty: z.number().int().optional(),
  rescanCount: z.number().int().optional(),
  verifiedAt: z.coerce.date().optional().nullable(),
  lastAttemptAt: z.coerce.date().optional().nullable(),
  errorMessage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SocialSubmissionUpdateInputSchema: z.ZodType<Prisma.SocialSubmissionUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => SocialPlatformSchema),z.lazy(() => EnumSocialPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  originalUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  urlNormalized: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SocialSubmissionStatusSchema),z.lazy(() => EnumSocialSubmissionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  requiredKeywords: z.union([ z.lazy(() => SocialSubmissionUpdaterequiredKeywordsInputSchema),z.string().array() ]).optional(),
  missingKeywords: z.union([ z.lazy(() => SocialSubmissionUpdatemissingKeywordsInputSchema),z.string().array() ]).optional(),
  matchedKeywords: z.union([ z.lazy(() => SocialSubmissionUpdatematchedKeywordsInputSchema),z.string().array() ]).optional(),
  postText: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  likes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comments: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  shares: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bestEngagementTotal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creditAwarded: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creditPenalty: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rescanCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  verifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastAttemptAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SocialSubmissionUncheckedUpdateInputSchema: z.ZodType<Prisma.SocialSubmissionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => SocialPlatformSchema),z.lazy(() => EnumSocialPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  originalUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  urlNormalized: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SocialSubmissionStatusSchema),z.lazy(() => EnumSocialSubmissionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  requiredKeywords: z.union([ z.lazy(() => SocialSubmissionUpdaterequiredKeywordsInputSchema),z.string().array() ]).optional(),
  missingKeywords: z.union([ z.lazy(() => SocialSubmissionUpdatemissingKeywordsInputSchema),z.string().array() ]).optional(),
  matchedKeywords: z.union([ z.lazy(() => SocialSubmissionUpdatematchedKeywordsInputSchema),z.string().array() ]).optional(),
  postText: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  likes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comments: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  shares: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bestEngagementTotal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creditAwarded: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creditPenalty: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rescanCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  verifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastAttemptAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SocialSubmissionCreateManyInputSchema: z.ZodType<Prisma.SocialSubmissionCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  platform: z.lazy(() => SocialPlatformSchema),
  originalUrl: z.string(),
  urlNormalized: z.string(),
  status: z.lazy(() => SocialSubmissionStatusSchema).optional(),
  requiredKeywords: z.union([ z.lazy(() => SocialSubmissionCreaterequiredKeywordsInputSchema),z.string().array() ]).optional(),
  missingKeywords: z.union([ z.lazy(() => SocialSubmissionCreatemissingKeywordsInputSchema),z.string().array() ]).optional(),
  matchedKeywords: z.union([ z.lazy(() => SocialSubmissionCreatematchedKeywordsInputSchema),z.string().array() ]).optional(),
  postText: z.string().optional().nullable(),
  likes: z.number().int().optional(),
  comments: z.number().int().optional(),
  shares: z.number().int().optional(),
  bestEngagementTotal: z.number().int().optional(),
  creditAwarded: z.number().int().optional(),
  creditPenalty: z.number().int().optional(),
  rescanCount: z.number().int().optional(),
  verifiedAt: z.coerce.date().optional().nullable(),
  lastAttemptAt: z.coerce.date().optional().nullable(),
  errorMessage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SocialSubmissionUpdateManyMutationInputSchema: z.ZodType<Prisma.SocialSubmissionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => SocialPlatformSchema),z.lazy(() => EnumSocialPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  originalUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  urlNormalized: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SocialSubmissionStatusSchema),z.lazy(() => EnumSocialSubmissionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  requiredKeywords: z.union([ z.lazy(() => SocialSubmissionUpdaterequiredKeywordsInputSchema),z.string().array() ]).optional(),
  missingKeywords: z.union([ z.lazy(() => SocialSubmissionUpdatemissingKeywordsInputSchema),z.string().array() ]).optional(),
  matchedKeywords: z.union([ z.lazy(() => SocialSubmissionUpdatematchedKeywordsInputSchema),z.string().array() ]).optional(),
  postText: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  likes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comments: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  shares: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bestEngagementTotal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creditAwarded: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creditPenalty: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rescanCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  verifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastAttemptAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SocialSubmissionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SocialSubmissionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => SocialPlatformSchema),z.lazy(() => EnumSocialPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  originalUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  urlNormalized: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SocialSubmissionStatusSchema),z.lazy(() => EnumSocialSubmissionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  requiredKeywords: z.union([ z.lazy(() => SocialSubmissionUpdaterequiredKeywordsInputSchema),z.string().array() ]).optional(),
  missingKeywords: z.union([ z.lazy(() => SocialSubmissionUpdatemissingKeywordsInputSchema),z.string().array() ]).optional(),
  matchedKeywords: z.union([ z.lazy(() => SocialSubmissionUpdatematchedKeywordsInputSchema),z.string().array() ]).optional(),
  postText: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  likes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comments: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  shares: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bestEngagementTotal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creditAwarded: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creditPenalty: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rescanCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  verifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastAttemptAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const EnumAccessTypeFilterSchema: z.ZodType<Prisma.EnumAccessTypeFilter> = z.object({
  equals: z.lazy(() => AccessTypeSchema).optional(),
  in: z.lazy(() => AccessTypeSchema).array().optional(),
  notIn: z.lazy(() => AccessTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => AccessTypeSchema),z.lazy(() => NestedEnumAccessTypeFilterSchema) ]).optional(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  primaryEmailAddress: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  clerkUserProperties: z.lazy(() => SortOrderSchema).optional(),
  stripeCustomerId: z.lazy(() => SortOrderSchema).optional(),
  accessType: z.lazy(() => SortOrderSchema).optional(),
  stripeUserProperties: z.lazy(() => SortOrderSchema).optional(),
  dailyAIcomments: z.lazy(() => SortOrderSchema).optional(),
  creditConsumed: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.object({
  dailyAIcomments: z.lazy(() => SortOrderSchema).optional(),
  creditConsumed: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  primaryEmailAddress: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  stripeCustomerId: z.lazy(() => SortOrderSchema).optional(),
  accessType: z.lazy(() => SortOrderSchema).optional(),
  dailyAIcomments: z.lazy(() => SortOrderSchema).optional(),
  creditConsumed: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  primaryEmailAddress: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  stripeCustomerId: z.lazy(() => SortOrderSchema).optional(),
  accessType: z.lazy(() => SortOrderSchema).optional(),
  dailyAIcomments: z.lazy(() => SortOrderSchema).optional(),
  creditConsumed: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.object({
  dailyAIcomments: z.lazy(() => SortOrderSchema).optional(),
  creditConsumed: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const EnumAccessTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumAccessTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => AccessTypeSchema).optional(),
  in: z.lazy(() => AccessTypeSchema).array().optional(),
  notIn: z.lazy(() => AccessTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => AccessTypeSchema),z.lazy(() => NestedEnumAccessTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumAccessTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumAccessTypeFilterSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const UserUploadCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserUploadCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  mime: z.lazy(() => SortOrderSchema).optional(),
  defaultStyle: z.lazy(() => SortOrderSchema).optional(),
  defaultBgColor: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserUploadMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserUploadMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  mime: z.lazy(() => SortOrderSchema).optional(),
  defaultStyle: z.lazy(() => SortOrderSchema).optional(),
  defaultBgColor: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserUploadMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserUploadMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  mime: z.lazy(() => SortOrderSchema).optional(),
  defaultStyle: z.lazy(() => SortOrderSchema).optional(),
  defaultBgColor: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BackgroundRemovedCountOrderByAggregateInputSchema: z.ZodType<Prisma.BackgroundRemovedCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  sourceUploadId: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BackgroundRemovedMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BackgroundRemovedMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  sourceUploadId: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BackgroundRemovedMinOrderByAggregateInputSchema: z.ZodType<Prisma.BackgroundRemovedMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  sourceUploadId: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserResultCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserResultCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  sourceUploadId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserResultMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserResultMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  sourceUploadId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserResultMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserResultMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  sourceUploadId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumSocialPlatformFilterSchema: z.ZodType<Prisma.EnumSocialPlatformFilter> = z.object({
  equals: z.lazy(() => SocialPlatformSchema).optional(),
  in: z.lazy(() => SocialPlatformSchema).array().optional(),
  notIn: z.lazy(() => SocialPlatformSchema).array().optional(),
  not: z.union([ z.lazy(() => SocialPlatformSchema),z.lazy(() => NestedEnumSocialPlatformFilterSchema) ]).optional(),
}).strict();

export const EnumSocialSubmissionStatusFilterSchema: z.ZodType<Prisma.EnumSocialSubmissionStatusFilter> = z.object({
  equals: z.lazy(() => SocialSubmissionStatusSchema).optional(),
  in: z.lazy(() => SocialSubmissionStatusSchema).array().optional(),
  notIn: z.lazy(() => SocialSubmissionStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SocialSubmissionStatusSchema),z.lazy(() => NestedEnumSocialSubmissionStatusFilterSchema) ]).optional(),
}).strict();

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.object({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const SocialSubmissionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SocialSubmissionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  platform: z.lazy(() => SortOrderSchema).optional(),
  originalUrl: z.lazy(() => SortOrderSchema).optional(),
  urlNormalized: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  requiredKeywords: z.lazy(() => SortOrderSchema).optional(),
  missingKeywords: z.lazy(() => SortOrderSchema).optional(),
  matchedKeywords: z.lazy(() => SortOrderSchema).optional(),
  postText: z.lazy(() => SortOrderSchema).optional(),
  likes: z.lazy(() => SortOrderSchema).optional(),
  comments: z.lazy(() => SortOrderSchema).optional(),
  shares: z.lazy(() => SortOrderSchema).optional(),
  bestEngagementTotal: z.lazy(() => SortOrderSchema).optional(),
  creditAwarded: z.lazy(() => SortOrderSchema).optional(),
  creditPenalty: z.lazy(() => SortOrderSchema).optional(),
  rescanCount: z.lazy(() => SortOrderSchema).optional(),
  verifiedAt: z.lazy(() => SortOrderSchema).optional(),
  lastAttemptAt: z.lazy(() => SortOrderSchema).optional(),
  errorMessage: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SocialSubmissionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.SocialSubmissionAvgOrderByAggregateInput> = z.object({
  likes: z.lazy(() => SortOrderSchema).optional(),
  comments: z.lazy(() => SortOrderSchema).optional(),
  shares: z.lazy(() => SortOrderSchema).optional(),
  bestEngagementTotal: z.lazy(() => SortOrderSchema).optional(),
  creditAwarded: z.lazy(() => SortOrderSchema).optional(),
  creditPenalty: z.lazy(() => SortOrderSchema).optional(),
  rescanCount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SocialSubmissionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SocialSubmissionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  platform: z.lazy(() => SortOrderSchema).optional(),
  originalUrl: z.lazy(() => SortOrderSchema).optional(),
  urlNormalized: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  postText: z.lazy(() => SortOrderSchema).optional(),
  likes: z.lazy(() => SortOrderSchema).optional(),
  comments: z.lazy(() => SortOrderSchema).optional(),
  shares: z.lazy(() => SortOrderSchema).optional(),
  bestEngagementTotal: z.lazy(() => SortOrderSchema).optional(),
  creditAwarded: z.lazy(() => SortOrderSchema).optional(),
  creditPenalty: z.lazy(() => SortOrderSchema).optional(),
  rescanCount: z.lazy(() => SortOrderSchema).optional(),
  verifiedAt: z.lazy(() => SortOrderSchema).optional(),
  lastAttemptAt: z.lazy(() => SortOrderSchema).optional(),
  errorMessage: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SocialSubmissionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SocialSubmissionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  platform: z.lazy(() => SortOrderSchema).optional(),
  originalUrl: z.lazy(() => SortOrderSchema).optional(),
  urlNormalized: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  postText: z.lazy(() => SortOrderSchema).optional(),
  likes: z.lazy(() => SortOrderSchema).optional(),
  comments: z.lazy(() => SortOrderSchema).optional(),
  shares: z.lazy(() => SortOrderSchema).optional(),
  bestEngagementTotal: z.lazy(() => SortOrderSchema).optional(),
  creditAwarded: z.lazy(() => SortOrderSchema).optional(),
  creditPenalty: z.lazy(() => SortOrderSchema).optional(),
  rescanCount: z.lazy(() => SortOrderSchema).optional(),
  verifiedAt: z.lazy(() => SortOrderSchema).optional(),
  lastAttemptAt: z.lazy(() => SortOrderSchema).optional(),
  errorMessage: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SocialSubmissionSumOrderByAggregateInputSchema: z.ZodType<Prisma.SocialSubmissionSumOrderByAggregateInput> = z.object({
  likes: z.lazy(() => SortOrderSchema).optional(),
  comments: z.lazy(() => SortOrderSchema).optional(),
  shares: z.lazy(() => SortOrderSchema).optional(),
  bestEngagementTotal: z.lazy(() => SortOrderSchema).optional(),
  creditAwarded: z.lazy(() => SortOrderSchema).optional(),
  creditPenalty: z.lazy(() => SortOrderSchema).optional(),
  rescanCount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumSocialPlatformWithAggregatesFilterSchema: z.ZodType<Prisma.EnumSocialPlatformWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SocialPlatformSchema).optional(),
  in: z.lazy(() => SocialPlatformSchema).array().optional(),
  notIn: z.lazy(() => SocialPlatformSchema).array().optional(),
  not: z.union([ z.lazy(() => SocialPlatformSchema),z.lazy(() => NestedEnumSocialPlatformWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSocialPlatformFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSocialPlatformFilterSchema).optional()
}).strict();

export const EnumSocialSubmissionStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumSocialSubmissionStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SocialSubmissionStatusSchema).optional(),
  in: z.lazy(() => SocialSubmissionStatusSchema).array().optional(),
  notIn: z.lazy(() => SocialSubmissionStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SocialSubmissionStatusSchema),z.lazy(() => NestedEnumSocialSubmissionStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSocialSubmissionStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSocialSubmissionStatusFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const EnumAccessTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumAccessTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => AccessTypeSchema).optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const SocialSubmissionCreaterequiredKeywordsInputSchema: z.ZodType<Prisma.SocialSubmissionCreaterequiredKeywordsInput> = z.object({
  set: z.string().array()
}).strict();

export const SocialSubmissionCreatemissingKeywordsInputSchema: z.ZodType<Prisma.SocialSubmissionCreatemissingKeywordsInput> = z.object({
  set: z.string().array()
}).strict();

export const SocialSubmissionCreatematchedKeywordsInputSchema: z.ZodType<Prisma.SocialSubmissionCreatematchedKeywordsInput> = z.object({
  set: z.string().array()
}).strict();

export const EnumSocialPlatformFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumSocialPlatformFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => SocialPlatformSchema).optional()
}).strict();

export const EnumSocialSubmissionStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumSocialSubmissionStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => SocialSubmissionStatusSchema).optional()
}).strict();

export const SocialSubmissionUpdaterequiredKeywordsInputSchema: z.ZodType<Prisma.SocialSubmissionUpdaterequiredKeywordsInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const SocialSubmissionUpdatemissingKeywordsInputSchema: z.ZodType<Prisma.SocialSubmissionUpdatemissingKeywordsInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const SocialSubmissionUpdatematchedKeywordsInputSchema: z.ZodType<Prisma.SocialSubmissionUpdatematchedKeywordsInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumAccessTypeFilterSchema: z.ZodType<Prisma.NestedEnumAccessTypeFilter> = z.object({
  equals: z.lazy(() => AccessTypeSchema).optional(),
  in: z.lazy(() => AccessTypeSchema).array().optional(),
  notIn: z.lazy(() => AccessTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => AccessTypeSchema),z.lazy(() => NestedEnumAccessTypeFilterSchema) ]).optional(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedEnumAccessTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumAccessTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => AccessTypeSchema).optional(),
  in: z.lazy(() => AccessTypeSchema).array().optional(),
  notIn: z.lazy(() => AccessTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => AccessTypeSchema),z.lazy(() => NestedEnumAccessTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumAccessTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumAccessTypeFilterSchema).optional()
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedEnumSocialPlatformFilterSchema: z.ZodType<Prisma.NestedEnumSocialPlatformFilter> = z.object({
  equals: z.lazy(() => SocialPlatformSchema).optional(),
  in: z.lazy(() => SocialPlatformSchema).array().optional(),
  notIn: z.lazy(() => SocialPlatformSchema).array().optional(),
  not: z.union([ z.lazy(() => SocialPlatformSchema),z.lazy(() => NestedEnumSocialPlatformFilterSchema) ]).optional(),
}).strict();

export const NestedEnumSocialSubmissionStatusFilterSchema: z.ZodType<Prisma.NestedEnumSocialSubmissionStatusFilter> = z.object({
  equals: z.lazy(() => SocialSubmissionStatusSchema).optional(),
  in: z.lazy(() => SocialSubmissionStatusSchema).array().optional(),
  notIn: z.lazy(() => SocialSubmissionStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SocialSubmissionStatusSchema),z.lazy(() => NestedEnumSocialSubmissionStatusFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumSocialPlatformWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumSocialPlatformWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SocialPlatformSchema).optional(),
  in: z.lazy(() => SocialPlatformSchema).array().optional(),
  notIn: z.lazy(() => SocialPlatformSchema).array().optional(),
  not: z.union([ z.lazy(() => SocialPlatformSchema),z.lazy(() => NestedEnumSocialPlatformWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSocialPlatformFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSocialPlatformFilterSchema).optional()
}).strict();

export const NestedEnumSocialSubmissionStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumSocialSubmissionStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SocialSubmissionStatusSchema).optional(),
  in: z.lazy(() => SocialSubmissionStatusSchema).array().optional(),
  notIn: z.lazy(() => SocialSubmissionStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SocialSubmissionStatusSchema),z.lazy(() => NestedEnumSocialSubmissionStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSocialSubmissionStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSocialSubmissionStatusFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUploadFindFirstArgsSchema: z.ZodType<Prisma.UserUploadFindFirstArgs> = z.object({
  select: UserUploadSelectSchema.optional(),
  where: UserUploadWhereInputSchema.optional(),
  orderBy: z.union([ UserUploadOrderByWithRelationInputSchema.array(),UserUploadOrderByWithRelationInputSchema ]).optional(),
  cursor: UserUploadWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserUploadScalarFieldEnumSchema,UserUploadScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserUploadFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserUploadFindFirstOrThrowArgs> = z.object({
  select: UserUploadSelectSchema.optional(),
  where: UserUploadWhereInputSchema.optional(),
  orderBy: z.union([ UserUploadOrderByWithRelationInputSchema.array(),UserUploadOrderByWithRelationInputSchema ]).optional(),
  cursor: UserUploadWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserUploadScalarFieldEnumSchema,UserUploadScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserUploadFindManyArgsSchema: z.ZodType<Prisma.UserUploadFindManyArgs> = z.object({
  select: UserUploadSelectSchema.optional(),
  where: UserUploadWhereInputSchema.optional(),
  orderBy: z.union([ UserUploadOrderByWithRelationInputSchema.array(),UserUploadOrderByWithRelationInputSchema ]).optional(),
  cursor: UserUploadWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserUploadScalarFieldEnumSchema,UserUploadScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserUploadAggregateArgsSchema: z.ZodType<Prisma.UserUploadAggregateArgs> = z.object({
  where: UserUploadWhereInputSchema.optional(),
  orderBy: z.union([ UserUploadOrderByWithRelationInputSchema.array(),UserUploadOrderByWithRelationInputSchema ]).optional(),
  cursor: UserUploadWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserUploadGroupByArgsSchema: z.ZodType<Prisma.UserUploadGroupByArgs> = z.object({
  where: UserUploadWhereInputSchema.optional(),
  orderBy: z.union([ UserUploadOrderByWithAggregationInputSchema.array(),UserUploadOrderByWithAggregationInputSchema ]).optional(),
  by: UserUploadScalarFieldEnumSchema.array(),
  having: UserUploadScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserUploadFindUniqueArgsSchema: z.ZodType<Prisma.UserUploadFindUniqueArgs> = z.object({
  select: UserUploadSelectSchema.optional(),
  where: UserUploadWhereUniqueInputSchema,
}).strict() ;

export const UserUploadFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserUploadFindUniqueOrThrowArgs> = z.object({
  select: UserUploadSelectSchema.optional(),
  where: UserUploadWhereUniqueInputSchema,
}).strict() ;

export const BackgroundRemovedFindFirstArgsSchema: z.ZodType<Prisma.BackgroundRemovedFindFirstArgs> = z.object({
  select: BackgroundRemovedSelectSchema.optional(),
  where: BackgroundRemovedWhereInputSchema.optional(),
  orderBy: z.union([ BackgroundRemovedOrderByWithRelationInputSchema.array(),BackgroundRemovedOrderByWithRelationInputSchema ]).optional(),
  cursor: BackgroundRemovedWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BackgroundRemovedScalarFieldEnumSchema,BackgroundRemovedScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BackgroundRemovedFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BackgroundRemovedFindFirstOrThrowArgs> = z.object({
  select: BackgroundRemovedSelectSchema.optional(),
  where: BackgroundRemovedWhereInputSchema.optional(),
  orderBy: z.union([ BackgroundRemovedOrderByWithRelationInputSchema.array(),BackgroundRemovedOrderByWithRelationInputSchema ]).optional(),
  cursor: BackgroundRemovedWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BackgroundRemovedScalarFieldEnumSchema,BackgroundRemovedScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BackgroundRemovedFindManyArgsSchema: z.ZodType<Prisma.BackgroundRemovedFindManyArgs> = z.object({
  select: BackgroundRemovedSelectSchema.optional(),
  where: BackgroundRemovedWhereInputSchema.optional(),
  orderBy: z.union([ BackgroundRemovedOrderByWithRelationInputSchema.array(),BackgroundRemovedOrderByWithRelationInputSchema ]).optional(),
  cursor: BackgroundRemovedWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BackgroundRemovedScalarFieldEnumSchema,BackgroundRemovedScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BackgroundRemovedAggregateArgsSchema: z.ZodType<Prisma.BackgroundRemovedAggregateArgs> = z.object({
  where: BackgroundRemovedWhereInputSchema.optional(),
  orderBy: z.union([ BackgroundRemovedOrderByWithRelationInputSchema.array(),BackgroundRemovedOrderByWithRelationInputSchema ]).optional(),
  cursor: BackgroundRemovedWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BackgroundRemovedGroupByArgsSchema: z.ZodType<Prisma.BackgroundRemovedGroupByArgs> = z.object({
  where: BackgroundRemovedWhereInputSchema.optional(),
  orderBy: z.union([ BackgroundRemovedOrderByWithAggregationInputSchema.array(),BackgroundRemovedOrderByWithAggregationInputSchema ]).optional(),
  by: BackgroundRemovedScalarFieldEnumSchema.array(),
  having: BackgroundRemovedScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BackgroundRemovedFindUniqueArgsSchema: z.ZodType<Prisma.BackgroundRemovedFindUniqueArgs> = z.object({
  select: BackgroundRemovedSelectSchema.optional(),
  where: BackgroundRemovedWhereUniqueInputSchema,
}).strict() ;

export const BackgroundRemovedFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BackgroundRemovedFindUniqueOrThrowArgs> = z.object({
  select: BackgroundRemovedSelectSchema.optional(),
  where: BackgroundRemovedWhereUniqueInputSchema,
}).strict() ;

export const UserResultFindFirstArgsSchema: z.ZodType<Prisma.UserResultFindFirstArgs> = z.object({
  select: UserResultSelectSchema.optional(),
  where: UserResultWhereInputSchema.optional(),
  orderBy: z.union([ UserResultOrderByWithRelationInputSchema.array(),UserResultOrderByWithRelationInputSchema ]).optional(),
  cursor: UserResultWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserResultScalarFieldEnumSchema,UserResultScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserResultFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserResultFindFirstOrThrowArgs> = z.object({
  select: UserResultSelectSchema.optional(),
  where: UserResultWhereInputSchema.optional(),
  orderBy: z.union([ UserResultOrderByWithRelationInputSchema.array(),UserResultOrderByWithRelationInputSchema ]).optional(),
  cursor: UserResultWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserResultScalarFieldEnumSchema,UserResultScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserResultFindManyArgsSchema: z.ZodType<Prisma.UserResultFindManyArgs> = z.object({
  select: UserResultSelectSchema.optional(),
  where: UserResultWhereInputSchema.optional(),
  orderBy: z.union([ UserResultOrderByWithRelationInputSchema.array(),UserResultOrderByWithRelationInputSchema ]).optional(),
  cursor: UserResultWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserResultScalarFieldEnumSchema,UserResultScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserResultAggregateArgsSchema: z.ZodType<Prisma.UserResultAggregateArgs> = z.object({
  where: UserResultWhereInputSchema.optional(),
  orderBy: z.union([ UserResultOrderByWithRelationInputSchema.array(),UserResultOrderByWithRelationInputSchema ]).optional(),
  cursor: UserResultWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserResultGroupByArgsSchema: z.ZodType<Prisma.UserResultGroupByArgs> = z.object({
  where: UserResultWhereInputSchema.optional(),
  orderBy: z.union([ UserResultOrderByWithAggregationInputSchema.array(),UserResultOrderByWithAggregationInputSchema ]).optional(),
  by: UserResultScalarFieldEnumSchema.array(),
  having: UserResultScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserResultFindUniqueArgsSchema: z.ZodType<Prisma.UserResultFindUniqueArgs> = z.object({
  select: UserResultSelectSchema.optional(),
  where: UserResultWhereUniqueInputSchema,
}).strict() ;

export const UserResultFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserResultFindUniqueOrThrowArgs> = z.object({
  select: UserResultSelectSchema.optional(),
  where: UserResultWhereUniqueInputSchema,
}).strict() ;

export const SocialSubmissionFindFirstArgsSchema: z.ZodType<Prisma.SocialSubmissionFindFirstArgs> = z.object({
  select: SocialSubmissionSelectSchema.optional(),
  where: SocialSubmissionWhereInputSchema.optional(),
  orderBy: z.union([ SocialSubmissionOrderByWithRelationInputSchema.array(),SocialSubmissionOrderByWithRelationInputSchema ]).optional(),
  cursor: SocialSubmissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SocialSubmissionScalarFieldEnumSchema,SocialSubmissionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SocialSubmissionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SocialSubmissionFindFirstOrThrowArgs> = z.object({
  select: SocialSubmissionSelectSchema.optional(),
  where: SocialSubmissionWhereInputSchema.optional(),
  orderBy: z.union([ SocialSubmissionOrderByWithRelationInputSchema.array(),SocialSubmissionOrderByWithRelationInputSchema ]).optional(),
  cursor: SocialSubmissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SocialSubmissionScalarFieldEnumSchema,SocialSubmissionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SocialSubmissionFindManyArgsSchema: z.ZodType<Prisma.SocialSubmissionFindManyArgs> = z.object({
  select: SocialSubmissionSelectSchema.optional(),
  where: SocialSubmissionWhereInputSchema.optional(),
  orderBy: z.union([ SocialSubmissionOrderByWithRelationInputSchema.array(),SocialSubmissionOrderByWithRelationInputSchema ]).optional(),
  cursor: SocialSubmissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SocialSubmissionScalarFieldEnumSchema,SocialSubmissionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SocialSubmissionAggregateArgsSchema: z.ZodType<Prisma.SocialSubmissionAggregateArgs> = z.object({
  where: SocialSubmissionWhereInputSchema.optional(),
  orderBy: z.union([ SocialSubmissionOrderByWithRelationInputSchema.array(),SocialSubmissionOrderByWithRelationInputSchema ]).optional(),
  cursor: SocialSubmissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SocialSubmissionGroupByArgsSchema: z.ZodType<Prisma.SocialSubmissionGroupByArgs> = z.object({
  where: SocialSubmissionWhereInputSchema.optional(),
  orderBy: z.union([ SocialSubmissionOrderByWithAggregationInputSchema.array(),SocialSubmissionOrderByWithAggregationInputSchema ]).optional(),
  by: SocialSubmissionScalarFieldEnumSchema.array(),
  having: SocialSubmissionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SocialSubmissionFindUniqueArgsSchema: z.ZodType<Prisma.SocialSubmissionFindUniqueArgs> = z.object({
  select: SocialSubmissionSelectSchema.optional(),
  where: SocialSubmissionWhereUniqueInputSchema,
}).strict() ;

export const SocialSubmissionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SocialSubmissionFindUniqueOrThrowArgs> = z.object({
  select: SocialSubmissionSelectSchema.optional(),
  where: SocialSubmissionWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserUploadCreateArgsSchema: z.ZodType<Prisma.UserUploadCreateArgs> = z.object({
  select: UserUploadSelectSchema.optional(),
  data: z.union([ UserUploadCreateInputSchema,UserUploadUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUploadUpsertArgsSchema: z.ZodType<Prisma.UserUploadUpsertArgs> = z.object({
  select: UserUploadSelectSchema.optional(),
  where: UserUploadWhereUniqueInputSchema,
  create: z.union([ UserUploadCreateInputSchema,UserUploadUncheckedCreateInputSchema ]),
  update: z.union([ UserUploadUpdateInputSchema,UserUploadUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserUploadCreateManyArgsSchema: z.ZodType<Prisma.UserUploadCreateManyArgs> = z.object({
  data: z.union([ UserUploadCreateManyInputSchema,UserUploadCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserUploadCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUploadCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserUploadCreateManyInputSchema,UserUploadCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserUploadDeleteArgsSchema: z.ZodType<Prisma.UserUploadDeleteArgs> = z.object({
  select: UserUploadSelectSchema.optional(),
  where: UserUploadWhereUniqueInputSchema,
}).strict() ;

export const UserUploadUpdateArgsSchema: z.ZodType<Prisma.UserUploadUpdateArgs> = z.object({
  select: UserUploadSelectSchema.optional(),
  data: z.union([ UserUploadUpdateInputSchema,UserUploadUncheckedUpdateInputSchema ]),
  where: UserUploadWhereUniqueInputSchema,
}).strict() ;

export const UserUploadUpdateManyArgsSchema: z.ZodType<Prisma.UserUploadUpdateManyArgs> = z.object({
  data: z.union([ UserUploadUpdateManyMutationInputSchema,UserUploadUncheckedUpdateManyInputSchema ]),
  where: UserUploadWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserUploadUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUploadUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUploadUpdateManyMutationInputSchema,UserUploadUncheckedUpdateManyInputSchema ]),
  where: UserUploadWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserUploadDeleteManyArgsSchema: z.ZodType<Prisma.UserUploadDeleteManyArgs> = z.object({
  where: UserUploadWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const BackgroundRemovedCreateArgsSchema: z.ZodType<Prisma.BackgroundRemovedCreateArgs> = z.object({
  select: BackgroundRemovedSelectSchema.optional(),
  data: z.union([ BackgroundRemovedCreateInputSchema,BackgroundRemovedUncheckedCreateInputSchema ]),
}).strict() ;

export const BackgroundRemovedUpsertArgsSchema: z.ZodType<Prisma.BackgroundRemovedUpsertArgs> = z.object({
  select: BackgroundRemovedSelectSchema.optional(),
  where: BackgroundRemovedWhereUniqueInputSchema,
  create: z.union([ BackgroundRemovedCreateInputSchema,BackgroundRemovedUncheckedCreateInputSchema ]),
  update: z.union([ BackgroundRemovedUpdateInputSchema,BackgroundRemovedUncheckedUpdateInputSchema ]),
}).strict() ;

export const BackgroundRemovedCreateManyArgsSchema: z.ZodType<Prisma.BackgroundRemovedCreateManyArgs> = z.object({
  data: z.union([ BackgroundRemovedCreateManyInputSchema,BackgroundRemovedCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BackgroundRemovedCreateManyAndReturnArgsSchema: z.ZodType<Prisma.BackgroundRemovedCreateManyAndReturnArgs> = z.object({
  data: z.union([ BackgroundRemovedCreateManyInputSchema,BackgroundRemovedCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BackgroundRemovedDeleteArgsSchema: z.ZodType<Prisma.BackgroundRemovedDeleteArgs> = z.object({
  select: BackgroundRemovedSelectSchema.optional(),
  where: BackgroundRemovedWhereUniqueInputSchema,
}).strict() ;

export const BackgroundRemovedUpdateArgsSchema: z.ZodType<Prisma.BackgroundRemovedUpdateArgs> = z.object({
  select: BackgroundRemovedSelectSchema.optional(),
  data: z.union([ BackgroundRemovedUpdateInputSchema,BackgroundRemovedUncheckedUpdateInputSchema ]),
  where: BackgroundRemovedWhereUniqueInputSchema,
}).strict() ;

export const BackgroundRemovedUpdateManyArgsSchema: z.ZodType<Prisma.BackgroundRemovedUpdateManyArgs> = z.object({
  data: z.union([ BackgroundRemovedUpdateManyMutationInputSchema,BackgroundRemovedUncheckedUpdateManyInputSchema ]),
  where: BackgroundRemovedWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const BackgroundRemovedUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.BackgroundRemovedUpdateManyAndReturnArgs> = z.object({
  data: z.union([ BackgroundRemovedUpdateManyMutationInputSchema,BackgroundRemovedUncheckedUpdateManyInputSchema ]),
  where: BackgroundRemovedWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const BackgroundRemovedDeleteManyArgsSchema: z.ZodType<Prisma.BackgroundRemovedDeleteManyArgs> = z.object({
  where: BackgroundRemovedWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserResultCreateArgsSchema: z.ZodType<Prisma.UserResultCreateArgs> = z.object({
  select: UserResultSelectSchema.optional(),
  data: z.union([ UserResultCreateInputSchema,UserResultUncheckedCreateInputSchema ]),
}).strict() ;

export const UserResultUpsertArgsSchema: z.ZodType<Prisma.UserResultUpsertArgs> = z.object({
  select: UserResultSelectSchema.optional(),
  where: UserResultWhereUniqueInputSchema,
  create: z.union([ UserResultCreateInputSchema,UserResultUncheckedCreateInputSchema ]),
  update: z.union([ UserResultUpdateInputSchema,UserResultUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserResultCreateManyArgsSchema: z.ZodType<Prisma.UserResultCreateManyArgs> = z.object({
  data: z.union([ UserResultCreateManyInputSchema,UserResultCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserResultCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserResultCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserResultCreateManyInputSchema,UserResultCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserResultDeleteArgsSchema: z.ZodType<Prisma.UserResultDeleteArgs> = z.object({
  select: UserResultSelectSchema.optional(),
  where: UserResultWhereUniqueInputSchema,
}).strict() ;

export const UserResultUpdateArgsSchema: z.ZodType<Prisma.UserResultUpdateArgs> = z.object({
  select: UserResultSelectSchema.optional(),
  data: z.union([ UserResultUpdateInputSchema,UserResultUncheckedUpdateInputSchema ]),
  where: UserResultWhereUniqueInputSchema,
}).strict() ;

export const UserResultUpdateManyArgsSchema: z.ZodType<Prisma.UserResultUpdateManyArgs> = z.object({
  data: z.union([ UserResultUpdateManyMutationInputSchema,UserResultUncheckedUpdateManyInputSchema ]),
  where: UserResultWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserResultUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserResultUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserResultUpdateManyMutationInputSchema,UserResultUncheckedUpdateManyInputSchema ]),
  where: UserResultWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserResultDeleteManyArgsSchema: z.ZodType<Prisma.UserResultDeleteManyArgs> = z.object({
  where: UserResultWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SocialSubmissionCreateArgsSchema: z.ZodType<Prisma.SocialSubmissionCreateArgs> = z.object({
  select: SocialSubmissionSelectSchema.optional(),
  data: z.union([ SocialSubmissionCreateInputSchema,SocialSubmissionUncheckedCreateInputSchema ]),
}).strict() ;

export const SocialSubmissionUpsertArgsSchema: z.ZodType<Prisma.SocialSubmissionUpsertArgs> = z.object({
  select: SocialSubmissionSelectSchema.optional(),
  where: SocialSubmissionWhereUniqueInputSchema,
  create: z.union([ SocialSubmissionCreateInputSchema,SocialSubmissionUncheckedCreateInputSchema ]),
  update: z.union([ SocialSubmissionUpdateInputSchema,SocialSubmissionUncheckedUpdateInputSchema ]),
}).strict() ;

export const SocialSubmissionCreateManyArgsSchema: z.ZodType<Prisma.SocialSubmissionCreateManyArgs> = z.object({
  data: z.union([ SocialSubmissionCreateManyInputSchema,SocialSubmissionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SocialSubmissionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SocialSubmissionCreateManyAndReturnArgs> = z.object({
  data: z.union([ SocialSubmissionCreateManyInputSchema,SocialSubmissionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SocialSubmissionDeleteArgsSchema: z.ZodType<Prisma.SocialSubmissionDeleteArgs> = z.object({
  select: SocialSubmissionSelectSchema.optional(),
  where: SocialSubmissionWhereUniqueInputSchema,
}).strict() ;

export const SocialSubmissionUpdateArgsSchema: z.ZodType<Prisma.SocialSubmissionUpdateArgs> = z.object({
  select: SocialSubmissionSelectSchema.optional(),
  data: z.union([ SocialSubmissionUpdateInputSchema,SocialSubmissionUncheckedUpdateInputSchema ]),
  where: SocialSubmissionWhereUniqueInputSchema,
}).strict() ;

export const SocialSubmissionUpdateManyArgsSchema: z.ZodType<Prisma.SocialSubmissionUpdateManyArgs> = z.object({
  data: z.union([ SocialSubmissionUpdateManyMutationInputSchema,SocialSubmissionUncheckedUpdateManyInputSchema ]),
  where: SocialSubmissionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SocialSubmissionUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.SocialSubmissionUpdateManyAndReturnArgs> = z.object({
  data: z.union([ SocialSubmissionUpdateManyMutationInputSchema,SocialSubmissionUncheckedUpdateManyInputSchema ]),
  where: SocialSubmissionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SocialSubmissionDeleteManyArgsSchema: z.ZodType<Prisma.SocialSubmissionDeleteManyArgs> = z.object({
  where: SocialSubmissionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;