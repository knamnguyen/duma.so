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

export const ActivityScalarFieldEnumSchema = z.enum(['id','hostId','type','name','description','tags','dateTime','location','coverPhoto','imageUrls','maxParticipants','status','createdAt','updatedAt']);

export const ParticipantScalarFieldEnumSchema = z.enum(['id','userId','activityId','status','joinedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const NullsOrderSchema = z.enum(['first','last']);

export const AccessTypeSchema = z.enum(['FREE','WEEKLY','MONTHLY','YEARLY']);

export type AccessTypeType = `${z.infer<typeof AccessTypeSchema>}`

export const ActivityTypeSchema = z.enum(['WORKDATE','STUDYDATE','HANGOUT','SPORTS','EVENT','OTHER']);

export type ActivityTypeType = `${z.infer<typeof ActivityTypeSchema>}`

export const ActivityStatusSchema = z.enum(['OPEN','FULL','CANCELLED','COMPLETED']);

export type ActivityStatusType = `${z.infer<typeof ActivityStatusSchema>}`

export const ParticipantStatusSchema = z.enum(['PENDING','APPROVED','REJECTED']);

export type ParticipantStatusType = `${z.infer<typeof ParticipantStatusSchema>}`

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
  /**
   * @deprecated Legacy Gif Avatar feature - used by editor router
   */
  dailyAIcomments: z.number().int(),
  /**
   * @deprecated Legacy Gif Avatar feature - used by editor and social routers for credit system
   */
  creditConsumed: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER UPLOAD SCHEMA
/////////////////////////////////////////

/**
 * @deprecated Legacy Gif Avatar feature - used by editor router
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

/**
 * @deprecated Legacy Gif Avatar feature - used by editor router
 */
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

/**
 * @deprecated Legacy Gif Avatar feature - used by editor router
 */
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

/**
 * @deprecated Legacy Social Referral feature - used by social router
 */
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
// ACTIVITY SCHEMA
/////////////////////////////////////////

export const ActivitySchema = z.object({
  type: ActivityTypeSchema,
  status: ActivityStatusSchema,
  id: z.string().cuid(),
  hostId: z.string(),
  name: z.string(),
  description: z.string(),
  tags: z.string().array(),
  dateTime: z.coerce.date(),
  location: z.string(),
  coverPhoto: z.string(),
  imageUrls: z.string().array(),
  maxParticipants: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Activity = z.infer<typeof ActivitySchema>

/////////////////////////////////////////
// PARTICIPANT SCHEMA
/////////////////////////////////////////

export const ParticipantSchema = z.object({
  status: ParticipantStatusSchema,
  id: z.string().cuid(),
  userId: z.string(),
  activityId: z.string(),
  joinedAt: z.coerce.date(),
})

export type Participant = z.infer<typeof ParticipantSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  hostedActivities: z.union([z.boolean(),z.lazy(() => ActivityFindManyArgsSchema)]).optional(),
  participations: z.union([z.boolean(),z.lazy(() => ParticipantFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  hostedActivities: z.boolean().optional(),
  participations: z.boolean().optional(),
}).strict();

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
  hostedActivities: z.union([z.boolean(),z.lazy(() => ActivityFindManyArgsSchema)]).optional(),
  participations: z.union([z.boolean(),z.lazy(() => ParticipantFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
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

// ACTIVITY
//------------------------------------------------------

export const ActivityIncludeSchema: z.ZodType<Prisma.ActivityInclude> = z.object({
  host: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  participants: z.union([z.boolean(),z.lazy(() => ParticipantFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ActivityCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ActivityArgsSchema: z.ZodType<Prisma.ActivityDefaultArgs> = z.object({
  select: z.lazy(() => ActivitySelectSchema).optional(),
  include: z.lazy(() => ActivityIncludeSchema).optional(),
}).strict();

export const ActivityCountOutputTypeArgsSchema: z.ZodType<Prisma.ActivityCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ActivityCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ActivityCountOutputTypeSelectSchema: z.ZodType<Prisma.ActivityCountOutputTypeSelect> = z.object({
  participants: z.boolean().optional(),
}).strict();

export const ActivitySelectSchema: z.ZodType<Prisma.ActivitySelect> = z.object({
  id: z.boolean().optional(),
  hostId: z.boolean().optional(),
  type: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  tags: z.boolean().optional(),
  dateTime: z.boolean().optional(),
  location: z.boolean().optional(),
  coverPhoto: z.boolean().optional(),
  imageUrls: z.boolean().optional(),
  maxParticipants: z.boolean().optional(),
  status: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  host: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  participants: z.union([z.boolean(),z.lazy(() => ParticipantFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ActivityCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PARTICIPANT
//------------------------------------------------------

export const ParticipantIncludeSchema: z.ZodType<Prisma.ParticipantInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  activity: z.union([z.boolean(),z.lazy(() => ActivityArgsSchema)]).optional(),
}).strict()

export const ParticipantArgsSchema: z.ZodType<Prisma.ParticipantDefaultArgs> = z.object({
  select: z.lazy(() => ParticipantSelectSchema).optional(),
  include: z.lazy(() => ParticipantIncludeSchema).optional(),
}).strict();

export const ParticipantSelectSchema: z.ZodType<Prisma.ParticipantSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  activityId: z.boolean().optional(),
  status: z.boolean().optional(),
  joinedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  activity: z.union([z.boolean(),z.lazy(() => ActivityArgsSchema)]).optional(),
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
  hostedActivities: z.lazy(() => ActivityListRelationFilterSchema).optional(),
  participations: z.lazy(() => ParticipantListRelationFilterSchema).optional()
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
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  hostedActivities: z.lazy(() => ActivityOrderByRelationAggregateInputSchema).optional(),
  participations: z.lazy(() => ParticipantOrderByRelationAggregateInputSchema).optional()
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
  hostedActivities: z.lazy(() => ActivityListRelationFilterSchema).optional(),
  participations: z.lazy(() => ParticipantListRelationFilterSchema).optional()
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

export const ActivityWhereInputSchema: z.ZodType<Prisma.ActivityWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ActivityWhereInputSchema),z.lazy(() => ActivityWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivityWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivityWhereInputSchema),z.lazy(() => ActivityWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hostId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumActivityTypeFilterSchema),z.lazy(() => ActivityTypeSchema) ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  dateTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  location: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  coverPhoto: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  imageUrls: z.lazy(() => StringNullableListFilterSchema).optional(),
  maxParticipants: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  status: z.union([ z.lazy(() => EnumActivityStatusFilterSchema),z.lazy(() => ActivityStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  host: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  participants: z.lazy(() => ParticipantListRelationFilterSchema).optional()
}).strict();

export const ActivityOrderByWithRelationInputSchema: z.ZodType<Prisma.ActivityOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hostId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  dateTime: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  coverPhoto: z.lazy(() => SortOrderSchema).optional(),
  imageUrls: z.lazy(() => SortOrderSchema).optional(),
  maxParticipants: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  host: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  participants: z.lazy(() => ParticipantOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ActivityWhereUniqueInputSchema: z.ZodType<Prisma.ActivityWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => ActivityWhereInputSchema),z.lazy(() => ActivityWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivityWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivityWhereInputSchema),z.lazy(() => ActivityWhereInputSchema).array() ]).optional(),
  hostId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumActivityTypeFilterSchema),z.lazy(() => ActivityTypeSchema) ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  dateTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  location: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  coverPhoto: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  imageUrls: z.lazy(() => StringNullableListFilterSchema).optional(),
  maxParticipants: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  status: z.union([ z.lazy(() => EnumActivityStatusFilterSchema),z.lazy(() => ActivityStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  host: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  participants: z.lazy(() => ParticipantListRelationFilterSchema).optional()
}).strict());

export const ActivityOrderByWithAggregationInputSchema: z.ZodType<Prisma.ActivityOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hostId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  dateTime: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  coverPhoto: z.lazy(() => SortOrderSchema).optional(),
  imageUrls: z.lazy(() => SortOrderSchema).optional(),
  maxParticipants: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ActivityCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ActivityAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ActivityMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ActivityMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ActivitySumOrderByAggregateInputSchema).optional()
}).strict();

export const ActivityScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ActivityScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ActivityScalarWhereWithAggregatesInputSchema),z.lazy(() => ActivityScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivityScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivityScalarWhereWithAggregatesInputSchema),z.lazy(() => ActivityScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  hostId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumActivityTypeWithAggregatesFilterSchema),z.lazy(() => ActivityTypeSchema) ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  dateTime: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  location: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  coverPhoto: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  imageUrls: z.lazy(() => StringNullableListFilterSchema).optional(),
  maxParticipants: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  status: z.union([ z.lazy(() => EnumActivityStatusWithAggregatesFilterSchema),z.lazy(() => ActivityStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ParticipantWhereInputSchema: z.ZodType<Prisma.ParticipantWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ParticipantWhereInputSchema),z.lazy(() => ParticipantWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ParticipantWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ParticipantWhereInputSchema),z.lazy(() => ParticipantWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  activityId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumParticipantStatusFilterSchema),z.lazy(() => ParticipantStatusSchema) ]).optional(),
  joinedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  activity: z.union([ z.lazy(() => ActivityScalarRelationFilterSchema),z.lazy(() => ActivityWhereInputSchema) ]).optional(),
}).strict();

export const ParticipantOrderByWithRelationInputSchema: z.ZodType<Prisma.ParticipantOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  activityId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  joinedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  activity: z.lazy(() => ActivityOrderByWithRelationInputSchema).optional()
}).strict();

export const ParticipantWhereUniqueInputSchema: z.ZodType<Prisma.ParticipantWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    userId_activityId: z.lazy(() => ParticipantUserIdActivityIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    userId_activityId: z.lazy(() => ParticipantUserIdActivityIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  userId_activityId: z.lazy(() => ParticipantUserIdActivityIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ParticipantWhereInputSchema),z.lazy(() => ParticipantWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ParticipantWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ParticipantWhereInputSchema),z.lazy(() => ParticipantWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  activityId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumParticipantStatusFilterSchema),z.lazy(() => ParticipantStatusSchema) ]).optional(),
  joinedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  activity: z.union([ z.lazy(() => ActivityScalarRelationFilterSchema),z.lazy(() => ActivityWhereInputSchema) ]).optional(),
}).strict());

export const ParticipantOrderByWithAggregationInputSchema: z.ZodType<Prisma.ParticipantOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  activityId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  joinedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ParticipantCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ParticipantMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ParticipantMinOrderByAggregateInputSchema).optional()
}).strict();

