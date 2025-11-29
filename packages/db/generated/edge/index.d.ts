
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model UserUpload
 * Minimal asset tracking for Gif Avatar
 */
export type UserUpload = $Result.DefaultSelection<Prisma.$UserUploadPayload>
/**
 * Model BackgroundRemoved
 * 
 */
export type BackgroundRemoved = $Result.DefaultSelection<Prisma.$BackgroundRemovedPayload>
/**
 * Model UserResult
 * 
 */
export type UserResult = $Result.DefaultSelection<Prisma.$UserResultPayload>
/**
 * Model SocialSubmission
 * 
 */
export type SocialSubmission = $Result.DefaultSelection<Prisma.$SocialSubmissionPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const AccessType: {
  FREE: 'FREE',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY'
};

export type AccessType = (typeof AccessType)[keyof typeof AccessType]


export const SocialPlatform: {
  X: 'X',
  THREADS: 'THREADS',
  FACEBOOK: 'FACEBOOK',
  LINKEDIN: 'LINKEDIN'
};

export type SocialPlatform = (typeof SocialPlatform)[keyof typeof SocialPlatform]


export const SocialSubmissionStatus: {
  VERIFYING: 'VERIFYING',
  VALIDATED: 'VALIDATED',
  INVALID: 'INVALID',
  DUPLICATE: 'DUPLICATE',
  VALIDATION_FAILED: 'VALIDATION_FAILED'
};

export type SocialSubmissionStatus = (typeof SocialSubmissionStatus)[keyof typeof SocialSubmissionStatus]

}

export type AccessType = $Enums.AccessType

export const AccessType: typeof $Enums.AccessType

export type SocialPlatform = $Enums.SocialPlatform

export const SocialPlatform: typeof $Enums.SocialPlatform

export type SocialSubmissionStatus = $Enums.SocialSubmissionStatus