export const ParticipantScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ParticipantScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ParticipantScalarWhereWithAggregatesInputSchema),z.lazy(() => ParticipantScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ParticipantScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ParticipantScalarWhereWithAggregatesInputSchema),z.lazy(() => ParticipantScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  activityId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumParticipantStatusWithAggregatesFilterSchema),z.lazy(() => ParticipantStatusSchema) ]).optional(),
  joinedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
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
  updatedAt: z.coerce.date().optional(),
  hostedActivities: z.lazy(() => ActivityCreateNestedManyWithoutHostInputSchema).optional(),
  participations: z.lazy(() => ParticipantCreateNestedManyWithoutUserInputSchema).optional()
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
  updatedAt: z.coerce.date().optional(),
  hostedActivities: z.lazy(() => ActivityUncheckedCreateNestedManyWithoutHostInputSchema).optional(),
  participations: z.lazy(() => ParticipantUncheckedCreateNestedManyWithoutUserInputSchema).optional()
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
  hostedActivities: z.lazy(() => ActivityUpdateManyWithoutHostNestedInputSchema).optional(),
  participations: z.lazy(() => ParticipantUpdateManyWithoutUserNestedInputSchema).optional()
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
  hostedActivities: z.lazy(() => ActivityUncheckedUpdateManyWithoutHostNestedInputSchema).optional(),
  participations: z.lazy(() => ParticipantUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
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

export const ActivityCreateInputSchema: z.ZodType<Prisma.ActivityCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => ActivityTypeSchema),
  name: z.string(),
  description: z.string(),
  tags: z.union([ z.lazy(() => ActivityCreatetagsInputSchema),z.string().array() ]).optional(),
  dateTime: z.coerce.date(),
  location: z.string(),
  coverPhoto: z.string(),
  imageUrls: z.union([ z.lazy(() => ActivityCreateimageUrlsInputSchema),z.string().array() ]).optional(),
  maxParticipants: z.number().int().optional(),
  status: z.lazy(() => ActivityStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  host: z.lazy(() => UserCreateNestedOneWithoutHostedActivitiesInputSchema),
  participants: z.lazy(() => ParticipantCreateNestedManyWithoutActivityInputSchema).optional()
}).strict();

export const ActivityUncheckedCreateInputSchema: z.ZodType<Prisma.ActivityUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  hostId: z.string(),
  type: z.lazy(() => ActivityTypeSchema),
  name: z.string(),
  description: z.string(),
  tags: z.union([ z.lazy(() => ActivityCreatetagsInputSchema),z.string().array() ]).optional(),
  dateTime: z.coerce.date(),
  location: z.string(),
  coverPhoto: z.string(),
  imageUrls: z.union([ z.lazy(() => ActivityCreateimageUrlsInputSchema),z.string().array() ]).optional(),
  maxParticipants: z.number().int().optional(),
  status: z.lazy(() => ActivityStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  participants: z.lazy(() => ParticipantUncheckedCreateNestedManyWithoutActivityInputSchema).optional()
}).strict();

export const ActivityUpdateInputSchema: z.ZodType<Prisma.ActivityUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => ActivityUpdatetagsInputSchema),z.string().array() ]).optional(),
  dateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverPhoto: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrls: z.union([ z.lazy(() => ActivityUpdateimageUrlsInputSchema),z.string().array() ]).optional(),
  maxParticipants: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ActivityStatusSchema),z.lazy(() => EnumActivityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  host: z.lazy(() => UserUpdateOneRequiredWithoutHostedActivitiesNestedInputSchema).optional(),
  participants: z.lazy(() => ParticipantUpdateManyWithoutActivityNestedInputSchema).optional()
}).strict();

export const ActivityUncheckedUpdateInputSchema: z.ZodType<Prisma.ActivityUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hostId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => ActivityUpdatetagsInputSchema),z.string().array() ]).optional(),
  dateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverPhoto: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrls: z.union([ z.lazy(() => ActivityUpdateimageUrlsInputSchema),z.string().array() ]).optional(),
  maxParticipants: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ActivityStatusSchema),z.lazy(() => EnumActivityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  participants: z.lazy(() => ParticipantUncheckedUpdateManyWithoutActivityNestedInputSchema).optional()
}).strict();

export const ActivityCreateManyInputSchema: z.ZodType<Prisma.ActivityCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  hostId: z.string(),
  type: z.lazy(() => ActivityTypeSchema),
  name: z.string(),
  description: z.string(),
  tags: z.union([ z.lazy(() => ActivityCreatetagsInputSchema),z.string().array() ]).optional(),
  dateTime: z.coerce.date(),
  location: z.string(),
  coverPhoto: z.string(),
  imageUrls: z.union([ z.lazy(() => ActivityCreateimageUrlsInputSchema),z.string().array() ]).optional(),
  maxParticipants: z.number().int().optional(),
  status: z.lazy(() => ActivityStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ActivityUpdateManyMutationInputSchema: z.ZodType<Prisma.ActivityUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => ActivityUpdatetagsInputSchema),z.string().array() ]).optional(),
  dateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverPhoto: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrls: z.union([ z.lazy(() => ActivityUpdateimageUrlsInputSchema),z.string().array() ]).optional(),
  maxParticipants: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ActivityStatusSchema),z.lazy(() => EnumActivityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ActivityUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ActivityUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hostId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => ActivityUpdatetagsInputSchema),z.string().array() ]).optional(),
  dateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverPhoto: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrls: z.union([ z.lazy(() => ActivityUpdateimageUrlsInputSchema),z.string().array() ]).optional(),
  maxParticipants: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ActivityStatusSchema),z.lazy(() => EnumActivityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ParticipantCreateInputSchema: z.ZodType<Prisma.ParticipantCreateInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => ParticipantStatusSchema).optional(),
  joinedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutParticipationsInputSchema),
  activity: z.lazy(() => ActivityCreateNestedOneWithoutParticipantsInputSchema)
}).strict();

export const ParticipantUncheckedCreateInputSchema: z.ZodType<Prisma.ParticipantUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  activityId: z.string(),
  status: z.lazy(() => ParticipantStatusSchema).optional(),
  joinedAt: z.coerce.date().optional()
}).strict();

export const ParticipantUpdateInputSchema: z.ZodType<Prisma.ParticipantUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ParticipantStatusSchema),z.lazy(() => EnumParticipantStatusFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutParticipationsNestedInputSchema).optional(),
  activity: z.lazy(() => ActivityUpdateOneRequiredWithoutParticipantsNestedInputSchema).optional()
}).strict();

export const ParticipantUncheckedUpdateInputSchema: z.ZodType<Prisma.ParticipantUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ParticipantStatusSchema),z.lazy(() => EnumParticipantStatusFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ParticipantCreateManyInputSchema: z.ZodType<Prisma.ParticipantCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  activityId: z.string(),
  status: z.lazy(() => ParticipantStatusSchema).optional(),
  joinedAt: z.coerce.date().optional()
}).strict();

export const ParticipantUpdateManyMutationInputSchema: z.ZodType<Prisma.ParticipantUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ParticipantStatusSchema),z.lazy(() => EnumParticipantStatusFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ParticipantUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ParticipantUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ParticipantStatusSchema),z.lazy(() => EnumParticipantStatusFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
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

export const ActivityListRelationFilterSchema: z.ZodType<Prisma.ActivityListRelationFilter> = z.object({
  every: z.lazy(() => ActivityWhereInputSchema).optional(),
  some: z.lazy(() => ActivityWhereInputSchema).optional(),
  none: z.lazy(() => ActivityWhereInputSchema).optional()
}).strict();

export const ParticipantListRelationFilterSchema: z.ZodType<Prisma.ParticipantListRelationFilter> = z.object({
  every: z.lazy(() => ParticipantWhereInputSchema).optional(),
  some: z.lazy(() => ParticipantWhereInputSchema).optional(),
  none: z.lazy(() => ParticipantWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const ActivityOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ActivityOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ParticipantOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ParticipantOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
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

export const EnumActivityTypeFilterSchema: z.ZodType<Prisma.EnumActivityTypeFilter> = z.object({
  equals: z.lazy(() => ActivityTypeSchema).optional(),
  in: z.lazy(() => ActivityTypeSchema).array().optional(),
  notIn: z.lazy(() => ActivityTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => NestedEnumActivityTypeFilterSchema) ]).optional(),
}).strict();

export const EnumActivityStatusFilterSchema: z.ZodType<Prisma.EnumActivityStatusFilter> = z.object({
  equals: z.lazy(() => ActivityStatusSchema).optional(),
  in: z.lazy(() => ActivityStatusSchema).array().optional(),
  notIn: z.lazy(() => ActivityStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivityStatusSchema),z.lazy(() => NestedEnumActivityStatusFilterSchema) ]).optional(),
}).strict();

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const ActivityCountOrderByAggregateInputSchema: z.ZodType<Prisma.ActivityCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hostId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  dateTime: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  coverPhoto: z.lazy(() => SortOrderSchema).optional(),
  imageUrls: z.lazy(() => SortOrderSchema).optional(),
  maxParticipants: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ActivityAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ActivityAvgOrderByAggregateInput> = z.object({
  maxParticipants: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ActivityMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ActivityMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hostId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  dateTime: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  coverPhoto: z.lazy(() => SortOrderSchema).optional(),
  maxParticipants: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ActivityMinOrderByAggregateInputSchema: z.ZodType<Prisma.ActivityMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hostId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  dateTime: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  coverPhoto: z.lazy(() => SortOrderSchema).optional(),
  maxParticipants: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ActivitySumOrderByAggregateInputSchema: z.ZodType<Prisma.ActivitySumOrderByAggregateInput> = z.object({
  maxParticipants: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumActivityTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumActivityTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ActivityTypeSchema).optional(),
  in: z.lazy(() => ActivityTypeSchema).array().optional(),
  notIn: z.lazy(() => ActivityTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => NestedEnumActivityTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumActivityTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumActivityTypeFilterSchema).optional()
}).strict();

export const EnumActivityStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumActivityStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ActivityStatusSchema).optional(),
  in: z.lazy(() => ActivityStatusSchema).array().optional(),
  notIn: z.lazy(() => ActivityStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivityStatusSchema),z.lazy(() => NestedEnumActivityStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumActivityStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumActivityStatusFilterSchema).optional()
}).strict();

export const EnumParticipantStatusFilterSchema: z.ZodType<Prisma.EnumParticipantStatusFilter> = z.object({
  equals: z.lazy(() => ParticipantStatusSchema).optional(),
  in: z.lazy(() => ParticipantStatusSchema).array().optional(),
  notIn: z.lazy(() => ParticipantStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ParticipantStatusSchema),z.lazy(() => NestedEnumParticipantStatusFilterSchema) ]).optional(),
}).strict();

export const ActivityScalarRelationFilterSchema: z.ZodType<Prisma.ActivityScalarRelationFilter> = z.object({
  is: z.lazy(() => ActivityWhereInputSchema).optional(),
  isNot: z.lazy(() => ActivityWhereInputSchema).optional()
}).strict();

export const ParticipantUserIdActivityIdCompoundUniqueInputSchema: z.ZodType<Prisma.ParticipantUserIdActivityIdCompoundUniqueInput> = z.object({
  userId: z.string(),
  activityId: z.string()
}).strict();

export const ParticipantCountOrderByAggregateInputSchema: z.ZodType<Prisma.ParticipantCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  activityId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  joinedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ParticipantMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ParticipantMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  activityId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  joinedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ParticipantMinOrderByAggregateInputSchema: z.ZodType<Prisma.ParticipantMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  activityId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  joinedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumParticipantStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumParticipantStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ParticipantStatusSchema).optional(),
  in: z.lazy(() => ParticipantStatusSchema).array().optional(),
  notIn: z.lazy(() => ParticipantStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ParticipantStatusSchema),z.lazy(() => NestedEnumParticipantStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumParticipantStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumParticipantStatusFilterSchema).optional()
}).strict();