export const SocialSubmissionStatus: typeof $Enums.SocialSubmissionStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userUpload`: Exposes CRUD operations for the **UserUpload** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserUploads
    * const userUploads = await prisma.userUpload.findMany()
    * ```
    */
  get userUpload(): Prisma.UserUploadDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.backgroundRemoved`: Exposes CRUD operations for the **BackgroundRemoved** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BackgroundRemoveds
    * const backgroundRemoveds = await prisma.backgroundRemoved.findMany()
    * ```
    */
  get backgroundRemoved(): Prisma.BackgroundRemovedDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userResult`: Exposes CRUD operations for the **UserResult** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserResults
    * const userResults = await prisma.userResult.findMany()
    * ```
    */
  get userResult(): Prisma.UserResultDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.socialSubmission`: Exposes CRUD operations for the **SocialSubmission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SocialSubmissions
    * const socialSubmissions = await prisma.socialSubmission.findMany()
    * ```
    */
  get socialSubmission(): Prisma.SocialSubmissionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.10.1
   * Query Engine version: 9b628578b3b7cae625e8c927178f15a170e74a9c
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    UserUpload: 'UserUpload',
    BackgroundRemoved: 'BackgroundRemoved',
    UserResult: 'UserResult',
    SocialSubmission: 'SocialSubmission'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "userUpload" | "backgroundRemoved" | "userResult" | "socialSubmission"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      UserUpload: {
        payload: Prisma.$UserUploadPayload<ExtArgs>
        fields: Prisma.UserUploadFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserUploadFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUploadPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserUploadFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUploadPayload>
          }
          findFirst: {
            args: Prisma.UserUploadFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUploadPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserUploadFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUploadPayload>
          }
          findMany: {
            args: Prisma.UserUploadFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUploadPayload>[]
          }
          create: {
            args: Prisma.UserUploadCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUploadPayload>
          }
          createMany: {
            args: Prisma.UserUploadCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserUploadCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUploadPayload>[]
          }
          delete: {
            args: Prisma.UserUploadDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUploadPayload>
          }
          update: {
            args: Prisma.UserUploadUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUploadPayload>
          }
          deleteMany: {
            args: Prisma.UserUploadDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUploadUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUploadUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUploadPayload>[]
          }
          upsert: {
            args: Prisma.UserUploadUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUploadPayload>
          }
          aggregate: {
            args: Prisma.UserUploadAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserUpload>
          }
          groupBy: {
            args: Prisma.UserUploadGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserUploadGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserUploadCountArgs<ExtArgs>
            result: $Utils.Optional<UserUploadCountAggregateOutputType> | number
          }
        }
      }
      BackgroundRemoved: {
        payload: Prisma.$BackgroundRemovedPayload<ExtArgs>
        fields: Prisma.BackgroundRemovedFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BackgroundRemovedFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundRemovedPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BackgroundRemovedFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundRemovedPayload>
          }
          findFirst: {
            args: Prisma.BackgroundRemovedFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundRemovedPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BackgroundRemovedFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundRemovedPayload>
          }
          findMany: {
            args: Prisma.BackgroundRemovedFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundRemovedPayload>[]
          }
          create: {
            args: Prisma.BackgroundRemovedCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundRemovedPayload>
          }
          createMany: {
            args: Prisma.BackgroundRemovedCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BackgroundRemovedCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundRemovedPayload>[]
          }
          delete: {
            args: Prisma.BackgroundRemovedDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundRemovedPayload>
          }
          update: {
            args: Prisma.BackgroundRemovedUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundRemovedPayload>
          }
          deleteMany: {
            args: Prisma.BackgroundRemovedDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BackgroundRemovedUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BackgroundRemovedUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundRemovedPayload>[]
          }
          upsert: {
            args: Prisma.BackgroundRemovedUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundRemovedPayload>
          }
          aggregate: {
            args: Prisma.BackgroundRemovedAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBackgroundRemoved>
          }
          groupBy: {
            args: Prisma.BackgroundRemovedGroupByArgs<ExtArgs>
            result: $Utils.Optional<BackgroundRemovedGroupByOutputType>[]
          }
          count: {
            args: Prisma.BackgroundRemovedCountArgs<ExtArgs>
            result: $Utils.Optional<BackgroundRemovedCountAggregateOutputType> | number
          }
        }
      }
      UserResult: {
        payload: Prisma.$UserResultPayload<ExtArgs>
        fields: Prisma.UserResultFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserResultFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserResultPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserResultFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserResultPayload>
          }
          findFirst: {
            args: Prisma.UserResultFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserResultPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserResultFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserResultPayload>
          }
          findMany: {
            args: Prisma.UserResultFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserResultPayload>[]
          }
          create: {
            args: Prisma.UserResultCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserResultPayload>
          }
          createMany: {
            args: Prisma.UserResultCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserResultCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserResultPayload>[]
          }
          delete: {
            args: Prisma.UserResultDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserResultPayload>
          }
          update: {
            args: Prisma.UserResultUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserResultPayload>
          }
          deleteMany: {
            args: Prisma.UserResultDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserResultUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserResultUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserResultPayload>[]
          }
          upsert: {
            args: Prisma.UserResultUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserResultPayload>
          }
          aggregate: {
            args: Prisma.UserResultAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserResult>
          }
          groupBy: {
            args: Prisma.UserResultGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserResultGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserResultCountArgs<ExtArgs>
            result: $Utils.Optional<UserResultCountAggregateOutputType> | number
          }
        }
      }
      SocialSubmission: {
        payload: Prisma.$SocialSubmissionPayload<ExtArgs>
        fields: Prisma.SocialSubmissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SocialSubmissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialSubmissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SocialSubmissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialSubmissionPayload>
          }
          findFirst: {
            args: Prisma.SocialSubmissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialSubmissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SocialSubmissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialSubmissionPayload>
          }
          findMany: {
            args: Prisma.SocialSubmissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialSubmissionPayload>[]
          }
          create: {
            args: Prisma.SocialSubmissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialSubmissionPayload>
          }
          createMany: {
            args: Prisma.SocialSubmissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SocialSubmissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialSubmissionPayload>[]
          }
          delete: {
            args: Prisma.SocialSubmissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialSubmissionPayload>
          }
          update: {
            args: Prisma.SocialSubmissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialSubmissionPayload>
          }
          deleteMany: {
            args: Prisma.SocialSubmissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SocialSubmissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SocialSubmissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialSubmissionPayload>[]
          }
          upsert: {
            args: Prisma.SocialSubmissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialSubmissionPayload>
          }
          aggregate: {
            args: Prisma.SocialSubmissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSocialSubmission>
          }
          groupBy: {
            args: Prisma.SocialSubmissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SocialSubmissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SocialSubmissionCountArgs<ExtArgs>
            result: $Utils.Optional<SocialSubmissionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    userUpload?: UserUploadOmit
    backgroundRemoved?: BackgroundRemovedOmit
    userResult?: UserResultOmit
    socialSubmission?: SocialSubmissionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    dailyAIcomments: number | null
    creditConsumed: number | null
  }

  export type UserSumAggregateOutputType = {
    dailyAIcomments: number | null
    creditConsumed: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    firstName: string | null
    lastName: string | null
    username: string | null
    primaryEmailAddress: string | null
    imageUrl: string | null
    stripeCustomerId: string | null
    accessType: $Enums.AccessType | null
    dailyAIcomments: number | null
    creditConsumed: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    firstName: string | null
    lastName: string | null
    username: string | null
    primaryEmailAddress: string | null
    imageUrl: string | null
    stripeCustomerId: string | null
    accessType: $Enums.AccessType | null
    dailyAIcomments: number | null
    creditConsumed: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    firstName: number
    lastName: number
    username: number
    primaryEmailAddress: number
    imageUrl: number
    clerkUserProperties: number
    stripeCustomerId: number
    accessType: number
    stripeUserProperties: number
    dailyAIcomments: number
    creditConsumed: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    dailyAIcomments?: true
    creditConsumed?: true
  }

  export type UserSumAggregateInputType = {
    dailyAIcomments?: true
    creditConsumed?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    username?: true
    primaryEmailAddress?: true
    imageUrl?: true
    stripeCustomerId?: true
    accessType?: true
    dailyAIcomments?: true
    creditConsumed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    username?: true
    primaryEmailAddress?: true
    imageUrl?: true
    stripeCustomerId?: true
    accessType?: true
    dailyAIcomments?: true
    creditConsumed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    username?: true
    primaryEmailAddress?: true
    imageUrl?: true
    clerkUserProperties?: true
    stripeCustomerId?: true
    accessType?: true
    stripeUserProperties?: true
    dailyAIcomments?: true
    creditConsumed?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    firstName: string | null
    lastName: string | null
    username: string | null
    primaryEmailAddress: string
    imageUrl: string | null
    clerkUserProperties: JsonValue | null
    stripeCustomerId: string | null
    accessType: $Enums.AccessType
    stripeUserProperties: JsonValue | null
    dailyAIcomments: number
    creditConsumed: number
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    username?: boolean
    primaryEmailAddress?: boolean
    imageUrl?: boolean
    clerkUserProperties?: boolean
    stripeCustomerId?: boolean
    accessType?: boolean
    stripeUserProperties?: boolean
    dailyAIcomments?: boolean
    creditConsumed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    username?: boolean
    primaryEmailAddress?: boolean
    imageUrl?: boolean
    clerkUserProperties?: boolean
    stripeCustomerId?: boolean
    accessType?: boolean
    stripeUserProperties?: boolean
    dailyAIcomments?: boolean
    creditConsumed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    username?: boolean
    primaryEmailAddress?: boolean
    imageUrl?: boolean
    clerkUserProperties?: boolean
    stripeCustomerId?: boolean
    accessType?: boolean
    stripeUserProperties?: boolean
    dailyAIcomments?: boolean
    creditConsumed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    username?: boolean
    primaryEmailAddress?: boolean
    imageUrl?: boolean
    clerkUserProperties?: boolean
    stripeCustomerId?: boolean
    accessType?: boolean
    stripeUserProperties?: boolean
    dailyAIcomments?: boolean
    creditConsumed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "firstName" | "lastName" | "username" | "primaryEmailAddress" | "imageUrl" | "clerkUserProperties" | "stripeCustomerId" | "accessType" | "stripeUserProperties" | "dailyAIcomments" | "creditConsumed" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      firstName: string | null
      lastName: string | null
      username: string | null
      primaryEmailAddress: string
      imageUrl: string | null
      clerkUserProperties: Prisma.JsonValue | null
      stripeCustomerId: string | null
      accessType: $Enums.AccessType
      stripeUserProperties: Prisma.JsonValue | null
      dailyAIcomments: number
      creditConsumed: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly primaryEmailAddress: FieldRef<"User", 'String'>
    readonly imageUrl: FieldRef<"User", 'String'>
    readonly clerkUserProperties: FieldRef<"User", 'Json'>
    readonly stripeCustomerId: FieldRef<"User", 'String'>
    readonly accessType: FieldRef<"User", 'AccessType'>
    readonly stripeUserProperties: FieldRef<"User", 'Json'>
    readonly dailyAIcomments: FieldRef<"User", 'Int'>
    readonly creditConsumed: FieldRef<"User", 'Int'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
  }


  /**
   * Model UserUpload
   */

  export type AggregateUserUpload = {
    _count: UserUploadCountAggregateOutputType | null
    _min: UserUploadMinAggregateOutputType | null
    _max: UserUploadMaxAggregateOutputType | null
  }

  export type UserUploadMinAggregateOutputType = {
    id: string | null
    userId: string | null
    path: string | null
    mime: string | null
    defaultStyle: string | null
    defaultBgColor: string | null
    createdAt: Date | null
  }

  export type UserUploadMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    path: string | null
    mime: string | null
    defaultStyle: string | null
    defaultBgColor: string | null
    createdAt: Date | null
  }

  export type UserUploadCountAggregateOutputType = {
    id: number
    userId: number
    path: number
    mime: number
    defaultStyle: number
    defaultBgColor: number
    createdAt: number
    _all: number
  }


  export type UserUploadMinAggregateInputType = {
    id?: true
    userId?: true
    path?: true
    mime?: true
    defaultStyle?: true
    defaultBgColor?: true
    createdAt?: true
  }

  export type UserUploadMaxAggregateInputType = {
    id?: true
    userId?: true
    path?: true
    mime?: true
    defaultStyle?: true
    defaultBgColor?: true
    createdAt?: true
  }

  export type UserUploadCountAggregateInputType = {
    id?: true
    userId?: true
    path?: true
    mime?: true
    defaultStyle?: true
    defaultBgColor?: true
    createdAt?: true
    _all?: true
  }

  export type UserUploadAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserUpload to aggregate.
     */
    where?: UserUploadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserUploads to fetch.
     */
    orderBy?: UserUploadOrderByWithRelationInput | UserUploadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserUploadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserUploads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserUploads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserUploads
    **/
    _count?: true | UserUploadCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserUploadMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserUploadMaxAggregateInputType
  }

  export type GetUserUploadAggregateType<T extends UserUploadAggregateArgs> = {
        [P in keyof T & keyof AggregateUserUpload]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserUpload[P]>
      : GetScalarType<T[P], AggregateUserUpload[P]>
  }




  export type UserUploadGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserUploadWhereInput
    orderBy?: UserUploadOrderByWithAggregationInput | UserUploadOrderByWithAggregationInput[]
    by: UserUploadScalarFieldEnum[] | UserUploadScalarFieldEnum
    having?: UserUploadScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserUploadCountAggregateInputType | true
    _min?: UserUploadMinAggregateInputType
    _max?: UserUploadMaxAggregateInputType
  }

  export type UserUploadGroupByOutputType = {
    id: string
    userId: string
    path: string
    mime: string
    defaultStyle: string | null
    defaultBgColor: string | null
    createdAt: Date
    _count: UserUploadCountAggregateOutputType | null
    _min: UserUploadMinAggregateOutputType | null
    _max: UserUploadMaxAggregateOutputType | null
  }

  type GetUserUploadGroupByPayload<T extends UserUploadGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserUploadGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserUploadGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserUploadGroupByOutputType[P]>
            : GetScalarType<T[P], UserUploadGroupByOutputType[P]>
        }
      >
    >


  export type UserUploadSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    path?: boolean
    mime?: boolean
    defaultStyle?: boolean
    defaultBgColor?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["userUpload"]>

  export type UserUploadSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    path?: boolean
    mime?: boolean
    defaultStyle?: boolean
    defaultBgColor?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["userUpload"]>

  export type UserUploadSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    path?: boolean
    mime?: boolean
    defaultStyle?: boolean
    defaultBgColor?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["userUpload"]>

  export type UserUploadSelectScalar = {
    id?: boolean
    userId?: boolean
    path?: boolean
    mime?: boolean
    defaultStyle?: boolean
    defaultBgColor?: boolean
    createdAt?: boolean
  }

  export type UserUploadOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "path" | "mime" | "defaultStyle" | "defaultBgColor" | "createdAt", ExtArgs["result"]["userUpload"]>

  export type $UserUploadPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserUpload"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      path: string
      mime: string
      defaultStyle: string | null
      defaultBgColor: string | null
      createdAt: Date
    }, ExtArgs["result"]["userUpload"]>
    composites: {}
  }

  type UserUploadGetPayload<S extends boolean | null | undefined | UserUploadDefaultArgs> = $Result.GetResult<Prisma.$UserUploadPayload, S>

  type UserUploadCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserUploadFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserUploadCountAggregateInputType | true
    }

  export interface UserUploadDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserUpload'], meta: { name: 'UserUpload' } }
    /**
     * Find zero or one UserUpload that matches the filter.
     * @param {UserUploadFindUniqueArgs} args - Arguments to find a UserUpload
     * @example
     * // Get one UserUpload
     * const userUpload = await prisma.userUpload.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserUploadFindUniqueArgs>(args: SelectSubset<T, UserUploadFindUniqueArgs<ExtArgs>>): Prisma__UserUploadClient<$Result.GetResult<Prisma.$UserUploadPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserUpload that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserUploadFindUniqueOrThrowArgs} args - Arguments to find a UserUpload
     * @example
     * // Get one UserUpload
     * const userUpload = await prisma.userUpload.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserUploadFindUniqueOrThrowArgs>(args: SelectSubset<T, UserUploadFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserUploadClient<$Result.GetResult<Prisma.$UserUploadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserUpload that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUploadFindFirstArgs} args - Arguments to find a UserUpload
     * @example
     * // Get one UserUpload
     * const userUpload = await prisma.userUpload.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserUploadFindFirstArgs>(args?: SelectSubset<T, UserUploadFindFirstArgs<ExtArgs>>): Prisma__UserUploadClient<$Result.GetResult<Prisma.$UserUploadPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserUpload that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUploadFindFirstOrThrowArgs} args - Arguments to find a UserUpload
     * @example
     * // Get one UserUpload
     * const userUpload = await prisma.userUpload.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserUploadFindFirstOrThrowArgs>(args?: SelectSubset<T, UserUploadFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserUploadClient<$Result.GetResult<Prisma.$UserUploadPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserUploads that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUploadFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserUploads
     * const userUploads = await prisma.userUpload.findMany()
     * 
     * // Get first 10 UserUploads
     * const userUploads = await prisma.userUpload.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userUploadWithIdOnly = await prisma.userUpload.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserUploadFindManyArgs>(args?: SelectSubset<T, UserUploadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserUploadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserUpload.
     * @param {UserUploadCreateArgs} args - Arguments to create a UserUpload.
     * @example
     * // Create one UserUpload
     * const UserUpload = await prisma.userUpload.create({
     *   data: {
     *     // ... data to create a UserUpload
     *   }
     * })
     * 
     */
    create<T extends UserUploadCreateArgs>(args: SelectSubset<T, UserUploadCreateArgs<ExtArgs>>): Prisma__UserUploadClient<$Result.GetResult<Prisma.$UserUploadPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserUploads.
     * @param {UserUploadCreateManyArgs} args - Arguments to create many UserUploads.
     * @example
     * // Create many UserUploads
     * const userUpload = await prisma.userUpload.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserUploadCreateManyArgs>(args?: SelectSubset<T, UserUploadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserUploads and returns the data saved in the database.
     * @param {UserUploadCreateManyAndReturnArgs} args - Arguments to create many UserUploads.
     * @example
     * // Create many UserUploads
     * const userUpload = await prisma.userUpload.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserUploads and only return the `id`
     * const userUploadWithIdOnly = await prisma.userUpload.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserUploadCreateManyAndReturnArgs>(args?: SelectSubset<T, UserUploadCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserUploadPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserUpload.
     * @param {UserUploadDeleteArgs} args - Arguments to delete one UserUpload.
     * @example
     * // Delete one UserUpload
     * const UserUpload = await prisma.userUpload.delete({
     *   where: {
     *     // ... filter to delete one UserUpload
     *   }
     * })
     * 
     */
    delete<T extends UserUploadDeleteArgs>(args: SelectSubset<T, UserUploadDeleteArgs<ExtArgs>>): Prisma__UserUploadClient<$Result.GetResult<Prisma.$UserUploadPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserUpload.
     * @param {UserUploadUpdateArgs} args - Arguments to update one UserUpload.
     * @example
     * // Update one UserUpload
     * const userUpload = await prisma.userUpload.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUploadUpdateArgs>(args: SelectSubset<T, UserUploadUpdateArgs<ExtArgs>>): Prisma__UserUploadClient<$Result.GetResult<Prisma.$UserUploadPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserUploads.
     * @param {UserUploadDeleteManyArgs} args - Arguments to filter UserUploads to delete.
     * @example
     * // Delete a few UserUploads
     * const { count } = await prisma.userUpload.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserUploadDeleteManyArgs>(args?: SelectSubset<T, UserUploadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserUploads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUploadUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserUploads
     * const userUpload = await prisma.userUpload.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUploadUpdateManyArgs>(args: SelectSubset<T, UserUploadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserUploads and returns the data updated in the database.
     * @param {UserUploadUpdateManyAndReturnArgs} args - Arguments to update many UserUploads.
     * @example
     * // Update many UserUploads
     * const userUpload = await prisma.userUpload.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserUploads and only return the `id`
     * const userUploadWithIdOnly = await prisma.userUpload.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUploadUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUploadUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserUploadPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserUpload.
     * @param {UserUploadUpsertArgs} args - Arguments to update or create a UserUpload.
     * @example
     * // Update or create a UserUpload
     * const userUpload = await prisma.userUpload.upsert({
     *   create: {
     *     // ... data to create a UserUpload
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserUpload we want to update
     *   }
     * })
     */
    upsert<T extends UserUploadUpsertArgs>(args: SelectSubset<T, UserUploadUpsertArgs<ExtArgs>>): Prisma__UserUploadClient<$Result.GetResult<Prisma.$UserUploadPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserUploads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUploadCountArgs} args - Arguments to filter UserUploads to count.
     * @example
     * // Count the number of UserUploads
     * const count = await prisma.userUpload.count({
     *   where: {
     *     // ... the filter for the UserUploads we want to count
     *   }
     * })
    **/
    count<T extends UserUploadCountArgs>(
      args?: Subset<T, UserUploadCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserUploadCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserUpload.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUploadAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserUploadAggregateArgs>(args: Subset<T, UserUploadAggregateArgs>): Prisma.PrismaPromise<GetUserUploadAggregateType<T>>

    /**
     * Group by UserUpload.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUploadGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserUploadGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserUploadGroupByArgs['orderBy'] }
        : { orderBy?: UserUploadGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserUploadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserUploadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserUpload model
   */
  readonly fields: UserUploadFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserUpload.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserUploadClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserUpload model
   */
  interface UserUploadFieldRefs {
    readonly id: FieldRef<"UserUpload", 'String'>
    readonly userId: FieldRef<"UserUpload", 'String'>
    readonly path: FieldRef<"UserUpload", 'String'>
    readonly mime: FieldRef<"UserUpload", 'String'>
    readonly defaultStyle: FieldRef<"UserUpload", 'String'>
    readonly defaultBgColor: FieldRef<"UserUpload", 'String'>
    readonly createdAt: FieldRef<"UserUpload", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserUpload findUnique
   */
  export type UserUploadFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUpload
     */
    select?: UserUploadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUpload
     */
    omit?: UserUploadOmit<ExtArgs> | null
    /**
     * Filter, which UserUpload to fetch.
     */
    where: UserUploadWhereUniqueInput
  }

  /**
   * UserUpload findUniqueOrThrow
   */
  export type UserUploadFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUpload
     */
    select?: UserUploadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUpload
     */
    omit?: UserUploadOmit<ExtArgs> | null
    /**
     * Filter, which UserUpload to fetch.
     */
    where: UserUploadWhereUniqueInput
  }

  /**
   * UserUpload findFirst
   */
  export type UserUploadFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUpload
     */
    select?: UserUploadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUpload
     */
    omit?: UserUploadOmit<ExtArgs> | null
    /**
     * Filter, which UserUpload to fetch.
     */
    where?: UserUploadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserUploads to fetch.
     */
    orderBy?: UserUploadOrderByWithRelationInput | UserUploadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserUploads.
     */
    cursor?: UserUploadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserUploads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserUploads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserUploads.
     */
    distinct?: UserUploadScalarFieldEnum | UserUploadScalarFieldEnum[]
  }

  /**
   * UserUpload findFirstOrThrow
   */
  export type UserUploadFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUpload
     */
    select?: UserUploadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUpload
     */
    omit?: UserUploadOmit<ExtArgs> | null
    /**
     * Filter, which UserUpload to fetch.
     */
    where?: UserUploadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserUploads to fetch.
     */
    orderBy?: UserUploadOrderByWithRelationInput | UserUploadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserUploads.
     */
    cursor?: UserUploadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserUploads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserUploads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserUploads.
     */
    distinct?: UserUploadScalarFieldEnum | UserUploadScalarFieldEnum[]
  }

  /**
   * UserUpload findMany
   */
  export type UserUploadFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUpload
     */
    select?: UserUploadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUpload
     */
    omit?: UserUploadOmit<ExtArgs> | null
    /**
     * Filter, which UserUploads to fetch.
     */
    where?: UserUploadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserUploads to fetch.
     */
    orderBy?: UserUploadOrderByWithRelationInput | UserUploadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserUploads.
     */
    cursor?: UserUploadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserUploads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserUploads.
     */
    skip?: number
    distinct?: UserUploadScalarFieldEnum | UserUploadScalarFieldEnum[]
  }

  /**
   * UserUpload create
   */
  export type UserUploadCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUpload
     */
    select?: UserUploadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUpload
     */
    omit?: UserUploadOmit<ExtArgs> | null
    /**
     * The data needed to create a UserUpload.
     */
    data: XOR<UserUploadCreateInput, UserUploadUncheckedCreateInput>
  }

  /**
   * UserUpload createMany
   */
  export type UserUploadCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserUploads.
     */
    data: UserUploadCreateManyInput | UserUploadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserUpload createManyAndReturn
   */
  export type UserUploadCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUpload
     */
    select?: UserUploadSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserUpload
     */
    omit?: UserUploadOmit<ExtArgs> | null
    /**
     * The data used to create many UserUploads.
     */
    data: UserUploadCreateManyInput | UserUploadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserUpload update
   */
  export type UserUploadUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUpload
     */
    select?: UserUploadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUpload
     */
    omit?: UserUploadOmit<ExtArgs> | null
    /**
     * The data needed to update a UserUpload.
     */
    data: XOR<UserUploadUpdateInput, UserUploadUncheckedUpdateInput>
    /**
     * Choose, which UserUpload to update.
     */
    where: UserUploadWhereUniqueInput
  }

  /**
   * UserUpload updateMany
   */
  export type UserUploadUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserUploads.
     */
    data: XOR<UserUploadUpdateManyMutationInput, UserUploadUncheckedUpdateManyInput>
    /**
     * Filter which UserUploads to update
     */
    where?: UserUploadWhereInput
    /**
     * Limit how many UserUploads to update.
     */
    limit?: number
  }

  /**
   * UserUpload updateManyAndReturn
   */
  export type UserUploadUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUpload
     */
    select?: UserUploadSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserUpload
     */
    omit?: UserUploadOmit<ExtArgs> | null
    /**
     * The data used to update UserUploads.
     */
    data: XOR<UserUploadUpdateManyMutationInput, UserUploadUncheckedUpdateManyInput>
    /**
     * Filter which UserUploads to update
     */
    where?: UserUploadWhereInput
    /**
     * Limit how many UserUploads to update.
     */
    limit?: number
  }

  /**
   * UserUpload upsert
   */
  export type UserUploadUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUpload
     */
    select?: UserUploadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUpload
     */
    omit?: UserUploadOmit<ExtArgs> | null
    /**
     * The filter to search for the UserUpload to update in case it exists.
     */
    where: UserUploadWhereUniqueInput
    /**
     * In case the UserUpload found by the `where` argument doesn't exist, create a new UserUpload with this data.
     */
    create: XOR<UserUploadCreateInput, UserUploadUncheckedCreateInput>
    /**
     * In case the UserUpload was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUploadUpdateInput, UserUploadUncheckedUpdateInput>
  }

  /**
   * UserUpload delete
   */
  export type UserUploadDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUpload
     */
    select?: UserUploadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUpload
     */
    omit?: UserUploadOmit<ExtArgs> | null
    /**
     * Filter which UserUpload to delete.
     */
    where: UserUploadWhereUniqueInput
  }

  /**
   * UserUpload deleteMany
   */
  export type UserUploadDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserUploads to delete
     */
    where?: UserUploadWhereInput
    /**
     * Limit how many UserUploads to delete.
     */
    limit?: number
  }

  /**
   * UserUpload without action
   */
  export type UserUploadDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUpload
     */
    select?: UserUploadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUpload
     */
    omit?: UserUploadOmit<ExtArgs> | null
  }


  /**
   * Model BackgroundRemoved
   */

  export type AggregateBackgroundRemoved = {
    _count: BackgroundRemovedCountAggregateOutputType | null
    _min: BackgroundRemovedMinAggregateOutputType | null
    _max: BackgroundRemovedMaxAggregateOutputType | null
  }

  export type BackgroundRemovedMinAggregateOutputType = {
    id: string | null
    userId: string | null
    sourceUploadId: string | null
    path: string | null
    createdAt: Date | null
  }

  export type BackgroundRemovedMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    sourceUploadId: string | null
    path: string | null
    createdAt: Date | null
  }

  export type BackgroundRemovedCountAggregateOutputType = {
    id: number
    userId: number
    sourceUploadId: number
    path: number
    createdAt: number
    _all: number
  }


  export type BackgroundRemovedMinAggregateInputType = {
    id?: true
    userId?: true
    sourceUploadId?: true
    path?: true
    createdAt?: true
  }

  export type BackgroundRemovedMaxAggregateInputType = {
    id?: true
    userId?: true
    sourceUploadId?: true
    path?: true
    createdAt?: true
  }

  export type BackgroundRemovedCountAggregateInputType = {
    id?: true
    userId?: true
    sourceUploadId?: true
    path?: true
    createdAt?: true
    _all?: true
  }

  export type BackgroundRemovedAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BackgroundRemoved to aggregate.
     */
    where?: BackgroundRemovedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackgroundRemoveds to fetch.
     */
    orderBy?: BackgroundRemovedOrderByWithRelationInput | BackgroundRemovedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BackgroundRemovedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackgroundRemoveds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackgroundRemoveds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BackgroundRemoveds
    **/
    _count?: true | BackgroundRemovedCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BackgroundRemovedMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BackgroundRemovedMaxAggregateInputType
  }

  export type GetBackgroundRemovedAggregateType<T extends BackgroundRemovedAggregateArgs> = {
        [P in keyof T & keyof AggregateBackgroundRemoved]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBackgroundRemoved[P]>
      : GetScalarType<T[P], AggregateBackgroundRemoved[P]>
  }




  export type BackgroundRemovedGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BackgroundRemovedWhereInput
    orderBy?: BackgroundRemovedOrderByWithAggregationInput | BackgroundRemovedOrderByWithAggregationInput[]
    by: BackgroundRemovedScalarFieldEnum[] | BackgroundRemovedScalarFieldEnum
    having?: BackgroundRemovedScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BackgroundRemovedCountAggregateInputType | true
    _min?: BackgroundRemovedMinAggregateInputType
    _max?: BackgroundRemovedMaxAggregateInputType
  }

  export type BackgroundRemovedGroupByOutputType = {
    id: string
    userId: string
    sourceUploadId: string
    path: string
    createdAt: Date
    _count: BackgroundRemovedCountAggregateOutputType | null
    _min: BackgroundRemovedMinAggregateOutputType | null
    _max: BackgroundRemovedMaxAggregateOutputType | null
  }

  type GetBackgroundRemovedGroupByPayload<T extends BackgroundRemovedGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BackgroundRemovedGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BackgroundRemovedGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BackgroundRemovedGroupByOutputType[P]>
            : GetScalarType<T[P], BackgroundRemovedGroupByOutputType[P]>
        }
      >
    >


  export type BackgroundRemovedSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sourceUploadId?: boolean
    path?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["backgroundRemoved"]>

  export type BackgroundRemovedSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sourceUploadId?: boolean
    path?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["backgroundRemoved"]>

  export type BackgroundRemovedSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sourceUploadId?: boolean
    path?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["backgroundRemoved"]>

  export type BackgroundRemovedSelectScalar = {
    id?: boolean
    userId?: boolean
    sourceUploadId?: boolean
    path?: boolean
    createdAt?: boolean
  }

  export type BackgroundRemovedOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "sourceUploadId" | "path" | "createdAt", ExtArgs["result"]["backgroundRemoved"]>

  export type $BackgroundRemovedPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BackgroundRemoved"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      sourceUploadId: string
      path: string
      createdAt: Date
    }, ExtArgs["result"]["backgroundRemoved"]>
    composites: {}
  }

  type BackgroundRemovedGetPayload<S extends boolean | null | undefined | BackgroundRemovedDefaultArgs> = $Result.GetResult<Prisma.$BackgroundRemovedPayload, S>

  type BackgroundRemovedCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BackgroundRemovedFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BackgroundRemovedCountAggregateInputType | true
    }

  export interface BackgroundRemovedDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BackgroundRemoved'], meta: { name: 'BackgroundRemoved' } }
    /**
     * Find zero or one BackgroundRemoved that matches the filter.
     * @param {BackgroundRemovedFindUniqueArgs} args - Arguments to find a BackgroundRemoved
     * @example
     * // Get one BackgroundRemoved
     * const backgroundRemoved = await prisma.backgroundRemoved.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BackgroundRemovedFindUniqueArgs>(args: SelectSubset<T, BackgroundRemovedFindUniqueArgs<ExtArgs>>): Prisma__BackgroundRemovedClient<$Result.GetResult<Prisma.$BackgroundRemovedPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BackgroundRemoved that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BackgroundRemovedFindUniqueOrThrowArgs} args - Arguments to find a BackgroundRemoved
     * @example
     * // Get one BackgroundRemoved
     * const backgroundRemoved = await prisma.backgroundRemoved.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BackgroundRemovedFindUniqueOrThrowArgs>(args: SelectSubset<T, BackgroundRemovedFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BackgroundRemovedClient<$Result.GetResult<Prisma.$BackgroundRemovedPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BackgroundRemoved that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackgroundRemovedFindFirstArgs} args - Arguments to find a BackgroundRemoved
     * @example
     * // Get one BackgroundRemoved
     * const backgroundRemoved = await prisma.backgroundRemoved.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BackgroundRemovedFindFirstArgs>(args?: SelectSubset<T, BackgroundRemovedFindFirstArgs<ExtArgs>>): Prisma__BackgroundRemovedClient<$Result.GetResult<Prisma.$BackgroundRemovedPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BackgroundRemoved that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackgroundRemovedFindFirstOrThrowArgs} args - Arguments to find a BackgroundRemoved
     * @example
     * // Get one BackgroundRemoved
     * const backgroundRemoved = await prisma.backgroundRemoved.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BackgroundRemovedFindFirstOrThrowArgs>(args?: SelectSubset<T, BackgroundRemovedFindFirstOrThrowArgs<ExtArgs>>): Prisma__BackgroundRemovedClient<$Result.GetResult<Prisma.$BackgroundRemovedPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BackgroundRemoveds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackgroundRemovedFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BackgroundRemoveds
     * const backgroundRemoveds = await prisma.backgroundRemoved.findMany()
     * 
     * // Get first 10 BackgroundRemoveds
     * const backgroundRemoveds = await prisma.backgroundRemoved.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const backgroundRemovedWithIdOnly = await prisma.backgroundRemoved.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BackgroundRemovedFindManyArgs>(args?: SelectSubset<T, BackgroundRemovedFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackgroundRemovedPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BackgroundRemoved.
     * @param {BackgroundRemovedCreateArgs} args - Arguments to create a BackgroundRemoved.
     * @example
     * // Create one BackgroundRemoved
     * const BackgroundRemoved = await prisma.backgroundRemoved.create({
     *   data: {
     *     // ... data to create a BackgroundRemoved
     *   }
     * })
     * 
     */
    create<T extends BackgroundRemovedCreateArgs>(args: SelectSubset<T, BackgroundRemovedCreateArgs<ExtArgs>>): Prisma__BackgroundRemovedClient<$Result.GetResult<Prisma.$BackgroundRemovedPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BackgroundRemoveds.
     * @param {BackgroundRemovedCreateManyArgs} args - Arguments to create many BackgroundRemoveds.
     * @example
     * // Create many BackgroundRemoveds
     * const backgroundRemoved = await prisma.backgroundRemoved.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BackgroundRemovedCreateManyArgs>(args?: SelectSubset<T, BackgroundRemovedCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BackgroundRemoveds and returns the data saved in the database.
     * @param {BackgroundRemovedCreateManyAndReturnArgs} args - Arguments to create many BackgroundRemoveds.
     * @example
     * // Create many BackgroundRemoveds
     * const backgroundRemoved = await prisma.backgroundRemoved.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BackgroundRemoveds and only return the `id`
     * const backgroundRemovedWithIdOnly = await prisma.backgroundRemoved.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BackgroundRemovedCreateManyAndReturnArgs>(args?: SelectSubset<T, BackgroundRemovedCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackgroundRemovedPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BackgroundRemoved.
     * @param {BackgroundRemovedDeleteArgs} args - Arguments to delete one BackgroundRemoved.
     * @example
     * // Delete one BackgroundRemoved
     * const BackgroundRemoved = await prisma.backgroundRemoved.delete({
     *   where: {
     *     // ... filter to delete one BackgroundRemoved
     *   }
     * })
     * 
     */
    delete<T extends BackgroundRemovedDeleteArgs>(args: SelectSubset<T, BackgroundRemovedDeleteArgs<ExtArgs>>): Prisma__BackgroundRemovedClient<$Result.GetResult<Prisma.$BackgroundRemovedPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BackgroundRemoved.
     * @param {BackgroundRemovedUpdateArgs} args - Arguments to update one BackgroundRemoved.
     * @example
     * // Update one BackgroundRemoved
     * const backgroundRemoved = await prisma.backgroundRemoved.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BackgroundRemovedUpdateArgs>(args: SelectSubset<T, BackgroundRemovedUpdateArgs<ExtArgs>>): Prisma__BackgroundRemovedClient<$Result.GetResult<Prisma.$BackgroundRemovedPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BackgroundRemoveds.
     * @param {BackgroundRemovedDeleteManyArgs} args - Arguments to filter BackgroundRemoveds to delete.
     * @example
     * // Delete a few BackgroundRemoveds
     * const { count } = await prisma.backgroundRemoved.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BackgroundRemovedDeleteManyArgs>(args?: SelectSubset<T, BackgroundRemovedDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BackgroundRemoveds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackgroundRemovedUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BackgroundRemoveds
     * const backgroundRemoved = await prisma.backgroundRemoved.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BackgroundRemovedUpdateManyArgs>(args: SelectSubset<T, BackgroundRemovedUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BackgroundRemoveds and returns the data updated in the database.
     * @param {BackgroundRemovedUpdateManyAndReturnArgs} args - Arguments to update many BackgroundRemoveds.
     * @example
     * // Update many BackgroundRemoveds
     * const backgroundRemoved = await prisma.backgroundRemoved.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BackgroundRemoveds and only return the `id`
     * const backgroundRemovedWithIdOnly = await prisma.backgroundRemoved.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BackgroundRemovedUpdateManyAndReturnArgs>(args: SelectSubset<T, BackgroundRemovedUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackgroundRemovedPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BackgroundRemoved.
     * @param {BackgroundRemovedUpsertArgs} args - Arguments to update or create a BackgroundRemoved.
     * @example
     * // Update or create a BackgroundRemoved
     * const backgroundRemoved = await prisma.backgroundRemoved.upsert({
     *   create: {
     *     // ... data to create a BackgroundRemoved
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BackgroundRemoved we want to update
     *   }
     * })
     */
    upsert<T extends BackgroundRemovedUpsertArgs>(args: SelectSubset<T, BackgroundRemovedUpsertArgs<ExtArgs>>): Prisma__BackgroundRemovedClient<$Result.GetResult<Prisma.$BackgroundRemovedPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BackgroundRemoveds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackgroundRemovedCountArgs} args - Arguments to filter BackgroundRemoveds to count.
     * @example
     * // Count the number of BackgroundRemoveds
     * const count = await prisma.backgroundRemoved.count({
     *   where: {
     *     // ... the filter for the BackgroundRemoveds we want to count
     *   }
     * })
    **/
    count<T extends BackgroundRemovedCountArgs>(
      args?: Subset<T, BackgroundRemovedCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BackgroundRemovedCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BackgroundRemoved.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackgroundRemovedAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BackgroundRemovedAggregateArgs>(args: Subset<T, BackgroundRemovedAggregateArgs>): Prisma.PrismaPromise<GetBackgroundRemovedAggregateType<T>>

    /**
     * Group by BackgroundRemoved.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackgroundRemovedGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BackgroundRemovedGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BackgroundRemovedGroupByArgs['orderBy'] }
        : { orderBy?: BackgroundRemovedGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BackgroundRemovedGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBackgroundRemovedGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BackgroundRemoved model
   */
  readonly fields: BackgroundRemovedFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BackgroundRemoved.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BackgroundRemovedClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BackgroundRemoved model
   */
  interface BackgroundRemovedFieldRefs {
    readonly id: FieldRef<"BackgroundRemoved", 'String'>
    readonly userId: FieldRef<"BackgroundRemoved", 'String'>
    readonly sourceUploadId: FieldRef<"BackgroundRemoved", 'String'>
    readonly path: FieldRef<"BackgroundRemoved", 'String'>
    readonly createdAt: FieldRef<"BackgroundRemoved", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BackgroundRemoved findUnique
   */
  export type BackgroundRemovedFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundRemoved
     */
    select?: BackgroundRemovedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackgroundRemoved
     */
    omit?: BackgroundRemovedOmit<ExtArgs> | null
    /**
     * Filter, which BackgroundRemoved to fetch.
     */
    where: BackgroundRemovedWhereUniqueInput
  }

  /**
   * BackgroundRemoved findUniqueOrThrow
   */
  export type BackgroundRemovedFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundRemoved
     */
    select?: BackgroundRemovedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackgroundRemoved
     */
    omit?: BackgroundRemovedOmit<ExtArgs> | null
    /**
     * Filter, which BackgroundRemoved to fetch.
     */
    where: BackgroundRemovedWhereUniqueInput
  }

  /**
   * BackgroundRemoved findFirst
   */
  export type BackgroundRemovedFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundRemoved
     */
    select?: BackgroundRemovedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackgroundRemoved
     */
    omit?: BackgroundRemovedOmit<ExtArgs> | null
    /**
     * Filter, which BackgroundRemoved to fetch.
     */
    where?: BackgroundRemovedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackgroundRemoveds to fetch.
     */
    orderBy?: BackgroundRemovedOrderByWithRelationInput | BackgroundRemovedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BackgroundRemoveds.
     */
    cursor?: BackgroundRemovedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackgroundRemoveds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackgroundRemoveds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BackgroundRemoveds.
     */
    distinct?: BackgroundRemovedScalarFieldEnum | BackgroundRemovedScalarFieldEnum[]
  }

  /**
   * BackgroundRemoved findFirstOrThrow
   */
  export type BackgroundRemovedFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundRemoved
     */
    select?: BackgroundRemovedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackgroundRemoved
     */
    omit?: BackgroundRemovedOmit<ExtArgs> | null
    /**
     * Filter, which BackgroundRemoved to fetch.
     */
    where?: BackgroundRemovedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackgroundRemoveds to fetch.
     */
    orderBy?: BackgroundRemovedOrderByWithRelationInput | BackgroundRemovedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BackgroundRemoveds.
     */
    cursor?: BackgroundRemovedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackgroundRemoveds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackgroundRemoveds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BackgroundRemoveds.
     */
    distinct?: BackgroundRemovedScalarFieldEnum | BackgroundRemovedScalarFieldEnum[]
  }

  /**
   * BackgroundRemoved findMany
   */
  export type BackgroundRemovedFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundRemoved
     */
    select?: BackgroundRemovedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackgroundRemoved
     */
    omit?: BackgroundRemovedOmit<ExtArgs> | null
    /**
     * Filter, which BackgroundRemoveds to fetch.
     */
    where?: BackgroundRemovedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackgroundRemoveds to fetch.
     */
    orderBy?: BackgroundRemovedOrderByWithRelationInput | BackgroundRemovedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BackgroundRemoveds.
     */
    cursor?: BackgroundRemovedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackgroundRemoveds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackgroundRemoveds.
     */
    skip?: number
    distinct?: BackgroundRemovedScalarFieldEnum | BackgroundRemovedScalarFieldEnum[]
  }

  /**
   * BackgroundRemoved create
   */
  export type BackgroundRemovedCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundRemoved
     */
    select?: BackgroundRemovedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackgroundRemoved
     */
    omit?: BackgroundRemovedOmit<ExtArgs> | null
    /**
     * The data needed to create a BackgroundRemoved.
     */
    data: XOR<BackgroundRemovedCreateInput, BackgroundRemovedUncheckedCreateInput>
  }

  /**
   * BackgroundRemoved createMany
   */
  export type BackgroundRemovedCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BackgroundRemoveds.
     */
    data: BackgroundRemovedCreateManyInput | BackgroundRemovedCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BackgroundRemoved createManyAndReturn
   */
  export type BackgroundRemovedCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundRemoved
     */
    select?: BackgroundRemovedSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BackgroundRemoved
     */
    omit?: BackgroundRemovedOmit<ExtArgs> | null
    /**
     * The data used to create many BackgroundRemoveds.
     */
    data: BackgroundRemovedCreateManyInput | BackgroundRemovedCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BackgroundRemoved update
   */
  export type BackgroundRemovedUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundRemoved
     */
    select?: BackgroundRemovedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackgroundRemoved
     */
    omit?: BackgroundRemovedOmit<ExtArgs> | null
    /**
     * The data needed to update a BackgroundRemoved.
     */
    data: XOR<BackgroundRemovedUpdateInput, BackgroundRemovedUncheckedUpdateInput>
    /**
     * Choose, which BackgroundRemoved to update.
     */
    where: BackgroundRemovedWhereUniqueInput
  }

  /**
   * BackgroundRemoved updateMany
   */
  export type BackgroundRemovedUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BackgroundRemoveds.
     */
    data: XOR<BackgroundRemovedUpdateManyMutationInput, BackgroundRemovedUncheckedUpdateManyInput>
    /**
     * Filter which BackgroundRemoveds to update
     */
    where?: BackgroundRemovedWhereInput
    /**
     * Limit how many BackgroundRemoveds to update.
     */
    limit?: number
  }

  /**
   * BackgroundRemoved updateManyAndReturn
   */
  export type BackgroundRemovedUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundRemoved
     */
    select?: BackgroundRemovedSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BackgroundRemoved
     */
    omit?: BackgroundRemovedOmit<ExtArgs> | null
    /**
     * The data used to update BackgroundRemoveds.
     */
    data: XOR<BackgroundRemovedUpdateManyMutationInput, BackgroundRemovedUncheckedUpdateManyInput>
    /**
     * Filter which BackgroundRemoveds to update
     */
    where?: BackgroundRemovedWhereInput
    /**
     * Limit how many BackgroundRemoveds to update.
     */
    limit?: number
  }

  /**
   * BackgroundRemoved upsert
   */
  export type BackgroundRemovedUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundRemoved
     */
    select?: BackgroundRemovedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackgroundRemoved
     */
    omit?: BackgroundRemovedOmit<ExtArgs> | null
    /**
     * The filter to search for the BackgroundRemoved to update in case it exists.
     */
    where: BackgroundRemovedWhereUniqueInput
    /**
     * In case the BackgroundRemoved found by the `where` argument doesn't exist, create a new BackgroundRemoved with this data.
     */
    create: XOR<BackgroundRemovedCreateInput, BackgroundRemovedUncheckedCreateInput>
    /**
     * In case the BackgroundRemoved was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BackgroundRemovedUpdateInput, BackgroundRemovedUncheckedUpdateInput>
  }

  /**
   * BackgroundRemoved delete
   */
  export type BackgroundRemovedDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundRemoved
     */
    select?: BackgroundRemovedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackgroundRemoved
     */
    omit?: BackgroundRemovedOmit<ExtArgs> | null
    /**
     * Filter which BackgroundRemoved to delete.
     */
    where: BackgroundRemovedWhereUniqueInput
  }

  /**
   * BackgroundRemoved deleteMany
   */
  export type BackgroundRemovedDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BackgroundRemoveds to delete
     */
    where?: BackgroundRemovedWhereInput
    /**
     * Limit how many BackgroundRemoveds to delete.
     */
    limit?: number
  }

  /**
   * BackgroundRemoved without action
   */
  export type BackgroundRemovedDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundRemoved
     */
    select?: BackgroundRemovedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackgroundRemoved
     */
    omit?: BackgroundRemovedOmit<ExtArgs> | null
  }


  /**
   * Model UserResult
   */

  export type AggregateUserResult = {
    _count: UserResultCountAggregateOutputType | null
    _min: UserResultMinAggregateOutputType | null
    _max: UserResultMaxAggregateOutputType | null
  }

  export type UserResultMinAggregateOutputType = {
    id: string | null
    userId: string | null
    path: string | null
    sourceUploadId: string | null
    createdAt: Date | null
  }

  export type UserResultMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    path: string | null
    sourceUploadId: string | null
    createdAt: Date | null
  }

  export type UserResultCountAggregateOutputType = {
    id: number
    userId: number
    path: number
    sourceUploadId: number
    createdAt: number
    _all: number
  }


  export type UserResultMinAggregateInputType = {
    id?: true
    userId?: true
    path?: true
    sourceUploadId?: true
    createdAt?: true
  }

  export type UserResultMaxAggregateInputType = {
    id?: true
    userId?: true
    path?: true
    sourceUploadId?: true
    createdAt?: true
  }

  export type UserResultCountAggregateInputType = {
    id?: true
    userId?: true
    path?: true
    sourceUploadId?: true
    createdAt?: true
    _all?: true
  }

  export type UserResultAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserResult to aggregate.
     */
    where?: UserResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserResults to fetch.
     */
    orderBy?: UserResultOrderByWithRelationInput | UserResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserResults
    **/
    _count?: true | UserResultCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserResultMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserResultMaxAggregateInputType
  }

  export type GetUserResultAggregateType<T extends UserResultAggregateArgs> = {
        [P in keyof T & keyof AggregateUserResult]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserResult[P]>
      : GetScalarType<T[P], AggregateUserResult[P]>
  }




  export type UserResultGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserResultWhereInput
    orderBy?: UserResultOrderByWithAggregationInput | UserResultOrderByWithAggregationInput[]
    by: UserResultScalarFieldEnum[] | UserResultScalarFieldEnum
    having?: UserResultScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserResultCountAggregateInputType | true
    _min?: UserResultMinAggregateInputType
    _max?: UserResultMaxAggregateInputType
  }

  export type UserResultGroupByOutputType = {
    id: string
    userId: string
    path: string
    sourceUploadId: string | null
    createdAt: Date
    _count: UserResultCountAggregateOutputType | null
    _min: UserResultMinAggregateOutputType | null
    _max: UserResultMaxAggregateOutputType | null
  }

  type GetUserResultGroupByPayload<T extends UserResultGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserResultGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserResultGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserResultGroupByOutputType[P]>
            : GetScalarType<T[P], UserResultGroupByOutputType[P]>
        }
      >
    >


  export type UserResultSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    path?: boolean
    sourceUploadId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["userResult"]>

  export type UserResultSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    path?: boolean
    sourceUploadId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["userResult"]>

  export type UserResultSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    path?: boolean
    sourceUploadId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["userResult"]>

  export type UserResultSelectScalar = {
    id?: boolean
    userId?: boolean
    path?: boolean
    sourceUploadId?: boolean
    createdAt?: boolean
  }

  export type UserResultOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "path" | "sourceUploadId" | "createdAt", ExtArgs["result"]["userResult"]>

  export type $UserResultPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserResult"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      path: string
      sourceUploadId: string | null
      createdAt: Date
    }, ExtArgs["result"]["userResult"]>
    composites: {}
  }

  type UserResultGetPayload<S extends boolean | null | undefined | UserResultDefaultArgs> = $Result.GetResult<Prisma.$UserResultPayload, S>

  type UserResultCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserResultFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserResultCountAggregateInputType | true
    }

  export interface UserResultDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserResult'], meta: { name: 'UserResult' } }
    /**
     * Find zero or one UserResult that matches the filter.
     * @param {UserResultFindUniqueArgs} args - Arguments to find a UserResult
     * @example
     * // Get one UserResult
     * const userResult = await prisma.userResult.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserResultFindUniqueArgs>(args: SelectSubset<T, UserResultFindUniqueArgs<ExtArgs>>): Prisma__UserResultClient<$Result.GetResult<Prisma.$UserResultPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserResult that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserResultFindUniqueOrThrowArgs} args - Arguments to find a UserResult
     * @example
     * // Get one UserResult
     * const userResult = await prisma.userResult.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserResultFindUniqueOrThrowArgs>(args: SelectSubset<T, UserResultFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserResultClient<$Result.GetResult<Prisma.$UserResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserResult that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserResultFindFirstArgs} args - Arguments to find a UserResult
     * @example
     * // Get one UserResult
     * const userResult = await prisma.userResult.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserResultFindFirstArgs>(args?: SelectSubset<T, UserResultFindFirstArgs<ExtArgs>>): Prisma__UserResultClient<$Result.GetResult<Prisma.$UserResultPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserResult that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserResultFindFirstOrThrowArgs} args - Arguments to find a UserResult
     * @example
     * // Get one UserResult
     * const userResult = await prisma.userResult.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserResultFindFirstOrThrowArgs>(args?: SelectSubset<T, UserResultFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserResultClient<$Result.GetResult<Prisma.$UserResultPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserResults that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserResultFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserResults
     * const userResults = await prisma.userResult.findMany()
     * 
     * // Get first 10 UserResults
     * const userResults = await prisma.userResult.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userResultWithIdOnly = await prisma.userResult.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserResultFindManyArgs>(args?: SelectSubset<T, UserResultFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserResult.
     * @param {UserResultCreateArgs} args - Arguments to create a UserResult.
     * @example
     * // Create one UserResult
     * const UserResult = await prisma.userResult.create({
     *   data: {
     *     // ... data to create a UserResult
     *   }
     * })
     * 
     */
    create<T extends UserResultCreateArgs>(args: SelectSubset<T, UserResultCreateArgs<ExtArgs>>): Prisma__UserResultClient<$Result.GetResult<Prisma.$UserResultPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserResults.
     * @param {UserResultCreateManyArgs} args - Arguments to create many UserResults.
     * @example
     * // Create many UserResults
     * const userResult = await prisma.userResult.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserResultCreateManyArgs>(args?: SelectSubset<T, UserResultCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserResults and returns the data saved in the database.
     * @param {UserResultCreateManyAndReturnArgs} args - Arguments to create many UserResults.
     * @example
     * // Create many UserResults
     * const userResult = await prisma.userResult.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserResults and only return the `id`
     * const userResultWithIdOnly = await prisma.userResult.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserResultCreateManyAndReturnArgs>(args?: SelectSubset<T, UserResultCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserResultPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserResult.
     * @param {UserResultDeleteArgs} args - Arguments to delete one UserResult.
     * @example
     * // Delete one UserResult
     * const UserResult = await prisma.userResult.delete({
     *   where: {
     *     // ... filter to delete one UserResult
     *   }
     * })
     * 
     */
    delete<T extends UserResultDeleteArgs>(args: SelectSubset<T, UserResultDeleteArgs<ExtArgs>>): Prisma__UserResultClient<$Result.GetResult<Prisma.$UserResultPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserResult.
     * @param {UserResultUpdateArgs} args - Arguments to update one UserResult.
     * @example
     * // Update one UserResult
     * const userResult = await prisma.userResult.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserResultUpdateArgs>(args: SelectSubset<T, UserResultUpdateArgs<ExtArgs>>): Prisma__UserResultClient<$Result.GetResult<Prisma.$UserResultPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserResults.
     * @param {UserResultDeleteManyArgs} args - Arguments to filter UserResults to delete.
     * @example
     * // Delete a few UserResults
     * const { count } = await prisma.userResult.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserResultDeleteManyArgs>(args?: SelectSubset<T, UserResultDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserResultUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserResults
     * const userResult = await prisma.userResult.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserResultUpdateManyArgs>(args: SelectSubset<T, UserResultUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserResults and returns the data updated in the database.
     * @param {UserResultUpdateManyAndReturnArgs} args - Arguments to update many UserResults.
     * @example
     * // Update many UserResults
     * const userResult = await prisma.userResult.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserResults and only return the `id`
     * const userResultWithIdOnly = await prisma.userResult.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserResultUpdateManyAndReturnArgs>(args: SelectSubset<T, UserResultUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserResultPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserResult.
     * @param {UserResultUpsertArgs} args - Arguments to update or create a UserResult.
     * @example
     * // Update or create a UserResult
     * const userResult = await prisma.userResult.upsert({
     *   create: {
     *     // ... data to create a UserResult
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserResult we want to update
     *   }
     * })
     */
    upsert<T extends UserResultUpsertArgs>(args: SelectSubset<T, UserResultUpsertArgs<ExtArgs>>): Prisma__UserResultClient<$Result.GetResult<Prisma.$UserResultPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserResultCountArgs} args - Arguments to filter UserResults to count.
     * @example
     * // Count the number of UserResults
     * const count = await prisma.userResult.count({
     *   where: {
     *     // ... the filter for the UserResults we want to count
     *   }
     * })
    **/
    count<T extends UserResultCountArgs>(
      args?: Subset<T, UserResultCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserResultCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserResultAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserResultAggregateArgs>(args: Subset<T, UserResultAggregateArgs>): Prisma.PrismaPromise<GetUserResultAggregateType<T>>

    /**
     * Group by UserResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserResultGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserResultGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserResultGroupByArgs['orderBy'] }
        : { orderBy?: UserResultGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserResultGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserResultGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserResult model
   */
  readonly fields: UserResultFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserResult.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserResultClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserResult model
   */
  interface UserResultFieldRefs {
    readonly id: FieldRef<"UserResult", 'String'>
    readonly userId: FieldRef<"UserResult", 'String'>
    readonly path: FieldRef<"UserResult", 'String'>
    readonly sourceUploadId: FieldRef<"UserResult", 'String'>
    readonly createdAt: FieldRef<"UserResult", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserResult findUnique
   */
  export type UserResultFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserResult
     */
    select?: UserResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserResult
     */
    omit?: UserResultOmit<ExtArgs> | null
    /**
     * Filter, which UserResult to fetch.
     */
    where: UserResultWhereUniqueInput
  }

  /**
   * UserResult findUniqueOrThrow
   */
  export type UserResultFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserResult
     */
    select?: UserResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserResult
     */
    omit?: UserResultOmit<ExtArgs> | null
    /**
     * Filter, which UserResult to fetch.
     */
    where: UserResultWhereUniqueInput
  }

  /**
   * UserResult findFirst
   */
  export type UserResultFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserResult
     */
    select?: UserResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserResult
     */
    omit?: UserResultOmit<ExtArgs> | null
    /**
     * Filter, which UserResult to fetch.
     */
    where?: UserResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserResults to fetch.
     */
    orderBy?: UserResultOrderByWithRelationInput | UserResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserResults.
     */
    cursor?: UserResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserResults.
     */
    distinct?: UserResultScalarFieldEnum | UserResultScalarFieldEnum[]
  }

  /**
   * UserResult findFirstOrThrow
   */
  export type UserResultFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserResult
     */
    select?: UserResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserResult
     */
    omit?: UserResultOmit<ExtArgs> | null
    /**
     * Filter, which UserResult to fetch.
     */
    where?: UserResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserResults to fetch.
     */
    orderBy?: UserResultOrderByWithRelationInput | UserResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserResults.
     */
    cursor?: UserResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserResults.
     */
    distinct?: UserResultScalarFieldEnum | UserResultScalarFieldEnum[]
  }

  /**
   * UserResult findMany
   */
  export type UserResultFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserResult
     */
    select?: UserResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserResult
     */
    omit?: UserResultOmit<ExtArgs> | null
    /**
     * Filter, which UserResults to fetch.
     */
    where?: UserResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserResults to fetch.
     */
    orderBy?: UserResultOrderByWithRelationInput | UserResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserResults.
     */
    cursor?: UserResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserResults.
     */
    skip?: number
    distinct?: UserResultScalarFieldEnum | UserResultScalarFieldEnum[]
  }

  /**
   * UserResult create
   */
  export type UserResultCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserResult
     */
    select?: UserResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserResult
     */
    omit?: UserResultOmit<ExtArgs> | null
    /**
     * The data needed to create a UserResult.
     */
    data: XOR<UserResultCreateInput, UserResultUncheckedCreateInput>
  }

  /**
   * UserResult createMany
   */
  export type UserResultCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserResults.
     */
    data: UserResultCreateManyInput | UserResultCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserResult createManyAndReturn
   */
  export type UserResultCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserResult
     */
    select?: UserResultSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserResult
     */
    omit?: UserResultOmit<ExtArgs> | null
    /**
     * The data used to create many UserResults.
     */
    data: UserResultCreateManyInput | UserResultCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserResult update
   */
  export type UserResultUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserResult
     */
    select?: UserResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserResult
     */
    omit?: UserResultOmit<ExtArgs> | null
    /**
     * The data needed to update a UserResult.
     */
    data: XOR<UserResultUpdateInput, UserResultUncheckedUpdateInput>
    /**
     * Choose, which UserResult to update.
     */
    where: UserResultWhereUniqueInput
  }

  /**
   * UserResult updateMany
   */
  export type UserResultUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserResults.
     */
    data: XOR<UserResultUpdateManyMutationInput, UserResultUncheckedUpdateManyInput>
    /**
     * Filter which UserResults to update
     */
    where?: UserResultWhereInput
    /**
     * Limit how many UserResults to update.
     */
    limit?: number
  }

  /**
   * UserResult updateManyAndReturn
   */
  export type UserResultUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserResult
     */
    select?: UserResultSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserResult
     */
    omit?: UserResultOmit<ExtArgs> | null
    /**
     * The data used to update UserResults.
     */
    data: XOR<UserResultUpdateManyMutationInput, UserResultUncheckedUpdateManyInput>
    /**
     * Filter which UserResults to update
     */
    where?: UserResultWhereInput
    /**
     * Limit how many UserResults to update.
     */
    limit?: number
  }

  /**
   * UserResult upsert
   */
  export type UserResultUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserResult
     */
    select?: UserResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserResult
     */
    omit?: UserResultOmit<ExtArgs> | null
    /**
     * The filter to search for the UserResult to update in case it exists.
     */
    where: UserResultWhereUniqueInput
    /**
     * In case the UserResult found by the `where` argument doesn't exist, create a new UserResult with this data.
     */
    create: XOR<UserResultCreateInput, UserResultUncheckedCreateInput>
    /**
     * In case the UserResult was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserResultUpdateInput, UserResultUncheckedUpdateInput>
  }

  /**
   * UserResult delete
   */
  export type UserResultDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserResult
     */
    select?: UserResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserResult
     */
    omit?: UserResultOmit<ExtArgs> | null
    /**
     * Filter which UserResult to delete.
     */
    where: UserResultWhereUniqueInput
  }

  /**
   * UserResult deleteMany
   */
  export type UserResultDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserResults to delete
     */
    where?: UserResultWhereInput
    /**
     * Limit how many UserResults to delete.
     */
    limit?: number
  }

  /**
   * UserResult without action
   */
  export type UserResultDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserResult
     */
    select?: UserResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserResult
     */
    omit?: UserResultOmit<ExtArgs> | null
  }


  /**
   * Model SocialSubmission
   */

  export type AggregateSocialSubmission = {
    _count: SocialSubmissionCountAggregateOutputType | null
    _avg: SocialSubmissionAvgAggregateOutputType | null
    _sum: SocialSubmissionSumAggregateOutputType | null
    _min: SocialSubmissionMinAggregateOutputType | null
    _max: SocialSubmissionMaxAggregateOutputType | null
  }

  export type SocialSubmissionAvgAggregateOutputType = {
    likes: number | null
    comments: number | null
    shares: number | null
    bestEngagementTotal: number | null
    creditAwarded: number | null
    creditPenalty: number | null
    rescanCount: number | null
  }

  export type SocialSubmissionSumAggregateOutputType = {
    likes: number | null
    comments: number | null
    shares: number | null
    bestEngagementTotal: number | null
    creditAwarded: number | null
    creditPenalty: number | null
    rescanCount: number | null
  }

  export type SocialSubmissionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    platform: $Enums.SocialPlatform | null
    originalUrl: string | null
    urlNormalized: string | null
    status: $Enums.SocialSubmissionStatus | null
    postText: string | null
    likes: number | null
    comments: number | null
    shares: number | null
    bestEngagementTotal: number | null
    creditAwarded: number | null
    creditPenalty: number | null
    rescanCount: number | null
    verifiedAt: Date | null
    lastAttemptAt: Date | null
    errorMessage: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SocialSubmissionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    platform: $Enums.SocialPlatform | null
    originalUrl: string | null
    urlNormalized: string | null
    status: $Enums.SocialSubmissionStatus | null
    postText: string | null
    likes: number | null
    comments: number | null
    shares: number | null
    bestEngagementTotal: number | null
    creditAwarded: number | null
    creditPenalty: number | null
    rescanCount: number | null
    verifiedAt: Date | null
    lastAttemptAt: Date | null
    errorMessage: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SocialSubmissionCountAggregateOutputType = {
    id: number
    userId: number
    platform: number
    originalUrl: number
    urlNormalized: number
    status: number
    requiredKeywords: number
    missingKeywords: number
    matchedKeywords: number
    postText: number
    likes: number
    comments: number
    shares: number
    bestEngagementTotal: number
    creditAwarded: number
    creditPenalty: number
    rescanCount: number
    verifiedAt: number
    lastAttemptAt: number
    errorMessage: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SocialSubmissionAvgAggregateInputType = {
    likes?: true
    comments?: true
    shares?: true
    bestEngagementTotal?: true
    creditAwarded?: true
    creditPenalty?: true
    rescanCount?: true
  }

  export type SocialSubmissionSumAggregateInputType = {
    likes?: true
    comments?: true
    shares?: true
    bestEngagementTotal?: true
    creditAwarded?: true
    creditPenalty?: true
    rescanCount?: true
  }

  export type SocialSubmissionMinAggregateInputType = {
    id?: true
    userId?: true
    platform?: true
    originalUrl?: true
    urlNormalized?: true
    status?: true
    postText?: true
    likes?: true
    comments?: true
    shares?: true
    bestEngagementTotal?: true
    creditAwarded?: true
    creditPenalty?: true
    rescanCount?: true
    verifiedAt?: true
    lastAttemptAt?: true
    errorMessage?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SocialSubmissionMaxAggregateInputType = {
    id?: true
    userId?: true
    platform?: true
    originalUrl?: true
    urlNormalized?: true
    status?: true
    postText?: true
    likes?: true
    comments?: true
    shares?: true
    bestEngagementTotal?: true
    creditAwarded?: true
    creditPenalty?: true
    rescanCount?: true
    verifiedAt?: true
    lastAttemptAt?: true
    errorMessage?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SocialSubmissionCountAggregateInputType = {
    id?: true
    userId?: true
    platform?: true
    originalUrl?: true
    urlNormalized?: true
    status?: true
    requiredKeywords?: true
    missingKeywords?: true
    matchedKeywords?: true
    postText?: true
    likes?: true
    comments?: true
    shares?: true
    bestEngagementTotal?: true
    creditAwarded?: true
    creditPenalty?: true
    rescanCount?: true
    verifiedAt?: true
    lastAttemptAt?: true
    errorMessage?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SocialSubmissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SocialSubmission to aggregate.
     */
    where?: SocialSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SocialSubmissions to fetch.
     */
    orderBy?: SocialSubmissionOrderByWithRelationInput | SocialSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SocialSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SocialSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SocialSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SocialSubmissions
    **/
    _count?: true | SocialSubmissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SocialSubmissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SocialSubmissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SocialSubmissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SocialSubmissionMaxAggregateInputType
  }

  export type GetSocialSubmissionAggregateType<T extends SocialSubmissionAggregateArgs> = {
        [P in keyof T & keyof AggregateSocialSubmission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSocialSubmission[P]>
      : GetScalarType<T[P], AggregateSocialSubmission[P]>
  }




  export type SocialSubmissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SocialSubmissionWhereInput
    orderBy?: SocialSubmissionOrderByWithAggregationInput | SocialSubmissionOrderByWithAggregationInput[]
    by: SocialSubmissionScalarFieldEnum[] | SocialSubmissionScalarFieldEnum
    having?: SocialSubmissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SocialSubmissionCountAggregateInputType | true
    _avg?: SocialSubmissionAvgAggregateInputType
    _sum?: SocialSubmissionSumAggregateInputType
    _min?: SocialSubmissionMinAggregateInputType
    _max?: SocialSubmissionMaxAggregateInputType
  }

  export type SocialSubmissionGroupByOutputType = {
    id: string
    userId: string
    platform: $Enums.SocialPlatform
    originalUrl: string
    urlNormalized: string
    status: $Enums.SocialSubmissionStatus
    requiredKeywords: string[]
    missingKeywords: string[]
    matchedKeywords: string[]
    postText: string | null
    likes: number
    comments: number
    shares: number
    bestEngagementTotal: number
    creditAwarded: number
    creditPenalty: number
    rescanCount: number
    verifiedAt: Date | null
    lastAttemptAt: Date | null
    errorMessage: string | null
    createdAt: Date
    updatedAt: Date
    _count: SocialSubmissionCountAggregateOutputType | null
    _avg: SocialSubmissionAvgAggregateOutputType | null
    _sum: SocialSubmissionSumAggregateOutputType | null
    _min: SocialSubmissionMinAggregateOutputType | null
    _max: SocialSubmissionMaxAggregateOutputType | null
  }

  type GetSocialSubmissionGroupByPayload<T extends SocialSubmissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SocialSubmissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SocialSubmissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SocialSubmissionGroupByOutputType[P]>
            : GetScalarType<T[P], SocialSubmissionGroupByOutputType[P]>
        }
      >
    >


  export type SocialSubmissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    platform?: boolean
    originalUrl?: boolean
    urlNormalized?: boolean
    status?: boolean
    requiredKeywords?: boolean
    missingKeywords?: boolean
    matchedKeywords?: boolean
    postText?: boolean
    likes?: boolean
    comments?: boolean
    shares?: boolean
    bestEngagementTotal?: boolean
    creditAwarded?: boolean
    creditPenalty?: boolean
    rescanCount?: boolean
    verifiedAt?: boolean
    lastAttemptAt?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["socialSubmission"]>

  export type SocialSubmissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    platform?: boolean
    originalUrl?: boolean
    urlNormalized?: boolean
    status?: boolean
    requiredKeywords?: boolean
    missingKeywords?: boolean
    matchedKeywords?: boolean
    postText?: boolean
    likes?: boolean
    comments?: boolean
    shares?: boolean
    bestEngagementTotal?: boolean
    creditAwarded?: boolean
    creditPenalty?: boolean
    rescanCount?: boolean
    verifiedAt?: boolean
    lastAttemptAt?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["socialSubmission"]>

  export type SocialSubmissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    platform?: boolean
    originalUrl?: boolean
    urlNormalized?: boolean
    status?: boolean
    requiredKeywords?: boolean
    missingKeywords?: boolean
    matchedKeywords?: boolean
    postText?: boolean
    likes?: boolean
    comments?: boolean
    shares?: boolean
    bestEngagementTotal?: boolean
    creditAwarded?: boolean
    creditPenalty?: boolean
    rescanCount?: boolean
    verifiedAt?: boolean
    lastAttemptAt?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["socialSubmission"]>

  export type SocialSubmissionSelectScalar = {
    id?: boolean
    userId?: boolean
    platform?: boolean
    originalUrl?: boolean
    urlNormalized?: boolean
    status?: boolean
    requiredKeywords?: boolean
    missingKeywords?: boolean
    matchedKeywords?: boolean
    postText?: boolean
    likes?: boolean
    comments?: boolean
    shares?: boolean
    bestEngagementTotal?: boolean
    creditAwarded?: boolean
    creditPenalty?: boolean
    rescanCount?: boolean
    verifiedAt?: boolean
    lastAttemptAt?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SocialSubmissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "platform" | "originalUrl" | "urlNormalized" | "status" | "requiredKeywords" | "missingKeywords" | "matchedKeywords" | "postText" | "likes" | "comments" | "shares" | "bestEngagementTotal" | "creditAwarded" | "creditPenalty" | "rescanCount" | "verifiedAt" | "lastAttemptAt" | "errorMessage" | "createdAt" | "updatedAt", ExtArgs["result"]["socialSubmission"]>

  export type $SocialSubmissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SocialSubmission"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      platform: $Enums.SocialPlatform
      originalUrl: string
      urlNormalized: string
      status: $Enums.SocialSubmissionStatus
      requiredKeywords: string[]
      missingKeywords: string[]
      matchedKeywords: string[]
      postText: string | null
      likes: number
      comments: number
      shares: number
      bestEngagementTotal: number
      creditAwarded: number
      creditPenalty: number
      rescanCount: number
      verifiedAt: Date | null
      lastAttemptAt: Date | null
      errorMessage: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["socialSubmission"]>
    composites: {}
  }

  type SocialSubmissionGetPayload<S extends boolean | null | undefined | SocialSubmissionDefaultArgs> = $Result.GetResult<Prisma.$SocialSubmissionPayload, S>

  type SocialSubmissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SocialSubmissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SocialSubmissionCountAggregateInputType | true
    }

  export interface SocialSubmissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SocialSubmission'], meta: { name: 'SocialSubmission' } }
    /**
     * Find zero or one SocialSubmission that matches the filter.
     * @param {SocialSubmissionFindUniqueArgs} args - Arguments to find a SocialSubmission
     * @example
     * // Get one SocialSubmission
     * const socialSubmission = await prisma.socialSubmission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SocialSubmissionFindUniqueArgs>(args: SelectSubset<T, SocialSubmissionFindUniqueArgs<ExtArgs>>): Prisma__SocialSubmissionClient<$Result.GetResult<Prisma.$SocialSubmissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SocialSubmission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SocialSubmissionFindUniqueOrThrowArgs} args - Arguments to find a SocialSubmission
     * @example
     * // Get one SocialSubmission
     * const socialSubmission = await prisma.socialSubmission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SocialSubmissionFindUniqueOrThrowArgs>(args: SelectSubset<T, SocialSubmissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SocialSubmissionClient<$Result.GetResult<Prisma.$SocialSubmissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SocialSubmission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialSubmissionFindFirstArgs} args - Arguments to find a SocialSubmission
     * @example
     * // Get one SocialSubmission
     * const socialSubmission = await prisma.socialSubmission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SocialSubmissionFindFirstArgs>(args?: SelectSubset<T, SocialSubmissionFindFirstArgs<ExtArgs>>): Prisma__SocialSubmissionClient<$Result.GetResult<Prisma.$SocialSubmissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SocialSubmission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialSubmissionFindFirstOrThrowArgs} args - Arguments to find a SocialSubmission
     * @example
     * // Get one SocialSubmission
     * const socialSubmission = await prisma.socialSubmission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SocialSubmissionFindFirstOrThrowArgs>(args?: SelectSubset<T, SocialSubmissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SocialSubmissionClient<$Result.GetResult<Prisma.$SocialSubmissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SocialSubmissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialSubmissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SocialSubmissions
     * const socialSubmissions = await prisma.socialSubmission.findMany()
     * 
     * // Get first 10 SocialSubmissions
     * const socialSubmissions = await prisma.socialSubmission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const socialSubmissionWithIdOnly = await prisma.socialSubmission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SocialSubmissionFindManyArgs>(args?: SelectSubset<T, SocialSubmissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SocialSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SocialSubmission.
     * @param {SocialSubmissionCreateArgs} args - Arguments to create a SocialSubmission.
     * @example
     * // Create one SocialSubmission
     * const SocialSubmission = await prisma.socialSubmission.create({
     *   data: {
     *     // ... data to create a SocialSubmission
     *   }
     * })
     * 
     */
    create<T extends SocialSubmissionCreateArgs>(args: SelectSubset<T, SocialSubmissionCreateArgs<ExtArgs>>): Prisma__SocialSubmissionClient<$Result.GetResult<Prisma.$SocialSubmissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SocialSubmissions.
     * @param {SocialSubmissionCreateManyArgs} args - Arguments to create many SocialSubmissions.
     * @example
     * // Create many SocialSubmissions
     * const socialSubmission = await prisma.socialSubmission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SocialSubmissionCreateManyArgs>(args?: SelectSubset<T, SocialSubmissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SocialSubmissions and returns the data saved in the database.
     * @param {SocialSubmissionCreateManyAndReturnArgs} args - Arguments to create many SocialSubmissions.
     * @example
     * // Create many SocialSubmissions
     * const socialSubmission = await prisma.socialSubmission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SocialSubmissions and only return the `id`
     * const socialSubmissionWithIdOnly = await prisma.socialSubmission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SocialSubmissionCreateManyAndReturnArgs>(args?: SelectSubset<T, SocialSubmissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SocialSubmissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SocialSubmission.
     * @param {SocialSubmissionDeleteArgs} args - Arguments to delete one SocialSubmission.
     * @example
     * // Delete one SocialSubmission
     * const SocialSubmission = await prisma.socialSubmission.delete({
     *   where: {
     *     // ... filter to delete one SocialSubmission
     *   }
     * })
     * 
     */
    delete<T extends SocialSubmissionDeleteArgs>(args: SelectSubset<T, SocialSubmissionDeleteArgs<ExtArgs>>): Prisma__SocialSubmissionClient<$Result.GetResult<Prisma.$SocialSubmissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SocialSubmission.
     * @param {SocialSubmissionUpdateArgs} args - Arguments to update one SocialSubmission.
     * @example
     * // Update one SocialSubmission
     * const socialSubmission = await prisma.socialSubmission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SocialSubmissionUpdateArgs>(args: SelectSubset<T, SocialSubmissionUpdateArgs<ExtArgs>>): Prisma__SocialSubmissionClient<$Result.GetResult<Prisma.$SocialSubmissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SocialSubmissions.
     * @param {SocialSubmissionDeleteManyArgs} args - Arguments to filter SocialSubmissions to delete.
     * @example
     * // Delete a few SocialSubmissions
     * const { count } = await prisma.socialSubmission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SocialSubmissionDeleteManyArgs>(args?: SelectSubset<T, SocialSubmissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SocialSubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialSubmissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SocialSubmissions
     * const socialSubmission = await prisma.socialSubmission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SocialSubmissionUpdateManyArgs>(args: SelectSubset<T, SocialSubmissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SocialSubmissions and returns the data updated in the database.
     * @param {SocialSubmissionUpdateManyAndReturnArgs} args - Arguments to update many SocialSubmissions.
     * @example
     * // Update many SocialSubmissions
     * const socialSubmission = await prisma.socialSubmission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SocialSubmissions and only return the `id`
     * const socialSubmissionWithIdOnly = await prisma.socialSubmission.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SocialSubmissionUpdateManyAndReturnArgs>(args: SelectSubset<T, SocialSubmissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SocialSubmissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SocialSubmission.
     * @param {SocialSubmissionUpsertArgs} args - Arguments to update or create a SocialSubmission.
     * @example
     * // Update or create a SocialSubmission
     * const socialSubmission = await prisma.socialSubmission.upsert({
     *   create: {
     *     // ... data to create a SocialSubmission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SocialSubmission we want to update
     *   }
     * })
     */
    upsert<T extends SocialSubmissionUpsertArgs>(args: SelectSubset<T, SocialSubmissionUpsertArgs<ExtArgs>>): Prisma__SocialSubmissionClient<$Result.GetResult<Prisma.$SocialSubmissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SocialSubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialSubmissionCountArgs} args - Arguments to filter SocialSubmissions to count.
     * @example
     * // Count the number of SocialSubmissions
     * const count = await prisma.socialSubmission.count({
     *   where: {
     *     // ... the filter for the SocialSubmissions we want to count
     *   }
     * })
    **/
    count<T extends SocialSubmissionCountArgs>(
      args?: Subset<T, SocialSubmissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SocialSubmissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SocialSubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialSubmissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SocialSubmissionAggregateArgs>(args: Subset<T, SocialSubmissionAggregateArgs>): Prisma.PrismaPromise<GetSocialSubmissionAggregateType<T>>

    /**
     * Group by SocialSubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialSubmissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SocialSubmissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SocialSubmissionGroupByArgs['orderBy'] }
        : { orderBy?: SocialSubmissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SocialSubmissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSocialSubmissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SocialSubmission model
   */
  readonly fields: SocialSubmissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SocialSubmission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SocialSubmissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SocialSubmission model
   */
  interface SocialSubmissionFieldRefs {
    readonly id: FieldRef<"SocialSubmission", 'String'>
    readonly userId: FieldRef<"SocialSubmission", 'String'>
    readonly platform: FieldRef<"SocialSubmission", 'SocialPlatform'>
    readonly originalUrl: FieldRef<"SocialSubmission", 'String'>
    readonly urlNormalized: FieldRef<"SocialSubmission", 'String'>
    readonly status: FieldRef<"SocialSubmission", 'SocialSubmissionStatus'>
    readonly requiredKeywords: FieldRef<"SocialSubmission", 'String[]'>
    readonly missingKeywords: FieldRef<"SocialSubmission", 'String[]'>
    readonly matchedKeywords: FieldRef<"SocialSubmission", 'String[]'>
    readonly postText: FieldRef<"SocialSubmission", 'String'>
    readonly likes: FieldRef<"SocialSubmission", 'Int'>
    readonly comments: FieldRef<"SocialSubmission", 'Int'>
    readonly shares: FieldRef<"SocialSubmission", 'Int'>
    readonly bestEngagementTotal: FieldRef<"SocialSubmission", 'Int'>
    readonly creditAwarded: FieldRef<"SocialSubmission", 'Int'>
    readonly creditPenalty: FieldRef<"SocialSubmission", 'Int'>
    readonly rescanCount: FieldRef<"SocialSubmission", 'Int'>
    readonly verifiedAt: FieldRef<"SocialSubmission", 'DateTime'>
    readonly lastAttemptAt: FieldRef<"SocialSubmission", 'DateTime'>
    readonly errorMessage: FieldRef<"SocialSubmission", 'String'>
    readonly createdAt: FieldRef<"SocialSubmission", 'DateTime'>
    readonly updatedAt: FieldRef<"SocialSubmission", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SocialSubmission findUnique
   */
  export type SocialSubmissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialSubmission
     */
    select?: SocialSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialSubmission
     */
    omit?: SocialSubmissionOmit<ExtArgs> | null
    /**
     * Filter, which SocialSubmission to fetch.
     */
    where: SocialSubmissionWhereUniqueInput
  }

  /**
   * SocialSubmission findUniqueOrThrow
   */
  export type SocialSubmissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialSubmission
     */
    select?: SocialSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialSubmission
     */
    omit?: SocialSubmissionOmit<ExtArgs> | null
    /**
     * Filter, which SocialSubmission to fetch.
     */
    where: SocialSubmissionWhereUniqueInput
  }

  /**
   * SocialSubmission findFirst
   */
  export type SocialSubmissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialSubmission
     */
    select?: SocialSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialSubmission
     */
    omit?: SocialSubmissionOmit<ExtArgs> | null
    /**
     * Filter, which SocialSubmission to fetch.
     */
    where?: SocialSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SocialSubmissions to fetch.
     */
    orderBy?: SocialSubmissionOrderByWithRelationInput | SocialSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SocialSubmissions.
     */
    cursor?: SocialSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SocialSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SocialSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SocialSubmissions.
     */
    distinct?: SocialSubmissionScalarFieldEnum | SocialSubmissionScalarFieldEnum[]
  }

  /**
   * SocialSubmission findFirstOrThrow
   */
  export type SocialSubmissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialSubmission
     */
    select?: SocialSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialSubmission
     */
    omit?: SocialSubmissionOmit<ExtArgs> | null
    /**
     * Filter, which SocialSubmission to fetch.
     */
    where?: SocialSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SocialSubmissions to fetch.
     */
    orderBy?: SocialSubmissionOrderByWithRelationInput | SocialSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SocialSubmissions.
     */
    cursor?: SocialSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SocialSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SocialSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SocialSubmissions.
     */
    distinct?: SocialSubmissionScalarFieldEnum | SocialSubmissionScalarFieldEnum[]
  }

  /**
   * SocialSubmission findMany
   */
  export type SocialSubmissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialSubmission
     */
    select?: SocialSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialSubmission
     */
    omit?: SocialSubmissionOmit<ExtArgs> | null
    /**
     * Filter, which SocialSubmissions to fetch.
     */
    where?: SocialSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SocialSubmissions to fetch.
     */
    orderBy?: SocialSubmissionOrderByWithRelationInput | SocialSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SocialSubmissions.
     */
    cursor?: SocialSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SocialSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SocialSubmissions.
     */
    skip?: number
    distinct?: SocialSubmissionScalarFieldEnum | SocialSubmissionScalarFieldEnum[]
  }

  /**
   * SocialSubmission create
   */
  export type SocialSubmissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialSubmission
     */
    select?: SocialSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialSubmission
     */
    omit?: SocialSubmissionOmit<ExtArgs> | null
    /**
     * The data needed to create a SocialSubmission.
     */
    data: XOR<SocialSubmissionCreateInput, SocialSubmissionUncheckedCreateInput>
  }

  /**
   * SocialSubmission createMany
   */
  export type SocialSubmissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SocialSubmissions.
     */
    data: SocialSubmissionCreateManyInput | SocialSubmissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SocialSubmission createManyAndReturn
   */
  export type SocialSubmissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialSubmission
     */
    select?: SocialSubmissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SocialSubmission
     */
    omit?: SocialSubmissionOmit<ExtArgs> | null
    /**
     * The data used to create many SocialSubmissions.
     */
    data: SocialSubmissionCreateManyInput | SocialSubmissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SocialSubmission update
   */
  export type SocialSubmissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialSubmission
     */
    select?: SocialSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialSubmission
     */
    omit?: SocialSubmissionOmit<ExtArgs> | null
    /**
     * The data needed to update a SocialSubmission.
     */
    data: XOR<SocialSubmissionUpdateInput, SocialSubmissionUncheckedUpdateInput>
    /**
     * Choose, which SocialSubmission to update.
     */
    where: SocialSubmissionWhereUniqueInput
  }

  /**
   * SocialSubmission updateMany
   */
  export type SocialSubmissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SocialSubmissions.
     */
    data: XOR<SocialSubmissionUpdateManyMutationInput, SocialSubmissionUncheckedUpdateManyInput>
    /**
     * Filter which SocialSubmissions to update
     */
    where?: SocialSubmissionWhereInput
    /**
     * Limit how many SocialSubmissions to update.
     */
    limit?: number
  }

  /**
   * SocialSubmission updateManyAndReturn
   */
  export type SocialSubmissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialSubmission
     */
    select?: SocialSubmissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SocialSubmission
     */
    omit?: SocialSubmissionOmit<ExtArgs> | null
    /**
     * The data used to update SocialSubmissions.
     */
    data: XOR<SocialSubmissionUpdateManyMutationInput, SocialSubmissionUncheckedUpdateManyInput>
    /**
     * Filter which SocialSubmissions to update
     */
    where?: SocialSubmissionWhereInput
    /**
     * Limit how many SocialSubmissions to update.
     */
    limit?: number
  }

  /**
   * SocialSubmission upsert
   */
  export type SocialSubmissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialSubmission
     */
    select?: SocialSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialSubmission
     */
    omit?: SocialSubmissionOmit<ExtArgs> | null
    /**
     * The filter to search for the SocialSubmission to update in case it exists.
     */
    where: SocialSubmissionWhereUniqueInput
    /**
     * In case the SocialSubmission found by the `where` argument doesn't exist, create a new SocialSubmission with this data.
     */
    create: XOR<SocialSubmissionCreateInput, SocialSubmissionUncheckedCreateInput>
    /**
     * In case the SocialSubmission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SocialSubmissionUpdateInput, SocialSubmissionUncheckedUpdateInput>
  }

  /**
   * SocialSubmission delete
   */
  export type SocialSubmissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialSubmission
     */
    select?: SocialSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialSubmission
     */
    omit?: SocialSubmissionOmit<ExtArgs> | null
    /**
     * Filter which SocialSubmission to delete.
     */
    where: SocialSubmissionWhereUniqueInput
  }

  /**
   * SocialSubmission deleteMany
   */
  export type SocialSubmissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SocialSubmissions to delete
     */
    where?: SocialSubmissionWhereInput
    /**
     * Limit how many SocialSubmissions to delete.
     */
    limit?: number
  }

  /**
   * SocialSubmission without action
   */
  export type SocialSubmissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialSubmission
     */
    select?: SocialSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialSubmission
     */
    omit?: SocialSubmissionOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    firstName: 'firstName',
    lastName: 'lastName',
    username: 'username',
    primaryEmailAddress: 'primaryEmailAddress',
    imageUrl: 'imageUrl',
    clerkUserProperties: 'clerkUserProperties',
    stripeCustomerId: 'stripeCustomerId',
    accessType: 'accessType',
    stripeUserProperties: 'stripeUserProperties',
    dailyAIcomments: 'dailyAIcomments',
    creditConsumed: 'creditConsumed',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const UserUploadScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    path: 'path',
    mime: 'mime',
    defaultStyle: 'defaultStyle',
    defaultBgColor: 'defaultBgColor',
    createdAt: 'createdAt'
  };

  export type UserUploadScalarFieldEnum = (typeof UserUploadScalarFieldEnum)[keyof typeof UserUploadScalarFieldEnum]


  export const BackgroundRemovedScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    sourceUploadId: 'sourceUploadId',
    path: 'path',
    createdAt: 'createdAt'
  };

  export type BackgroundRemovedScalarFieldEnum = (typeof BackgroundRemovedScalarFieldEnum)[keyof typeof BackgroundRemovedScalarFieldEnum]


  export const UserResultScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    path: 'path',
    sourceUploadId: 'sourceUploadId',
    createdAt: 'createdAt'
  };

  export type UserResultScalarFieldEnum = (typeof UserResultScalarFieldEnum)[keyof typeof UserResultScalarFieldEnum]


  export const SocialSubmissionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    platform: 'platform',
    originalUrl: 'originalUrl',
    urlNormalized: 'urlNormalized',
    status: 'status',
    requiredKeywords: 'requiredKeywords',
    missingKeywords: 'missingKeywords',
    matchedKeywords: 'matchedKeywords',
    postText: 'postText',
    likes: 'likes',
    comments: 'comments',
    shares: 'shares',
    bestEngagementTotal: 'bestEngagementTotal',
    creditAwarded: 'creditAwarded',
    creditPenalty: 'creditPenalty',
    rescanCount: 'rescanCount',
    verifiedAt: 'verifiedAt',
    lastAttemptAt: 'lastAttemptAt',
    errorMessage: 'errorMessage',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SocialSubmissionScalarFieldEnum = (typeof SocialSubmissionScalarFieldEnum)[keyof typeof SocialSubmissionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'AccessType'
   */
  export type EnumAccessTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccessType'>
    


  /**
   * Reference to a field of type 'AccessType[]'
   */
  export type ListEnumAccessTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccessType[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'SocialPlatform'
   */
  export type EnumSocialPlatformFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SocialPlatform'>
    


  /**
   * Reference to a field of type 'SocialPlatform[]'
   */
  export type ListEnumSocialPlatformFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SocialPlatform[]'>
    


  /**
   * Reference to a field of type 'SocialSubmissionStatus'
   */
  export type EnumSocialSubmissionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SocialSubmissionStatus'>
    


  /**
   * Reference to a field of type 'SocialSubmissionStatus[]'
   */
  export type ListEnumSocialSubmissionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SocialSubmissionStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    username?: StringNullableFilter<"User"> | string | null
    primaryEmailAddress?: StringFilter<"User"> | string
    imageUrl?: StringNullableFilter<"User"> | string | null
    clerkUserProperties?: JsonNullableFilter<"User">
    stripeCustomerId?: StringNullableFilter<"User"> | string | null
    accessType?: EnumAccessTypeFilter<"User"> | $Enums.AccessType
    stripeUserProperties?: JsonNullableFilter<"User">
    dailyAIcomments?: IntFilter<"User"> | number
    creditConsumed?: IntFilter<"User"> | number
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    primaryEmailAddress?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    clerkUserProperties?: SortOrderInput | SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    accessType?: SortOrder
    stripeUserProperties?: SortOrderInput | SortOrder
    dailyAIcomments?: SortOrder
    creditConsumed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    primaryEmailAddress?: string
    stripeCustomerId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    imageUrl?: StringNullableFilter<"User"> | string | null
    clerkUserProperties?: JsonNullableFilter<"User">
    accessType?: EnumAccessTypeFilter<"User"> | $Enums.AccessType
    stripeUserProperties?: JsonNullableFilter<"User">
    dailyAIcomments?: IntFilter<"User"> | number
    creditConsumed?: IntFilter<"User"> | number
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }, "id" | "username" | "primaryEmailAddress" | "stripeCustomerId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    primaryEmailAddress?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    clerkUserProperties?: SortOrderInput | SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    accessType?: SortOrder
    stripeUserProperties?: SortOrderInput | SortOrder
    dailyAIcomments?: SortOrder
    creditConsumed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    firstName?: StringNullableWithAggregatesFilter<"User"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"User"> | string | null
    username?: StringNullableWithAggregatesFilter<"User"> | string | null
    primaryEmailAddress?: StringWithAggregatesFilter<"User"> | string
    imageUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    clerkUserProperties?: JsonNullableWithAggregatesFilter<"User">
    stripeCustomerId?: StringNullableWithAggregatesFilter<"User"> | string | null
    accessType?: EnumAccessTypeWithAggregatesFilter<"User"> | $Enums.AccessType
    stripeUserProperties?: JsonNullableWithAggregatesFilter<"User">
    dailyAIcomments?: IntWithAggregatesFilter<"User"> | number
    creditConsumed?: IntWithAggregatesFilter<"User"> | number
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type UserUploadWhereInput = {
    AND?: UserUploadWhereInput | UserUploadWhereInput[]
    OR?: UserUploadWhereInput[]
    NOT?: UserUploadWhereInput | UserUploadWhereInput[]
    id?: StringFilter<"UserUpload"> | string
    userId?: StringFilter<"UserUpload"> | string
    path?: StringFilter<"UserUpload"> | string
    mime?: StringFilter<"UserUpload"> | string
    defaultStyle?: StringNullableFilter<"UserUpload"> | string | null
    defaultBgColor?: StringNullableFilter<"UserUpload"> | string | null
    createdAt?: DateTimeFilter<"UserUpload"> | Date | string
  }

  export type UserUploadOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    path?: SortOrder
    mime?: SortOrder
    defaultStyle?: SortOrderInput | SortOrder
    defaultBgColor?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type UserUploadWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UserUploadWhereInput | UserUploadWhereInput[]
    OR?: UserUploadWhereInput[]
    NOT?: UserUploadWhereInput | UserUploadWhereInput[]
    userId?: StringFilter<"UserUpload"> | string
    path?: StringFilter<"UserUpload"> | string
    mime?: StringFilter<"UserUpload"> | string
    defaultStyle?: StringNullableFilter<"UserUpload"> | string | null
    defaultBgColor?: StringNullableFilter<"UserUpload"> | string | null
    createdAt?: DateTimeFilter<"UserUpload"> | Date | string
  }, "id">

  export type UserUploadOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    path?: SortOrder
    mime?: SortOrder
    defaultStyle?: SortOrderInput | SortOrder
    defaultBgColor?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: UserUploadCountOrderByAggregateInput
    _max?: UserUploadMaxOrderByAggregateInput
    _min?: UserUploadMinOrderByAggregateInput
  }

  export type UserUploadScalarWhereWithAggregatesInput = {
    AND?: UserUploadScalarWhereWithAggregatesInput | UserUploadScalarWhereWithAggregatesInput[]
    OR?: UserUploadScalarWhereWithAggregatesInput[]
    NOT?: UserUploadScalarWhereWithAggregatesInput | UserUploadScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserUpload"> | string
    userId?: StringWithAggregatesFilter<"UserUpload"> | string
    path?: StringWithAggregatesFilter<"UserUpload"> | string
    mime?: StringWithAggregatesFilter<"UserUpload"> | string
    defaultStyle?: StringNullableWithAggregatesFilter<"UserUpload"> | string | null
    defaultBgColor?: StringNullableWithAggregatesFilter<"UserUpload"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"UserUpload"> | Date | string
  }

  export type BackgroundRemovedWhereInput = {
    AND?: BackgroundRemovedWhereInput | BackgroundRemovedWhereInput[]
    OR?: BackgroundRemovedWhereInput[]
    NOT?: BackgroundRemovedWhereInput | BackgroundRemovedWhereInput[]
    id?: StringFilter<"BackgroundRemoved"> | string
    userId?: StringFilter<"BackgroundRemoved"> | string
    sourceUploadId?: StringFilter<"BackgroundRemoved"> | string
    path?: StringFilter<"BackgroundRemoved"> | string
    createdAt?: DateTimeFilter<"BackgroundRemoved"> | Date | string
  }

  export type BackgroundRemovedOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    sourceUploadId?: SortOrder
    path?: SortOrder
    createdAt?: SortOrder
  }

  export type BackgroundRemovedWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BackgroundRemovedWhereInput | BackgroundRemovedWhereInput[]
    OR?: BackgroundRemovedWhereInput[]
    NOT?: BackgroundRemovedWhereInput | BackgroundRemovedWhereInput[]
    userId?: StringFilter<"BackgroundRemoved"> | string
    sourceUploadId?: StringFilter<"BackgroundRemoved"> | string
    path?: StringFilter<"BackgroundRemoved"> | string
    createdAt?: DateTimeFilter<"BackgroundRemoved"> | Date | string
  }, "id">

  export type BackgroundRemovedOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    sourceUploadId?: SortOrder
    path?: SortOrder
    createdAt?: SortOrder
    _count?: BackgroundRemovedCountOrderByAggregateInput
    _max?: BackgroundRemovedMaxOrderByAggregateInput
    _min?: BackgroundRemovedMinOrderByAggregateInput
  }

  export type BackgroundRemovedScalarWhereWithAggregatesInput = {
    AND?: BackgroundRemovedScalarWhereWithAggregatesInput | BackgroundRemovedScalarWhereWithAggregatesInput[]
    OR?: BackgroundRemovedScalarWhereWithAggregatesInput[]
    NOT?: BackgroundRemovedScalarWhereWithAggregatesInput | BackgroundRemovedScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BackgroundRemoved"> | string
    userId?: StringWithAggregatesFilter<"BackgroundRemoved"> | string
    sourceUploadId?: StringWithAggregatesFilter<"BackgroundRemoved"> | string
    path?: StringWithAggregatesFilter<"BackgroundRemoved"> | string
    createdAt?: DateTimeWithAggregatesFilter<"BackgroundRemoved"> | Date | string
  }

  export type UserResultWhereInput = {
    AND?: UserResultWhereInput | UserResultWhereInput[]
    OR?: UserResultWhereInput[]
    NOT?: UserResultWhereInput | UserResultWhereInput[]
    id?: StringFilter<"UserResult"> | string
    userId?: StringFilter<"UserResult"> | string
    path?: StringFilter<"UserResult"> | string
    sourceUploadId?: StringNullableFilter<"UserResult"> | string | null
    createdAt?: DateTimeFilter<"UserResult"> | Date | string
  }

  export type UserResultOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    path?: SortOrder
    sourceUploadId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type UserResultWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UserResultWhereInput | UserResultWhereInput[]
    OR?: UserResultWhereInput[]
    NOT?: UserResultWhereInput | UserResultWhereInput[]
    userId?: StringFilter<"UserResult"> | string
    path?: StringFilter<"UserResult"> | string
    sourceUploadId?: StringNullableFilter<"UserResult"> | string | null
    createdAt?: DateTimeFilter<"UserResult"> | Date | string
  }, "id">

  export type UserResultOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    path?: SortOrder
    sourceUploadId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: UserResultCountOrderByAggregateInput
    _max?: UserResultMaxOrderByAggregateInput
    _min?: UserResultMinOrderByAggregateInput
  }

  export type UserResultScalarWhereWithAggregatesInput = {
    AND?: UserResultScalarWhereWithAggregatesInput | UserResultScalarWhereWithAggregatesInput[]
    OR?: UserResultScalarWhereWithAggregatesInput[]
    NOT?: UserResultScalarWhereWithAggregatesInput | UserResultScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserResult"> | string
    userId?: StringWithAggregatesFilter<"UserResult"> | string
    path?: StringWithAggregatesFilter<"UserResult"> | string
    sourceUploadId?: StringNullableWithAggregatesFilter<"UserResult"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"UserResult"> | Date | string
  }

  export type SocialSubmissionWhereInput = {
    AND?: SocialSubmissionWhereInput | SocialSubmissionWhereInput[]
    OR?: SocialSubmissionWhereInput[]
    NOT?: SocialSubmissionWhereInput | SocialSubmissionWhereInput[]
    id?: StringFilter<"SocialSubmission"> | string
    userId?: StringFilter<"SocialSubmission"> | string
    platform?: EnumSocialPlatformFilter<"SocialSubmission"> | $Enums.SocialPlatform
    originalUrl?: StringFilter<"SocialSubmission"> | string
    urlNormalized?: StringFilter<"SocialSubmission"> | string
    status?: EnumSocialSubmissionStatusFilter<"SocialSubmission"> | $Enums.SocialSubmissionStatus
    requiredKeywords?: StringNullableListFilter<"SocialSubmission">
    missingKeywords?: StringNullableListFilter<"SocialSubmission">
    matchedKeywords?: StringNullableListFilter<"SocialSubmission">
    postText?: StringNullableFilter<"SocialSubmission"> | string | null
    likes?: IntFilter<"SocialSubmission"> | number
    comments?: IntFilter<"SocialSubmission"> | number
    shares?: IntFilter<"SocialSubmission"> | number
    bestEngagementTotal?: IntFilter<"SocialSubmission"> | number
    creditAwarded?: IntFilter<"SocialSubmission"> | number
    creditPenalty?: IntFilter<"SocialSubmission"> | number
    rescanCount?: IntFilter<"SocialSubmission"> | number
    verifiedAt?: DateTimeNullableFilter<"SocialSubmission"> | Date | string | null
    lastAttemptAt?: DateTimeNullableFilter<"SocialSubmission"> | Date | string | null
    errorMessage?: StringNullableFilter<"SocialSubmission"> | string | null
    createdAt?: DateTimeFilter<"SocialSubmission"> | Date | string
    updatedAt?: DateTimeFilter<"SocialSubmission"> | Date | string
  }

  export type SocialSubmissionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    platform?: SortOrder
    originalUrl?: SortOrder
    urlNormalized?: SortOrder
    status?: SortOrder
    requiredKeywords?: SortOrder
    missingKeywords?: SortOrder
    matchedKeywords?: SortOrder
    postText?: SortOrderInput | SortOrder
    likes?: SortOrder
    comments?: SortOrder
    shares?: SortOrder
    bestEngagementTotal?: SortOrder
    creditAwarded?: SortOrder
    creditPenalty?: SortOrder
    rescanCount?: SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    lastAttemptAt?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SocialSubmissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    urlNormalized?: string
    AND?: SocialSubmissionWhereInput | SocialSubmissionWhereInput[]
    OR?: SocialSubmissionWhereInput[]
    NOT?: SocialSubmissionWhereInput | SocialSubmissionWhereInput[]
    userId?: StringFilter<"SocialSubmission"> | string
    platform?: EnumSocialPlatformFilter<"SocialSubmission"> | $Enums.SocialPlatform
    originalUrl?: StringFilter<"SocialSubmission"> | string
    status?: EnumSocialSubmissionStatusFilter<"SocialSubmission"> | $Enums.SocialSubmissionStatus
    requiredKeywords?: StringNullableListFilter<"SocialSubmission">
    missingKeywords?: StringNullableListFilter<"SocialSubmission">
    matchedKeywords?: StringNullableListFilter<"SocialSubmission">
    postText?: StringNullableFilter<"SocialSubmission"> | string | null
    likes?: IntFilter<"SocialSubmission"> | number
    comments?: IntFilter<"SocialSubmission"> | number
    shares?: IntFilter<"SocialSubmission"> | number
    bestEngagementTotal?: IntFilter<"SocialSubmission"> | number
    creditAwarded?: IntFilter<"SocialSubmission"> | number
    creditPenalty?: IntFilter<"SocialSubmission"> | number
    rescanCount?: IntFilter<"SocialSubmission"> | number
    verifiedAt?: DateTimeNullableFilter<"SocialSubmission"> | Date | string | null
    lastAttemptAt?: DateTimeNullableFilter<"SocialSubmission"> | Date | string | null
    errorMessage?: StringNullableFilter<"SocialSubmission"> | string | null
    createdAt?: DateTimeFilter<"SocialSubmission"> | Date | string
    updatedAt?: DateTimeFilter<"SocialSubmission"> | Date | string
  }, "id" | "urlNormalized">

  export type SocialSubmissionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    platform?: SortOrder
    originalUrl?: SortOrder
    urlNormalized?: SortOrder
    status?: SortOrder
    requiredKeywords?: SortOrder
    missingKeywords?: SortOrder
    matchedKeywords?: SortOrder
    postText?: SortOrderInput | SortOrder
    likes?: SortOrder
    comments?: SortOrder
    shares?: SortOrder
    bestEngagementTotal?: SortOrder
    creditAwarded?: SortOrder
    creditPenalty?: SortOrder
    rescanCount?: SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    lastAttemptAt?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SocialSubmissionCountOrderByAggregateInput
    _avg?: SocialSubmissionAvgOrderByAggregateInput
    _max?: SocialSubmissionMaxOrderByAggregateInput
    _min?: SocialSubmissionMinOrderByAggregateInput
    _sum?: SocialSubmissionSumOrderByAggregateInput
  }

  export type SocialSubmissionScalarWhereWithAggregatesInput = {
    AND?: SocialSubmissionScalarWhereWithAggregatesInput | SocialSubmissionScalarWhereWithAggregatesInput[]
    OR?: SocialSubmissionScalarWhereWithAggregatesInput[]
    NOT?: SocialSubmissionScalarWhereWithAggregatesInput | SocialSubmissionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SocialSubmission"> | string
    userId?: StringWithAggregatesFilter<"SocialSubmission"> | string
    platform?: EnumSocialPlatformWithAggregatesFilter<"SocialSubmission"> | $Enums.SocialPlatform
    originalUrl?: StringWithAggregatesFilter<"SocialSubmission"> | string
    urlNormalized?: StringWithAggregatesFilter<"SocialSubmission"> | string
    status?: EnumSocialSubmissionStatusWithAggregatesFilter<"SocialSubmission"> | $Enums.SocialSubmissionStatus
    requiredKeywords?: StringNullableListFilter<"SocialSubmission">
    missingKeywords?: StringNullableListFilter<"SocialSubmission">
    matchedKeywords?: StringNullableListFilter<"SocialSubmission">
    postText?: StringNullableWithAggregatesFilter<"SocialSubmission"> | string | null
    likes?: IntWithAggregatesFilter<"SocialSubmission"> | number
    comments?: IntWithAggregatesFilter<"SocialSubmission"> | number
    shares?: IntWithAggregatesFilter<"SocialSubmission"> | number
    bestEngagementTotal?: IntWithAggregatesFilter<"SocialSubmission"> | number
    creditAwarded?: IntWithAggregatesFilter<"SocialSubmission"> | number
    creditPenalty?: IntWithAggregatesFilter<"SocialSubmission"> | number
    rescanCount?: IntWithAggregatesFilter<"SocialSubmission"> | number
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"SocialSubmission"> | Date | string | null
    lastAttemptAt?: DateTimeNullableWithAggregatesFilter<"SocialSubmission"> | Date | string | null
    errorMessage?: StringNullableWithAggregatesFilter<"SocialSubmission"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SocialSubmission"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SocialSubmission"> | Date | string
  }

  export type UserCreateInput = {
    id: string
    firstName?: string | null
    lastName?: string | null
    username?: string | null
    primaryEmailAddress: string
    imageUrl?: string | null
    clerkUserProperties?: NullableJsonNullValueInput | InputJsonValue
    stripeCustomerId?: string | null
    accessType?: $Enums.AccessType
    stripeUserProperties?: NullableJsonNullValueInput | InputJsonValue
    dailyAIcomments?: number
    creditConsumed?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateInput = {
    id: string
    firstName?: string | null
    lastName?: string | null
    username?: string | null
    primaryEmailAddress: string
    imageUrl?: string | null
    clerkUserProperties?: NullableJsonNullValueInput | InputJsonValue
    stripeCustomerId?: string | null
    accessType?: $Enums.AccessType
    stripeUserProperties?: NullableJsonNullValueInput | InputJsonValue
    dailyAIcomments?: number
    creditConsumed?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    primaryEmailAddress?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    clerkUserProperties?: NullableJsonNullValueInput | InputJsonValue
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    accessType?: EnumAccessTypeFieldUpdateOperationsInput | $Enums.AccessType
    stripeUserProperties?: NullableJsonNullValueInput | InputJsonValue
    dailyAIcomments?: IntFieldUpdateOperationsInput | number
    creditConsumed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    primaryEmailAddress?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    clerkUserProperties?: NullableJsonNullValueInput | InputJsonValue
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    accessType?: EnumAccessTypeFieldUpdateOperationsInput | $Enums.AccessType
    stripeUserProperties?: NullableJsonNullValueInput | InputJsonValue
    dailyAIcomments?: IntFieldUpdateOperationsInput | number
    creditConsumed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id: string
    firstName?: string | null
    lastName?: string | null
    username?: string | null
    primaryEmailAddress: string
    imageUrl?: string | null
    clerkUserProperties?: NullableJsonNullValueInput | InputJsonValue
    stripeCustomerId?: string | null
    accessType?: $Enums.AccessType
    stripeUserProperties?: NullableJsonNullValueInput | InputJsonValue
    dailyAIcomments?: number
    creditConsumed?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    primaryEmailAddress?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    clerkUserProperties?: NullableJsonNullValueInput | InputJsonValue
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    accessType?: EnumAccessTypeFieldUpdateOperationsInput | $Enums.AccessType
    stripeUserProperties?: NullableJsonNullValueInput | InputJsonValue
    dailyAIcomments?: IntFieldUpdateOperationsInput | number
    creditConsumed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    primaryEmailAddress?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    clerkUserProperties?: NullableJsonNullValueInput | InputJsonValue
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    accessType?: EnumAccessTypeFieldUpdateOperationsInput | $Enums.AccessType
    stripeUserProperties?: NullableJsonNullValueInput | InputJsonValue
    dailyAIcomments?: IntFieldUpdateOperationsInput | number
    creditConsumed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUploadCreateInput = {
    id?: string
    userId: string
    path: string
    mime: string
    defaultStyle?: string | null
    defaultBgColor?: string | null
    createdAt?: Date | string
  }

  export type UserUploadUncheckedCreateInput = {
    id?: string
    userId: string
    path: string
    mime: string
    defaultStyle?: string | null
    defaultBgColor?: string | null
    createdAt?: Date | string
  }

  export type UserUploadUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    mime?: StringFieldUpdateOperationsInput | string
    defaultStyle?: NullableStringFieldUpdateOperationsInput | string | null
    defaultBgColor?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUploadUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    mime?: StringFieldUpdateOperationsInput | string
    defaultStyle?: NullableStringFieldUpdateOperationsInput | string | null
    defaultBgColor?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUploadCreateManyInput = {
    id?: string
    userId: string
    path: string
    mime: string
    defaultStyle?: string | null
    defaultBgColor?: string | null
    createdAt?: Date | string
  }

  export type UserUploadUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    mime?: StringFieldUpdateOperationsInput | string
    defaultStyle?: NullableStringFieldUpdateOperationsInput | string | null
    defaultBgColor?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUploadUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    mime?: StringFieldUpdateOperationsInput | string
    defaultStyle?: NullableStringFieldUpdateOperationsInput | string | null
    defaultBgColor?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackgroundRemovedCreateInput = {
    id?: string
    userId: string
    sourceUploadId: string
    path: string
    createdAt?: Date | string
  }

  export type BackgroundRemovedUncheckedCreateInput = {
    id?: string
    userId: string
    sourceUploadId: string
    path: string
    createdAt?: Date | string
  }

  export type BackgroundRemovedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    sourceUploadId?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackgroundRemovedUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    sourceUploadId?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackgroundRemovedCreateManyInput = {
    id?: string
    userId: string
    sourceUploadId: string
    path: string
    createdAt?: Date | string
  }

  export type BackgroundRemovedUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    sourceUploadId?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackgroundRemovedUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    sourceUploadId?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserResultCreateInput = {
    id?: string
    userId: string
    path: string
    sourceUploadId?: string | null
    createdAt?: Date | string
  }

  export type UserResultUncheckedCreateInput = {
    id?: string
    userId: string
    path: string
    sourceUploadId?: string | null
    createdAt?: Date | string
  }

  export type UserResultUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    sourceUploadId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserResultUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    sourceUploadId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserResultCreateManyInput = {
    id?: string
    userId: string
    path: string
    sourceUploadId?: string | null
    createdAt?: Date | string
  }

  export type UserResultUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    sourceUploadId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserResultUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    sourceUploadId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SocialSubmissionCreateInput = {
    id?: string
    userId: string
    platform: $Enums.SocialPlatform
    originalUrl: string
    urlNormalized: string
    status?: $Enums.SocialSubmissionStatus
    requiredKeywords?: SocialSubmissionCreaterequiredKeywordsInput | string[]
    missingKeywords?: SocialSubmissionCreatemissingKeywordsInput | string[]
    matchedKeywords?: SocialSubmissionCreatematchedKeywordsInput | string[]
    postText?: string | null
    likes?: number
    comments?: number
    shares?: number
    bestEngagementTotal?: number
    creditAwarded?: number
    creditPenalty?: number
    rescanCount?: number
    verifiedAt?: Date | string | null
    lastAttemptAt?: Date | string | null
    errorMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SocialSubmissionUncheckedCreateInput = {
    id?: string
    userId: string
    platform: $Enums.SocialPlatform
    originalUrl: string
    urlNormalized: string
    status?: $Enums.SocialSubmissionStatus
    requiredKeywords?: SocialSubmissionCreaterequiredKeywordsInput | string[]
    missingKeywords?: SocialSubmissionCreatemissingKeywordsInput | string[]
    matchedKeywords?: SocialSubmissionCreatematchedKeywordsInput | string[]
    postText?: string | null
    likes?: number
    comments?: number
    shares?: number
    bestEngagementTotal?: number
    creditAwarded?: number
    creditPenalty?: number
    rescanCount?: number
    verifiedAt?: Date | string | null
    lastAttemptAt?: Date | string | null
    errorMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SocialSubmissionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    platform?: EnumSocialPlatformFieldUpdateOperationsInput | $Enums.SocialPlatform
    originalUrl?: StringFieldUpdateOperationsInput | string
    urlNormalized?: StringFieldUpdateOperationsInput | string
    status?: EnumSocialSubmissionStatusFieldUpdateOperationsInput | $Enums.SocialSubmissionStatus
    requiredKeywords?: SocialSubmissionUpdaterequiredKeywordsInput | string[]
    missingKeywords?: SocialSubmissionUpdatemissingKeywordsInput | string[]
    matchedKeywords?: SocialSubmissionUpdatematchedKeywordsInput | string[]
    postText?: NullableStringFieldUpdateOperationsInput | string | null
    likes?: IntFieldUpdateOperationsInput | number
    comments?: IntFieldUpdateOperationsInput | number
    shares?: IntFieldUpdateOperationsInput | number
    bestEngagementTotal?: IntFieldUpdateOperationsInput | number
    creditAwarded?: IntFieldUpdateOperationsInput | number
    creditPenalty?: IntFieldUpdateOperationsInput | number
    rescanCount?: IntFieldUpdateOperationsInput | number
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SocialSubmissionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    platform?: EnumSocialPlatformFieldUpdateOperationsInput | $Enums.SocialPlatform
    originalUrl?: StringFieldUpdateOperationsInput | string
    urlNormalized?: StringFieldUpdateOperationsInput | string
    status?: EnumSocialSubmissionStatusFieldUpdateOperationsInput | $Enums.SocialSubmissionStatus
    requiredKeywords?: SocialSubmissionUpdaterequiredKeywordsInput | string[]
    missingKeywords?: SocialSubmissionUpdatemissingKeywordsInput | string[]
    matchedKeywords?: SocialSubmissionUpdatematchedKeywordsInput | string[]
    postText?: NullableStringFieldUpdateOperationsInput | string | null
    likes?: IntFieldUpdateOperationsInput | number
    comments?: IntFieldUpdateOperationsInput | number
    shares?: IntFieldUpdateOperationsInput | number
    bestEngagementTotal?: IntFieldUpdateOperationsInput | number
    creditAwarded?: IntFieldUpdateOperationsInput | number
    creditPenalty?: IntFieldUpdateOperationsInput | number
    rescanCount?: IntFieldUpdateOperationsInput | number
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SocialSubmissionCreateManyInput = {
    id?: string
    userId: string
    platform: $Enums.SocialPlatform
    originalUrl: string
    urlNormalized: string
    status?: $Enums.SocialSubmissionStatus
    requiredKeywords?: SocialSubmissionCreaterequiredKeywordsInput | string[]
    missingKeywords?: SocialSubmissionCreatemissingKeywordsInput | string[]
    matchedKeywords?: SocialSubmissionCreatematchedKeywordsInput | string[]
    postText?: string | null
    likes?: number
    comments?: number
    shares?: number
    bestEngagementTotal?: number
    creditAwarded?: number
    creditPenalty?: number
    rescanCount?: number
    verifiedAt?: Date | string | null
    lastAttemptAt?: Date | string | null
    errorMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SocialSubmissionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    platform?: EnumSocialPlatformFieldUpdateOperationsInput | $Enums.SocialPlatform
    originalUrl?: StringFieldUpdateOperationsInput | string
    urlNormalized?: StringFieldUpdateOperationsInput | string
    status?: EnumSocialSubmissionStatusFieldUpdateOperationsInput | $Enums.SocialSubmissionStatus
    requiredKeywords?: SocialSubmissionUpdaterequiredKeywordsInput | string[]
    missingKeywords?: SocialSubmissionUpdatemissingKeywordsInput | string[]
    matchedKeywords?: SocialSubmissionUpdatematchedKeywordsInput | string[]
    postText?: NullableStringFieldUpdateOperationsInput | string | null
    likes?: IntFieldUpdateOperationsInput | number
    comments?: IntFieldUpdateOperationsInput | number
    shares?: IntFieldUpdateOperationsInput | number
    bestEngagementTotal?: IntFieldUpdateOperationsInput | number
    creditAwarded?: IntFieldUpdateOperationsInput | number
    creditPenalty?: IntFieldUpdateOperationsInput | number
    rescanCount?: IntFieldUpdateOperationsInput | number
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SocialSubmissionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    platform?: EnumSocialPlatformFieldUpdateOperationsInput | $Enums.SocialPlatform
    originalUrl?: StringFieldUpdateOperationsInput | string
    urlNormalized?: StringFieldUpdateOperationsInput | string
    status?: EnumSocialSubmissionStatusFieldUpdateOperationsInput | $Enums.SocialSubmissionStatus
    requiredKeywords?: SocialSubmissionUpdaterequiredKeywordsInput | string[]
    missingKeywords?: SocialSubmissionUpdatemissingKeywordsInput | string[]
    matchedKeywords?: SocialSubmissionUpdatematchedKeywordsInput | string[]
    postText?: NullableStringFieldUpdateOperationsInput | string | null
    likes?: IntFieldUpdateOperationsInput | number
    comments?: IntFieldUpdateOperationsInput | number
    shares?: IntFieldUpdateOperationsInput | number
    bestEngagementTotal?: IntFieldUpdateOperationsInput | number
    creditAwarded?: IntFieldUpdateOperationsInput | number
    creditPenalty?: IntFieldUpdateOperationsInput | number
    rescanCount?: IntFieldUpdateOperationsInput | number
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumAccessTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessType | EnumAccessTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AccessType[] | ListEnumAccessTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccessType[] | ListEnumAccessTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccessTypeFilter<$PrismaModel> | $Enums.AccessType
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    username?: SortOrder
    primaryEmailAddress?: SortOrder
    imageUrl?: SortOrder
    clerkUserProperties?: SortOrder
    stripeCustomerId?: SortOrder
    accessType?: SortOrder
    stripeUserProperties?: SortOrder
    dailyAIcomments?: SortOrder
    creditConsumed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    dailyAIcomments?: SortOrder
    creditConsumed?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    username?: SortOrder
    primaryEmailAddress?: SortOrder
    imageUrl?: SortOrder
    stripeCustomerId?: SortOrder
    accessType?: SortOrder
    dailyAIcomments?: SortOrder
    creditConsumed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    username?: SortOrder
    primaryEmailAddress?: SortOrder
    imageUrl?: SortOrder
    stripeCustomerId?: SortOrder
    accessType?: SortOrder
    dailyAIcomments?: SortOrder
    creditConsumed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    dailyAIcomments?: SortOrder
    creditConsumed?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumAccessTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessType | EnumAccessTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AccessType[] | ListEnumAccessTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccessType[] | ListEnumAccessTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccessTypeWithAggregatesFilter<$PrismaModel> | $Enums.AccessType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccessTypeFilter<$PrismaModel>
    _max?: NestedEnumAccessTypeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserUploadCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    path?: SortOrder
    mime?: SortOrder
    defaultStyle?: SortOrder
    defaultBgColor?: SortOrder
    createdAt?: SortOrder
  }

  export type UserUploadMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    path?: SortOrder
    mime?: SortOrder
    defaultStyle?: SortOrder
    defaultBgColor?: SortOrder
    createdAt?: SortOrder
  }

  export type UserUploadMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    path?: SortOrder
    mime?: SortOrder
    defaultStyle?: SortOrder
    defaultBgColor?: SortOrder
    createdAt?: SortOrder
  }

  export type BackgroundRemovedCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sourceUploadId?: SortOrder
    path?: SortOrder
    createdAt?: SortOrder
  }

  export type BackgroundRemovedMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sourceUploadId?: SortOrder
    path?: SortOrder
    createdAt?: SortOrder
  }

  export type BackgroundRemovedMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sourceUploadId?: SortOrder
    path?: SortOrder
    createdAt?: SortOrder
  }

  export type UserResultCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    path?: SortOrder
    sourceUploadId?: SortOrder
    createdAt?: SortOrder
  }

  export type UserResultMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    path?: SortOrder
    sourceUploadId?: SortOrder
    createdAt?: SortOrder
  }

  export type UserResultMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    path?: SortOrder
    sourceUploadId?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumSocialPlatformFilter<$PrismaModel = never> = {
    equals?: $Enums.SocialPlatform | EnumSocialPlatformFieldRefInput<$PrismaModel>
    in?: $Enums.SocialPlatform[] | ListEnumSocialPlatformFieldRefInput<$PrismaModel>
    notIn?: $Enums.SocialPlatform[] | ListEnumSocialPlatformFieldRefInput<$PrismaModel>
    not?: NestedEnumSocialPlatformFilter<$PrismaModel> | $Enums.SocialPlatform
  }

  export type EnumSocialSubmissionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SocialSubmissionStatus | EnumSocialSubmissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SocialSubmissionStatus[] | ListEnumSocialSubmissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SocialSubmissionStatus[] | ListEnumSocialSubmissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSocialSubmissionStatusFilter<$PrismaModel> | $Enums.SocialSubmissionStatus
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SocialSubmissionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    platform?: SortOrder
    originalUrl?: SortOrder
    urlNormalized?: SortOrder
    status?: SortOrder
    requiredKeywords?: SortOrder
    missingKeywords?: SortOrder
    matchedKeywords?: SortOrder
    postText?: SortOrder
    likes?: SortOrder
    comments?: SortOrder
    shares?: SortOrder
    bestEngagementTotal?: SortOrder
    creditAwarded?: SortOrder
    creditPenalty?: SortOrder
    rescanCount?: SortOrder
    verifiedAt?: SortOrder
    lastAttemptAt?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SocialSubmissionAvgOrderByAggregateInput = {
    likes?: SortOrder
    comments?: SortOrder
    shares?: SortOrder
    bestEngagementTotal?: SortOrder
    creditAwarded?: SortOrder
    creditPenalty?: SortOrder
    rescanCount?: SortOrder
  }

  export type SocialSubmissionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    platform?: SortOrder
    originalUrl?: SortOrder
    urlNormalized?: SortOrder
    status?: SortOrder
    postText?: SortOrder
    likes?: SortOrder
    comments?: SortOrder
    shares?: SortOrder
    bestEngagementTotal?: SortOrder
    creditAwarded?: SortOrder
    creditPenalty?: SortOrder
    rescanCount?: SortOrder
    verifiedAt?: SortOrder
    lastAttemptAt?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SocialSubmissionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    platform?: SortOrder
    originalUrl?: SortOrder
    urlNormalized?: SortOrder
    status?: SortOrder
    postText?: SortOrder
    likes?: SortOrder
    comments?: SortOrder
    shares?: SortOrder
    bestEngagementTotal?: SortOrder
    creditAwarded?: SortOrder
    creditPenalty?: SortOrder
    rescanCount?: SortOrder
    verifiedAt?: SortOrder
    lastAttemptAt?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SocialSubmissionSumOrderByAggregateInput = {
    likes?: SortOrder
    comments?: SortOrder
    shares?: SortOrder
    bestEngagementTotal?: SortOrder
    creditAwarded?: SortOrder
    creditPenalty?: SortOrder
    rescanCount?: SortOrder
  }

  export type EnumSocialPlatformWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SocialPlatform | EnumSocialPlatformFieldRefInput<$PrismaModel>
    in?: $Enums.SocialPlatform[] | ListEnumSocialPlatformFieldRefInput<$PrismaModel>
    notIn?: $Enums.SocialPlatform[] | ListEnumSocialPlatformFieldRefInput<$PrismaModel>
    not?: NestedEnumSocialPlatformWithAggregatesFilter<$PrismaModel> | $Enums.SocialPlatform
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSocialPlatformFilter<$PrismaModel>
    _max?: NestedEnumSocialPlatformFilter<$PrismaModel>
  }

  export type EnumSocialSubmissionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SocialSubmissionStatus | EnumSocialSubmissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SocialSubmissionStatus[] | ListEnumSocialSubmissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SocialSubmissionStatus[] | ListEnumSocialSubmissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSocialSubmissionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SocialSubmissionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSocialSubmissionStatusFilter<$PrismaModel>
    _max?: NestedEnumSocialSubmissionStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumAccessTypeFieldUpdateOperationsInput = {
    set?: $Enums.AccessType
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SocialSubmissionCreaterequiredKeywordsInput = {
    set: string[]
  }

  export type SocialSubmissionCreatemissingKeywordsInput = {
    set: string[]
  }

  export type SocialSubmissionCreatematchedKeywordsInput = {
    set: string[]
  }

  export type EnumSocialPlatformFieldUpdateOperationsInput = {
    set?: $Enums.SocialPlatform
  }

  export type EnumSocialSubmissionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SocialSubmissionStatus
  }

  export type SocialSubmissionUpdaterequiredKeywordsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type SocialSubmissionUpdatemissingKeywordsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type SocialSubmissionUpdatematchedKeywordsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumAccessTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessType | EnumAccessTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AccessType[] | ListEnumAccessTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccessType[] | ListEnumAccessTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccessTypeFilter<$PrismaModel> | $Enums.AccessType
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumAccessTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessType | EnumAccessTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AccessType[] | ListEnumAccessTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccessType[] | ListEnumAccessTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccessTypeWithAggregatesFilter<$PrismaModel> | $Enums.AccessType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccessTypeFilter<$PrismaModel>
    _max?: NestedEnumAccessTypeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumSocialPlatformFilter<$PrismaModel = never> = {
    equals?: $Enums.SocialPlatform | EnumSocialPlatformFieldRefInput<$PrismaModel>
    in?: $Enums.SocialPlatform[] | ListEnumSocialPlatformFieldRefInput<$PrismaModel>
    notIn?: $Enums.SocialPlatform[] | ListEnumSocialPlatformFieldRefInput<$PrismaModel>
    not?: NestedEnumSocialPlatformFilter<$PrismaModel> | $Enums.SocialPlatform
  }

  export type NestedEnumSocialSubmissionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SocialSubmissionStatus | EnumSocialSubmissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SocialSubmissionStatus[] | ListEnumSocialSubmissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SocialSubmissionStatus[] | ListEnumSocialSubmissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSocialSubmissionStatusFilter<$PrismaModel> | $Enums.SocialSubmissionStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumSocialPlatformWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SocialPlatform | EnumSocialPlatformFieldRefInput<$PrismaModel>
    in?: $Enums.SocialPlatform[] | ListEnumSocialPlatformFieldRefInput<$PrismaModel>
    notIn?: $Enums.SocialPlatform[] | ListEnumSocialPlatformFieldRefInput<$PrismaModel>
    not?: NestedEnumSocialPlatformWithAggregatesFilter<$PrismaModel> | $Enums.SocialPlatform
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSocialPlatformFilter<$PrismaModel>
    _max?: NestedEnumSocialPlatformFilter<$PrismaModel>
  }

  export type NestedEnumSocialSubmissionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SocialSubmissionStatus | EnumSocialSubmissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SocialSubmissionStatus[] | ListEnumSocialSubmissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SocialSubmissionStatus[] | ListEnumSocialSubmissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSocialSubmissionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SocialSubmissionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSocialSubmissionStatusFilter<$PrismaModel>
    _max?: NestedEnumSocialSubmissionStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}