export const ActivityCreateNestedManyWithoutHostInputSchema: z.ZodType<Prisma.ActivityCreateNestedManyWithoutHostInput> = z.object({
  create: z.union([ z.lazy(() => ActivityCreateWithoutHostInputSchema),z.lazy(() => ActivityCreateWithoutHostInputSchema).array(),z.lazy(() => ActivityUncheckedCreateWithoutHostInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutHostInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityCreateOrConnectWithoutHostInputSchema),z.lazy(() => ActivityCreateOrConnectWithoutHostInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityCreateManyHostInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ParticipantCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ParticipantCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ParticipantCreateWithoutUserInputSchema),z.lazy(() => ParticipantCreateWithoutUserInputSchema).array(),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParticipantCreateOrConnectWithoutUserInputSchema),z.lazy(() => ParticipantCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ParticipantCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ActivityUncheckedCreateNestedManyWithoutHostInputSchema: z.ZodType<Prisma.ActivityUncheckedCreateNestedManyWithoutHostInput> = z.object({
  create: z.union([ z.lazy(() => ActivityCreateWithoutHostInputSchema),z.lazy(() => ActivityCreateWithoutHostInputSchema).array(),z.lazy(() => ActivityUncheckedCreateWithoutHostInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutHostInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityCreateOrConnectWithoutHostInputSchema),z.lazy(() => ActivityCreateOrConnectWithoutHostInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityCreateManyHostInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ParticipantUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ParticipantUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ParticipantCreateWithoutUserInputSchema),z.lazy(() => ParticipantCreateWithoutUserInputSchema).array(),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParticipantCreateOrConnectWithoutUserInputSchema),z.lazy(() => ParticipantCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ParticipantCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
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

export const ActivityUpdateManyWithoutHostNestedInputSchema: z.ZodType<Prisma.ActivityUpdateManyWithoutHostNestedInput> = z.object({
  create: z.union([ z.lazy(() => ActivityCreateWithoutHostInputSchema),z.lazy(() => ActivityCreateWithoutHostInputSchema).array(),z.lazy(() => ActivityUncheckedCreateWithoutHostInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutHostInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityCreateOrConnectWithoutHostInputSchema),z.lazy(() => ActivityCreateOrConnectWithoutHostInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ActivityUpsertWithWhereUniqueWithoutHostInputSchema),z.lazy(() => ActivityUpsertWithWhereUniqueWithoutHostInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityCreateManyHostInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ActivityUpdateWithWhereUniqueWithoutHostInputSchema),z.lazy(() => ActivityUpdateWithWhereUniqueWithoutHostInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ActivityUpdateManyWithWhereWithoutHostInputSchema),z.lazy(() => ActivityUpdateManyWithWhereWithoutHostInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ActivityScalarWhereInputSchema),z.lazy(() => ActivityScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ParticipantUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ParticipantUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ParticipantCreateWithoutUserInputSchema),z.lazy(() => ParticipantCreateWithoutUserInputSchema).array(),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParticipantCreateOrConnectWithoutUserInputSchema),z.lazy(() => ParticipantCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ParticipantUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ParticipantUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ParticipantCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ParticipantUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ParticipantUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ParticipantUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ParticipantUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ParticipantScalarWhereInputSchema),z.lazy(() => ParticipantScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ActivityUncheckedUpdateManyWithoutHostNestedInputSchema: z.ZodType<Prisma.ActivityUncheckedUpdateManyWithoutHostNestedInput> = z.object({
  create: z.union([ z.lazy(() => ActivityCreateWithoutHostInputSchema),z.lazy(() => ActivityCreateWithoutHostInputSchema).array(),z.lazy(() => ActivityUncheckedCreateWithoutHostInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutHostInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityCreateOrConnectWithoutHostInputSchema),z.lazy(() => ActivityCreateOrConnectWithoutHostInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ActivityUpsertWithWhereUniqueWithoutHostInputSchema),z.lazy(() => ActivityUpsertWithWhereUniqueWithoutHostInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityCreateManyHostInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ActivityUpdateWithWhereUniqueWithoutHostInputSchema),z.lazy(() => ActivityUpdateWithWhereUniqueWithoutHostInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ActivityUpdateManyWithWhereWithoutHostInputSchema),z.lazy(() => ActivityUpdateManyWithWhereWithoutHostInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ActivityScalarWhereInputSchema),z.lazy(() => ActivityScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ParticipantUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ParticipantUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ParticipantCreateWithoutUserInputSchema),z.lazy(() => ParticipantCreateWithoutUserInputSchema).array(),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParticipantCreateOrConnectWithoutUserInputSchema),z.lazy(() => ParticipantCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ParticipantUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ParticipantUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ParticipantCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ParticipantUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ParticipantUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ParticipantUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ParticipantUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ParticipantScalarWhereInputSchema),z.lazy(() => ParticipantScalarWhereInputSchema).array() ]).optional(),
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

export const ActivityCreatetagsInputSchema: z.ZodType<Prisma.ActivityCreatetagsInput> = z.object({
  set: z.string().array()
}).strict();

export const ActivityCreateimageUrlsInputSchema: z.ZodType<Prisma.ActivityCreateimageUrlsInput> = z.object({
  set: z.string().array()
}).strict();

export const UserCreateNestedOneWithoutHostedActivitiesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutHostedActivitiesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutHostedActivitiesInputSchema),z.lazy(() => UserUncheckedCreateWithoutHostedActivitiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutHostedActivitiesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const ParticipantCreateNestedManyWithoutActivityInputSchema: z.ZodType<Prisma.ParticipantCreateNestedManyWithoutActivityInput> = z.object({
  create: z.union([ z.lazy(() => ParticipantCreateWithoutActivityInputSchema),z.lazy(() => ParticipantCreateWithoutActivityInputSchema).array(),z.lazy(() => ParticipantUncheckedCreateWithoutActivityInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutActivityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParticipantCreateOrConnectWithoutActivityInputSchema),z.lazy(() => ParticipantCreateOrConnectWithoutActivityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ParticipantCreateManyActivityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ParticipantUncheckedCreateNestedManyWithoutActivityInputSchema: z.ZodType<Prisma.ParticipantUncheckedCreateNestedManyWithoutActivityInput> = z.object({
  create: z.union([ z.lazy(() => ParticipantCreateWithoutActivityInputSchema),z.lazy(() => ParticipantCreateWithoutActivityInputSchema).array(),z.lazy(() => ParticipantUncheckedCreateWithoutActivityInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutActivityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParticipantCreateOrConnectWithoutActivityInputSchema),z.lazy(() => ParticipantCreateOrConnectWithoutActivityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ParticipantCreateManyActivityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumActivityTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumActivityTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ActivityTypeSchema).optional()
}).strict();

export const ActivityUpdatetagsInputSchema: z.ZodType<Prisma.ActivityUpdatetagsInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const ActivityUpdateimageUrlsInputSchema: z.ZodType<Prisma.ActivityUpdateimageUrlsInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const EnumActivityStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumActivityStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ActivityStatusSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutHostedActivitiesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutHostedActivitiesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutHostedActivitiesInputSchema),z.lazy(() => UserUncheckedCreateWithoutHostedActivitiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutHostedActivitiesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutHostedActivitiesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutHostedActivitiesInputSchema),z.lazy(() => UserUpdateWithoutHostedActivitiesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutHostedActivitiesInputSchema) ]).optional(),
}).strict();

export const ParticipantUpdateManyWithoutActivityNestedInputSchema: z.ZodType<Prisma.ParticipantUpdateManyWithoutActivityNestedInput> = z.object({
  create: z.union([ z.lazy(() => ParticipantCreateWithoutActivityInputSchema),z.lazy(() => ParticipantCreateWithoutActivityInputSchema).array(),z.lazy(() => ParticipantUncheckedCreateWithoutActivityInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutActivityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParticipantCreateOrConnectWithoutActivityInputSchema),z.lazy(() => ParticipantCreateOrConnectWithoutActivityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ParticipantUpsertWithWhereUniqueWithoutActivityInputSchema),z.lazy(() => ParticipantUpsertWithWhereUniqueWithoutActivityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ParticipantCreateManyActivityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ParticipantUpdateWithWhereUniqueWithoutActivityInputSchema),z.lazy(() => ParticipantUpdateWithWhereUniqueWithoutActivityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ParticipantUpdateManyWithWhereWithoutActivityInputSchema),z.lazy(() => ParticipantUpdateManyWithWhereWithoutActivityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ParticipantScalarWhereInputSchema),z.lazy(() => ParticipantScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ParticipantUncheckedUpdateManyWithoutActivityNestedInputSchema: z.ZodType<Prisma.ParticipantUncheckedUpdateManyWithoutActivityNestedInput> = z.object({
  create: z.union([ z.lazy(() => ParticipantCreateWithoutActivityInputSchema),z.lazy(() => ParticipantCreateWithoutActivityInputSchema).array(),z.lazy(() => ParticipantUncheckedCreateWithoutActivityInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutActivityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParticipantCreateOrConnectWithoutActivityInputSchema),z.lazy(() => ParticipantCreateOrConnectWithoutActivityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ParticipantUpsertWithWhereUniqueWithoutActivityInputSchema),z.lazy(() => ParticipantUpsertWithWhereUniqueWithoutActivityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ParticipantCreateManyActivityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ParticipantUpdateWithWhereUniqueWithoutActivityInputSchema),z.lazy(() => ParticipantUpdateWithWhereUniqueWithoutActivityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ParticipantUpdateManyWithWhereWithoutActivityInputSchema),z.lazy(() => ParticipantUpdateManyWithWhereWithoutActivityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ParticipantScalarWhereInputSchema),z.lazy(() => ParticipantScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutParticipationsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutParticipationsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutParticipationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutParticipationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutParticipationsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const ActivityCreateNestedOneWithoutParticipantsInputSchema: z.ZodType<Prisma.ActivityCreateNestedOneWithoutParticipantsInput> = z.object({
  create: z.union([ z.lazy(() => ActivityCreateWithoutParticipantsInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutParticipantsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ActivityCreateOrConnectWithoutParticipantsInputSchema).optional(),
  connect: z.lazy(() => ActivityWhereUniqueInputSchema).optional()
}).strict();

export const EnumParticipantStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumParticipantStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ParticipantStatusSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutParticipationsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutParticipationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutParticipationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutParticipationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutParticipationsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutParticipationsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutParticipationsInputSchema),z.lazy(() => UserUpdateWithoutParticipationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutParticipationsInputSchema) ]).optional(),
}).strict();

export const ActivityUpdateOneRequiredWithoutParticipantsNestedInputSchema: z.ZodType<Prisma.ActivityUpdateOneRequiredWithoutParticipantsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ActivityCreateWithoutParticipantsInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutParticipantsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ActivityCreateOrConnectWithoutParticipantsInputSchema).optional(),
  upsert: z.lazy(() => ActivityUpsertWithoutParticipantsInputSchema).optional(),
  connect: z.lazy(() => ActivityWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ActivityUpdateToOneWithWhereWithoutParticipantsInputSchema),z.lazy(() => ActivityUpdateWithoutParticipantsInputSchema),z.lazy(() => ActivityUncheckedUpdateWithoutParticipantsInputSchema) ]).optional(),
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

export const NestedEnumActivityTypeFilterSchema: z.ZodType<Prisma.NestedEnumActivityTypeFilter> = z.object({
  equals: z.lazy(() => ActivityTypeSchema).optional(),
  in: z.lazy(() => ActivityTypeSchema).array().optional(),
  notIn: z.lazy(() => ActivityTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => NestedEnumActivityTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumActivityStatusFilterSchema: z.ZodType<Prisma.NestedEnumActivityStatusFilter> = z.object({
  equals: z.lazy(() => ActivityStatusSchema).optional(),
  in: z.lazy(() => ActivityStatusSchema).array().optional(),
  notIn: z.lazy(() => ActivityStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivityStatusSchema),z.lazy(() => NestedEnumActivityStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumActivityTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumActivityTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ActivityTypeSchema).optional(),
  in: z.lazy(() => ActivityTypeSchema).array().optional(),
  notIn: z.lazy(() => ActivityTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => NestedEnumActivityTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumActivityTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumActivityTypeFilterSchema).optional()
}).strict();

export const NestedEnumActivityStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumActivityStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ActivityStatusSchema).optional(),
  in: z.lazy(() => ActivityStatusSchema).array().optional(),
  notIn: z.lazy(() => ActivityStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivityStatusSchema),z.lazy(() => NestedEnumActivityStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumActivityStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumActivityStatusFilterSchema).optional()
}).strict();

export const NestedEnumParticipantStatusFilterSchema: z.ZodType<Prisma.NestedEnumParticipantStatusFilter> = z.object({
  equals: z.lazy(() => ParticipantStatusSchema).optional(),
  in: z.lazy(() => ParticipantStatusSchema).array().optional(),
  notIn: z.lazy(() => ParticipantStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ParticipantStatusSchema),z.lazy(() => NestedEnumParticipantStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumParticipantStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumParticipantStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ParticipantStatusSchema).optional(),
  in: z.lazy(() => ParticipantStatusSchema).array().optional(),
  notIn: z.lazy(() => ParticipantStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ParticipantStatusSchema),z.lazy(() => NestedEnumParticipantStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumParticipantStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumParticipantStatusFilterSchema).optional()
}).strict();

export const ActivityCreateWithoutHostInputSchema: z.ZodType<Prisma.ActivityCreateWithoutHostInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => ActivityTypeSchema),
  name: z.string(),
  description: z.string(),
  tags: z.union([ z.lazy(() => ActivityCreatetagsInputSchema),z.string().array() ]).optional(),
  dateTime: z.coerce.date(),
  location: z.string(),
  coverPhoto: z.string(),
  imageUrls: z.union([ z.lazy(() => ActivityCreateimageUrlsInputSchema),z.string().array() ]).optional(),
  maxParticipants: z.number().int().optional(),
  status: z.lazy(() => ActivityStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  participants: z.lazy(() => ParticipantCreateNestedManyWithoutActivityInputSchema).optional()
}).strict();

export const ActivityUncheckedCreateWithoutHostInputSchema: z.ZodType<Prisma.ActivityUncheckedCreateWithoutHostInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => ActivityTypeSchema),
  name: z.string(),
  description: z.string(),
  tags: z.union([ z.lazy(() => ActivityCreatetagsInputSchema),z.string().array() ]).optional(),
  dateTime: z.coerce.date(),
  location: z.string(),
  coverPhoto: z.string(),
  imageUrls: z.union([ z.lazy(() => ActivityCreateimageUrlsInputSchema),z.string().array() ]).optional(),
  maxParticipants: z.number().int().optional(),
  status: z.lazy(() => ActivityStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  participants: z.lazy(() => ParticipantUncheckedCreateNestedManyWithoutActivityInputSchema).optional()
}).strict();

export const ActivityCreateOrConnectWithoutHostInputSchema: z.ZodType<Prisma.ActivityCreateOrConnectWithoutHostInput> = z.object({
  where: z.lazy(() => ActivityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ActivityCreateWithoutHostInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutHostInputSchema) ]),
}).strict();

export const ActivityCreateManyHostInputEnvelopeSchema: z.ZodType<Prisma.ActivityCreateManyHostInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ActivityCreateManyHostInputSchema),z.lazy(() => ActivityCreateManyHostInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ParticipantCreateWithoutUserInputSchema: z.ZodType<Prisma.ParticipantCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => ParticipantStatusSchema).optional(),
  joinedAt: z.coerce.date().optional(),
  activity: z.lazy(() => ActivityCreateNestedOneWithoutParticipantsInputSchema)
}).strict();

export const ParticipantUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ParticipantUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  activityId: z.string(),
  status: z.lazy(() => ParticipantStatusSchema).optional(),
  joinedAt: z.coerce.date().optional()
}).strict();

export const ParticipantCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ParticipantCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ParticipantWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ParticipantCreateWithoutUserInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ParticipantCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ParticipantCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ParticipantCreateManyUserInputSchema),z.lazy(() => ParticipantCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ActivityUpsertWithWhereUniqueWithoutHostInputSchema: z.ZodType<Prisma.ActivityUpsertWithWhereUniqueWithoutHostInput> = z.object({
  where: z.lazy(() => ActivityWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ActivityUpdateWithoutHostInputSchema),z.lazy(() => ActivityUncheckedUpdateWithoutHostInputSchema) ]),
  create: z.union([ z.lazy(() => ActivityCreateWithoutHostInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutHostInputSchema) ]),
}).strict();

export const ActivityUpdateWithWhereUniqueWithoutHostInputSchema: z.ZodType<Prisma.ActivityUpdateWithWhereUniqueWithoutHostInput> = z.object({
  where: z.lazy(() => ActivityWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ActivityUpdateWithoutHostInputSchema),z.lazy(() => ActivityUncheckedUpdateWithoutHostInputSchema) ]),
}).strict();

export const ActivityUpdateManyWithWhereWithoutHostInputSchema: z.ZodType<Prisma.ActivityUpdateManyWithWhereWithoutHostInput> = z.object({
  where: z.lazy(() => ActivityScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ActivityUpdateManyMutationInputSchema),z.lazy(() => ActivityUncheckedUpdateManyWithoutHostInputSchema) ]),
}).strict();

export const ActivityScalarWhereInputSchema: z.ZodType<Prisma.ActivityScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ActivityScalarWhereInputSchema),z.lazy(() => ActivityScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivityScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivityScalarWhereInputSchema),z.lazy(() => ActivityScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hostId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumActivityTypeFilterSchema),z.lazy(() => ActivityTypeSchema) ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  dateTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  location: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  coverPhoto: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  imageUrls: z.lazy(() => StringNullableListFilterSchema).optional(),
  maxParticipants: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  status: z.union([ z.lazy(() => EnumActivityStatusFilterSchema),z.lazy(() => ActivityStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ParticipantUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ParticipantUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ParticipantWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ParticipantUpdateWithoutUserInputSchema),z.lazy(() => ParticipantUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ParticipantCreateWithoutUserInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ParticipantUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ParticipantUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ParticipantWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ParticipantUpdateWithoutUserInputSchema),z.lazy(() => ParticipantUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ParticipantUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ParticipantUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ParticipantScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ParticipantUpdateManyMutationInputSchema),z.lazy(() => ParticipantUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ParticipantScalarWhereInputSchema: z.ZodType<Prisma.ParticipantScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ParticipantScalarWhereInputSchema),z.lazy(() => ParticipantScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ParticipantScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ParticipantScalarWhereInputSchema),z.lazy(() => ParticipantScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  activityId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumParticipantStatusFilterSchema),z.lazy(() => ParticipantStatusSchema) ]).optional(),
  joinedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutHostedActivitiesInputSchema: z.ZodType<Prisma.UserCreateWithoutHostedActivitiesInput> = z.object({
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
  updatedAt: z.coerce.date().optional(),
  participations: z.lazy(() => ParticipantCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutHostedActivitiesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutHostedActivitiesInput> = z.object({
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
  updatedAt: z.coerce.date().optional(),
  participations: z.lazy(() => ParticipantUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutHostedActivitiesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutHostedActivitiesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutHostedActivitiesInputSchema),z.lazy(() => UserUncheckedCreateWithoutHostedActivitiesInputSchema) ]),
}).strict();

export const ParticipantCreateWithoutActivityInputSchema: z.ZodType<Prisma.ParticipantCreateWithoutActivityInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => ParticipantStatusSchema).optional(),
  joinedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutParticipationsInputSchema)
}).strict();

export const ParticipantUncheckedCreateWithoutActivityInputSchema: z.ZodType<Prisma.ParticipantUncheckedCreateWithoutActivityInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  status: z.lazy(() => ParticipantStatusSchema).optional(),
  joinedAt: z.coerce.date().optional()
}).strict();

export const ParticipantCreateOrConnectWithoutActivityInputSchema: z.ZodType<Prisma.ParticipantCreateOrConnectWithoutActivityInput> = z.object({
  where: z.lazy(() => ParticipantWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ParticipantCreateWithoutActivityInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutActivityInputSchema) ]),
}).strict();

export const ParticipantCreateManyActivityInputEnvelopeSchema: z.ZodType<Prisma.ParticipantCreateManyActivityInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ParticipantCreateManyActivityInputSchema),z.lazy(() => ParticipantCreateManyActivityInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutHostedActivitiesInputSchema: z.ZodType<Prisma.UserUpsertWithoutHostedActivitiesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutHostedActivitiesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutHostedActivitiesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutHostedActivitiesInputSchema),z.lazy(() => UserUncheckedCreateWithoutHostedActivitiesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutHostedActivitiesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutHostedActivitiesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutHostedActivitiesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutHostedActivitiesInputSchema) ]),
}).strict();

export const UserUpdateWithoutHostedActivitiesInputSchema: z.ZodType<Prisma.UserUpdateWithoutHostedActivitiesInput> = z.object({
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
  participations: z.lazy(() => ParticipantUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutHostedActivitiesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutHostedActivitiesInput> = z.object({
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
  participations: z.lazy(() => ParticipantUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const ParticipantUpsertWithWhereUniqueWithoutActivityInputSchema: z.ZodType<Prisma.ParticipantUpsertWithWhereUniqueWithoutActivityInput> = z.object({
  where: z.lazy(() => ParticipantWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ParticipantUpdateWithoutActivityInputSchema),z.lazy(() => ParticipantUncheckedUpdateWithoutActivityInputSchema) ]),
  create: z.union([ z.lazy(() => ParticipantCreateWithoutActivityInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutActivityInputSchema) ]),
}).strict();

export const ParticipantUpdateWithWhereUniqueWithoutActivityInputSchema: z.ZodType<Prisma.ParticipantUpdateWithWhereUniqueWithoutActivityInput> = z.object({
  where: z.lazy(() => ParticipantWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ParticipantUpdateWithoutActivityInputSchema),z.lazy(() => ParticipantUncheckedUpdateWithoutActivityInputSchema) ]),
}).strict();

export const ParticipantUpdateManyWithWhereWithoutActivityInputSchema: z.ZodType<Prisma.ParticipantUpdateManyWithWhereWithoutActivityInput> = z.object({
  where: z.lazy(() => ParticipantScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ParticipantUpdateManyMutationInputSchema),z.lazy(() => ParticipantUncheckedUpdateManyWithoutActivityInputSchema) ]),
}).strict();

export const UserCreateWithoutParticipationsInputSchema: z.ZodType<Prisma.UserCreateWithoutParticipationsInput> = z.object({
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
  updatedAt: z.coerce.date().optional(),
  hostedActivities: z.lazy(() => ActivityCreateNestedManyWithoutHostInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutParticipationsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutParticipationsInput> = z.object({
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
  updatedAt: z.coerce.date().optional(),
  hostedActivities: z.lazy(() => ActivityUncheckedCreateNestedManyWithoutHostInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutParticipationsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutParticipationsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutParticipationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutParticipationsInputSchema) ]),
}).strict();

export const ActivityCreateWithoutParticipantsInputSchema: z.ZodType<Prisma.ActivityCreateWithoutParticipantsInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => ActivityTypeSchema),
  name: z.string(),
  description: z.string(),
  tags: z.union([ z.lazy(() => ActivityCreatetagsInputSchema),z.string().array() ]).optional(),
  dateTime: z.coerce.date(),
  location: z.string(),
  coverPhoto: z.string(),
  imageUrls: z.union([ z.lazy(() => ActivityCreateimageUrlsInputSchema),z.string().array() ]).optional(),
  maxParticipants: z.number().int().optional(),
  status: z.lazy(() => ActivityStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  host: z.lazy(() => UserCreateNestedOneWithoutHostedActivitiesInputSchema)
}).strict();

export const ActivityUncheckedCreateWithoutParticipantsInputSchema: z.ZodType<Prisma.ActivityUncheckedCreateWithoutParticipantsInput> = z.object({
  id: z.string().cuid().optional(),
  hostId: z.string(),
  type: z.lazy(() => ActivityTypeSchema),
  name: z.string(),
  description: z.string(),
  tags: z.union([ z.lazy(() => ActivityCreatetagsInputSchema),z.string().array() ]).optional(),
  dateTime: z.coerce.date(),
  location: z.string(),
  coverPhoto: z.string(),
  imageUrls: z.union([ z.lazy(() => ActivityCreateimageUrlsInputSchema),z.string().array() ]).optional(),
  maxParticipants: z.number().int().optional(),
  status: z.lazy(() => ActivityStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ActivityCreateOrConnectWithoutParticipantsInputSchema: z.ZodType<Prisma.ActivityCreateOrConnectWithoutParticipantsInput> = z.object({
  where: z.lazy(() => ActivityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ActivityCreateWithoutParticipantsInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutParticipantsInputSchema) ]),
}).strict();

export const UserUpsertWithoutParticipationsInputSchema: z.ZodType<Prisma.UserUpsertWithoutParticipationsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutParticipationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutParticipationsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutParticipationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutParticipationsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutParticipationsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutParticipationsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutParticipationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutParticipationsInputSchema) ]),
}).strict();

export const UserUpdateWithoutParticipationsInputSchema: z.ZodType<Prisma.UserUpdateWithoutParticipationsInput> = z.object({
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
  hostedActivities: z.lazy(() => ActivityUpdateManyWithoutHostNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutParticipationsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutParticipationsInput> = z.object({
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
  hostedActivities: z.lazy(() => ActivityUncheckedUpdateManyWithoutHostNestedInputSchema).optional()
}).strict();

export const ActivityUpsertWithoutParticipantsInputSchema: z.ZodType<Prisma.ActivityUpsertWithoutParticipantsInput> = z.object({
  update: z.union([ z.lazy(() => ActivityUpdateWithoutParticipantsInputSchema),z.lazy(() => ActivityUncheckedUpdateWithoutParticipantsInputSchema) ]),
  create: z.union([ z.lazy(() => ActivityCreateWithoutParticipantsInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutParticipantsInputSchema) ]),
  where: z.lazy(() => ActivityWhereInputSchema).optional()
}).strict();

export const ActivityUpdateToOneWithWhereWithoutParticipantsInputSchema: z.ZodType<Prisma.ActivityUpdateToOneWithWhereWithoutParticipantsInput> = z.object({
  where: z.lazy(() => ActivityWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ActivityUpdateWithoutParticipantsInputSchema),z.lazy(() => ActivityUncheckedUpdateWithoutParticipantsInputSchema) ]),
}).strict();

export const ActivityUpdateWithoutParticipantsInputSchema: z.ZodType<Prisma.ActivityUpdateWithoutParticipantsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => ActivityUpdatetagsInputSchema),z.string().array() ]).optional(),
  dateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverPhoto: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrls: z.union([ z.lazy(() => ActivityUpdateimageUrlsInputSchema),z.string().array() ]).optional(),
  maxParticipants: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ActivityStatusSchema),z.lazy(() => EnumActivityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  host: z.lazy(() => UserUpdateOneRequiredWithoutHostedActivitiesNestedInputSchema).optional()
}).strict();

export const ActivityUncheckedUpdateWithoutParticipantsInputSchema: z.ZodType<Prisma.ActivityUncheckedUpdateWithoutParticipantsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hostId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => ActivityUpdatetagsInputSchema),z.string().array() ]).optional(),
  dateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverPhoto: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrls: z.union([ z.lazy(() => ActivityUpdateimageUrlsInputSchema),z.string().array() ]).optional(),
  maxParticipants: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ActivityStatusSchema),z.lazy(() => EnumActivityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ActivityCreateManyHostInputSchema: z.ZodType<Prisma.ActivityCreateManyHostInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => ActivityTypeSchema),
  name: z.string(),
  description: z.string(),
  tags: z.union([ z.lazy(() => ActivityCreatetagsInputSchema),z.string().array() ]).optional(),
  dateTime: z.coerce.date(),
  location: z.string(),
  coverPhoto: z.string(),
  imageUrls: z.union([ z.lazy(() => ActivityCreateimageUrlsInputSchema),z.string().array() ]).optional(),
  maxParticipants: z.number().int().optional(),
  status: z.lazy(() => ActivityStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ParticipantCreateManyUserInputSchema: z.ZodType<Prisma.ParticipantCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  activityId: z.string(),
  status: z.lazy(() => ParticipantStatusSchema).optional(),
  joinedAt: z.coerce.date().optional()
}).strict();

export const ActivityUpdateWithoutHostInputSchema: z.ZodType<Prisma.ActivityUpdateWithoutHostInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => ActivityUpdatetagsInputSchema),z.string().array() ]).optional(),
  dateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverPhoto: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrls: z.union([ z.lazy(() => ActivityUpdateimageUrlsInputSchema),z.string().array() ]).optional(),
  maxParticipants: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ActivityStatusSchema),z.lazy(() => EnumActivityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  participants: z.lazy(() => ParticipantUpdateManyWithoutActivityNestedInputSchema).optional()
}).strict();

export const ActivityUncheckedUpdateWithoutHostInputSchema: z.ZodType<Prisma.ActivityUncheckedUpdateWithoutHostInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => ActivityUpdatetagsInputSchema),z.string().array() ]).optional(),
  dateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverPhoto: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrls: z.union([ z.lazy(() => ActivityUpdateimageUrlsInputSchema),z.string().array() ]).optional(),
  maxParticipants: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ActivityStatusSchema),z.lazy(() => EnumActivityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  participants: z.lazy(() => ParticipantUncheckedUpdateManyWithoutActivityNestedInputSchema).optional()
}).strict();

export const ActivityUncheckedUpdateManyWithoutHostInputSchema: z.ZodType<Prisma.ActivityUncheckedUpdateManyWithoutHostInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => ActivityUpdatetagsInputSchema),z.string().array() ]).optional(),
  dateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverPhoto: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrls: z.union([ z.lazy(() => ActivityUpdateimageUrlsInputSchema),z.string().array() ]).optional(),
  maxParticipants: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ActivityStatusSchema),z.lazy(() => EnumActivityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ParticipantUpdateWithoutUserInputSchema: z.ZodType<Prisma.ParticipantUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ParticipantStatusSchema),z.lazy(() => EnumParticipantStatusFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activity: z.lazy(() => ActivityUpdateOneRequiredWithoutParticipantsNestedInputSchema).optional()
}).strict();

export const ParticipantUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ParticipantUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ParticipantStatusSchema),z.lazy(() => EnumParticipantStatusFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ParticipantUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ParticipantUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ParticipantStatusSchema),z.lazy(() => EnumParticipantStatusFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ParticipantCreateManyActivityInputSchema: z.ZodType<Prisma.ParticipantCreateManyActivityInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  status: z.lazy(() => ParticipantStatusSchema).optional(),
  joinedAt: z.coerce.date().optional()
}).strict();

export const ParticipantUpdateWithoutActivityInputSchema: z.ZodType<Prisma.ParticipantUpdateWithoutActivityInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ParticipantStatusSchema),z.lazy(() => EnumParticipantStatusFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutParticipationsNestedInputSchema).optional()
}).strict();

export const ParticipantUncheckedUpdateWithoutActivityInputSchema: z.ZodType<Prisma.ParticipantUncheckedUpdateWithoutActivityInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ParticipantStatusSchema),z.lazy(() => EnumParticipantStatusFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ParticipantUncheckedUpdateManyWithoutActivityInputSchema: z.ZodType<Prisma.ParticipantUncheckedUpdateManyWithoutActivityInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ParticipantStatusSchema),z.lazy(() => EnumParticipantStatusFieldUpdateOperationsInputSchema) ]).optional(),
  joinedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
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
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
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

export const ActivityFindFirstArgsSchema: z.ZodType<Prisma.ActivityFindFirstArgs> = z.object({
  select: ActivitySelectSchema.optional(),
  include: ActivityIncludeSchema.optional(),
  where: ActivityWhereInputSchema.optional(),
  orderBy: z.union([ ActivityOrderByWithRelationInputSchema.array(),ActivityOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ActivityScalarFieldEnumSchema,ActivityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ActivityFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ActivityFindFirstOrThrowArgs> = z.object({
  select: ActivitySelectSchema.optional(),
  include: ActivityIncludeSchema.optional(),
  where: ActivityWhereInputSchema.optional(),
  orderBy: z.union([ ActivityOrderByWithRelationInputSchema.array(),ActivityOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ActivityScalarFieldEnumSchema,ActivityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ActivityFindManyArgsSchema: z.ZodType<Prisma.ActivityFindManyArgs> = z.object({
  select: ActivitySelectSchema.optional(),
  include: ActivityIncludeSchema.optional(),
  where: ActivityWhereInputSchema.optional(),
  orderBy: z.union([ ActivityOrderByWithRelationInputSchema.array(),ActivityOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ActivityScalarFieldEnumSchema,ActivityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ActivityAggregateArgsSchema: z.ZodType<Prisma.ActivityAggregateArgs> = z.object({
  where: ActivityWhereInputSchema.optional(),
  orderBy: z.union([ ActivityOrderByWithRelationInputSchema.array(),ActivityOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ActivityGroupByArgsSchema: z.ZodType<Prisma.ActivityGroupByArgs> = z.object({
  where: ActivityWhereInputSchema.optional(),
  orderBy: z.union([ ActivityOrderByWithAggregationInputSchema.array(),ActivityOrderByWithAggregationInputSchema ]).optional(),
  by: ActivityScalarFieldEnumSchema.array(),
  having: ActivityScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ActivityFindUniqueArgsSchema: z.ZodType<Prisma.ActivityFindUniqueArgs> = z.object({
  select: ActivitySelectSchema.optional(),
  include: ActivityIncludeSchema.optional(),
  where: ActivityWhereUniqueInputSchema,
}).strict() ;

export const ActivityFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ActivityFindUniqueOrThrowArgs> = z.object({
  select: ActivitySelectSchema.optional(),
  include: ActivityIncludeSchema.optional(),
  where: ActivityWhereUniqueInputSchema,
}).strict() ;

export const ParticipantFindFirstArgsSchema: z.ZodType<Prisma.ParticipantFindFirstArgs> = z.object({
  select: ParticipantSelectSchema.optional(),
  include: ParticipantIncludeSchema.optional(),
  where: ParticipantWhereInputSchema.optional(),
  orderBy: z.union([ ParticipantOrderByWithRelationInputSchema.array(),ParticipantOrderByWithRelationInputSchema ]).optional(),
  cursor: ParticipantWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ParticipantScalarFieldEnumSchema,ParticipantScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ParticipantFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ParticipantFindFirstOrThrowArgs> = z.object({
  select: ParticipantSelectSchema.optional(),
  include: ParticipantIncludeSchema.optional(),
  where: ParticipantWhereInputSchema.optional(),
  orderBy: z.union([ ParticipantOrderByWithRelationInputSchema.array(),ParticipantOrderByWithRelationInputSchema ]).optional(),
  cursor: ParticipantWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ParticipantScalarFieldEnumSchema,ParticipantScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ParticipantFindManyArgsSchema: z.ZodType<Prisma.ParticipantFindManyArgs> = z.object({
  select: ParticipantSelectSchema.optional(),
  include: ParticipantIncludeSchema.optional(),
  where: ParticipantWhereInputSchema.optional(),
  orderBy: z.union([ ParticipantOrderByWithRelationInputSchema.array(),ParticipantOrderByWithRelationInputSchema ]).optional(),
  cursor: ParticipantWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ParticipantScalarFieldEnumSchema,ParticipantScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ParticipantAggregateArgsSchema: z.ZodType<Prisma.ParticipantAggregateArgs> = z.object({
  where: ParticipantWhereInputSchema.optional(),
  orderBy: z.union([ ParticipantOrderByWithRelationInputSchema.array(),ParticipantOrderByWithRelationInputSchema ]).optional(),
  cursor: ParticipantWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ParticipantGroupByArgsSchema: z.ZodType<Prisma.ParticipantGroupByArgs> = z.object({
  where: ParticipantWhereInputSchema.optional(),
  orderBy: z.union([ ParticipantOrderByWithAggregationInputSchema.array(),ParticipantOrderByWithAggregationInputSchema ]).optional(),
  by: ParticipantScalarFieldEnumSchema.array(),
  having: ParticipantScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ParticipantFindUniqueArgsSchema: z.ZodType<Prisma.ParticipantFindUniqueArgs> = z.object({
  select: ParticipantSelectSchema.optional(),
  include: ParticipantIncludeSchema.optional(),
  where: ParticipantWhereUniqueInputSchema,
}).strict() ;

export const ParticipantFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ParticipantFindUniqueOrThrowArgs> = z.object({
  select: ParticipantSelectSchema.optional(),
  include: ParticipantIncludeSchema.optional(),
  where: ParticipantWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
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
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
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

export const ActivityCreateArgsSchema: z.ZodType<Prisma.ActivityCreateArgs> = z.object({
  select: ActivitySelectSchema.optional(),
  include: ActivityIncludeSchema.optional(),
  data: z.union([ ActivityCreateInputSchema,ActivityUncheckedCreateInputSchema ]),
}).strict() ;

export const ActivityUpsertArgsSchema: z.ZodType<Prisma.ActivityUpsertArgs> = z.object({
  select: ActivitySelectSchema.optional(),
  include: ActivityIncludeSchema.optional(),
  where: ActivityWhereUniqueInputSchema,
  create: z.union([ ActivityCreateInputSchema,ActivityUncheckedCreateInputSchema ]),
  update: z.union([ ActivityUpdateInputSchema,ActivityUncheckedUpdateInputSchema ]),
}).strict() ;

export const ActivityCreateManyArgsSchema: z.ZodType<Prisma.ActivityCreateManyArgs> = z.object({
  data: z.union([ ActivityCreateManyInputSchema,ActivityCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ActivityCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ActivityCreateManyAndReturnArgs> = z.object({
  data: z.union([ ActivityCreateManyInputSchema,ActivityCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ActivityDeleteArgsSchema: z.ZodType<Prisma.ActivityDeleteArgs> = z.object({
  select: ActivitySelectSchema.optional(),
  include: ActivityIncludeSchema.optional(),
  where: ActivityWhereUniqueInputSchema,
}).strict() ;

export const ActivityUpdateArgsSchema: z.ZodType<Prisma.ActivityUpdateArgs> = z.object({
  select: ActivitySelectSchema.optional(),
  include: ActivityIncludeSchema.optional(),
  data: z.union([ ActivityUpdateInputSchema,ActivityUncheckedUpdateInputSchema ]),
  where: ActivityWhereUniqueInputSchema,
}).strict() ;

export const ActivityUpdateManyArgsSchema: z.ZodType<Prisma.ActivityUpdateManyArgs> = z.object({
  data: z.union([ ActivityUpdateManyMutationInputSchema,ActivityUncheckedUpdateManyInputSchema ]),
  where: ActivityWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ActivityUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ActivityUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ActivityUpdateManyMutationInputSchema,ActivityUncheckedUpdateManyInputSchema ]),
  where: ActivityWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ActivityDeleteManyArgsSchema: z.ZodType<Prisma.ActivityDeleteManyArgs> = z.object({
  where: ActivityWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ParticipantCreateArgsSchema: z.ZodType<Prisma.ParticipantCreateArgs> = z.object({
  select: ParticipantSelectSchema.optional(),
  include: ParticipantIncludeSchema.optional(),
  data: z.union([ ParticipantCreateInputSchema,ParticipantUncheckedCreateInputSchema ]),
}).strict() ;

export const ParticipantUpsertArgsSchema: z.ZodType<Prisma.ParticipantUpsertArgs> = z.object({
  select: ParticipantSelectSchema.optional(),
  include: ParticipantIncludeSchema.optional(),
  where: ParticipantWhereUniqueInputSchema,
  create: z.union([ ParticipantCreateInputSchema,ParticipantUncheckedCreateInputSchema ]),
  update: z.union([ ParticipantUpdateInputSchema,ParticipantUncheckedUpdateInputSchema ]),
}).strict() ;

export const ParticipantCreateManyArgsSchema: z.ZodType<Prisma.ParticipantCreateManyArgs> = z.object({
  data: z.union([ ParticipantCreateManyInputSchema,ParticipantCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ParticipantCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ParticipantCreateManyAndReturnArgs> = z.object({
  data: z.union([ ParticipantCreateManyInputSchema,ParticipantCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ParticipantDeleteArgsSchema: z.ZodType<Prisma.ParticipantDeleteArgs> = z.object({
  select: ParticipantSelectSchema.optional(),
  include: ParticipantIncludeSchema.optional(),
  where: ParticipantWhereUniqueInputSchema,
}).strict() ;

export const ParticipantUpdateArgsSchema: z.ZodType<Prisma.ParticipantUpdateArgs> = z.object({
  select: ParticipantSelectSchema.optional(),
  include: ParticipantIncludeSchema.optional(),
  data: z.union([ ParticipantUpdateInputSchema,ParticipantUncheckedUpdateInputSchema ]),
  where: ParticipantWhereUniqueInputSchema,
}).strict() ;

export const ParticipantUpdateManyArgsSchema: z.ZodType<Prisma.ParticipantUpdateManyArgs> = z.object({
  data: z.union([ ParticipantUpdateManyMutationInputSchema,ParticipantUncheckedUpdateManyInputSchema ]),
  where: ParticipantWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ParticipantUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ParticipantUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ParticipantUpdateManyMutationInputSchema,ParticipantUncheckedUpdateManyInputSchema ]),
  where: ParticipantWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ParticipantDeleteManyArgsSchema: z.ZodType<Prisma.ParticipantDeleteManyArgs> = z.object({
  where: ParticipantWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;