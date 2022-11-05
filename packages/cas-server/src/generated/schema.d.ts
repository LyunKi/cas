import { GraphQLResolveInfo } from 'graphql'
import { Context } from '../context'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type CreateUserReq = {
  mobile: Scalars['String']
  password: Scalars['String']
  service?: InputMaybe<Scalars['String']>
  verificationCode: Scalars['String']
}

export type CreateUserRsp = {
  __typename?: 'CreateUserRsp'
  id: Scalars['ID']
}

export type LoginReq = {
  account: Scalars['String']
  password: Scalars['String']
  service: Scalars['String']
}

export type LoginRsp = {
  __typename?: 'LoginRsp'
  st: Scalars['String']
  tgt: Scalars['String']
}

export type LogoutReq = {
  __typename?: 'LogoutReq'
  invalidateTgtFlag?: Maybe<Scalars['Boolean']>
  service: Scalars['String']
  st: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  login: LoginRsp
  register: CreateUserRsp
  sendSms: Scalars['String']
}

export type MutationLoginArgs = {
  req: LoginReq
}

export type MutationRegisterArgs = {
  req: CreateUserReq
}

export type MutationSendSmsArgs = {
  req: SendSmsReq
}

export type Query = {
  __typename?: 'Query'
  ping: Scalars['String']
}

export type SendSmsReq = {
  mobile: Scalars['String']
}

export type WithIndex<TObject> = TObject & Record<string, any>
export type ResolversObject<TObject> = WithIndex<TObject>

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  CreateUserReq: CreateUserReq
  CreateUserRsp: ResolverTypeWrapper<CreateUserRsp>
  ID: ResolverTypeWrapper<Scalars['ID']>
  LoginReq: LoginReq
  LoginRsp: ResolverTypeWrapper<LoginRsp>
  LogoutReq: ResolverTypeWrapper<LogoutReq>
  Mutation: ResolverTypeWrapper<{}>
  Query: ResolverTypeWrapper<{}>
  SendSmsReq: SendSmsReq
  String: ResolverTypeWrapper<Scalars['String']>
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']
  CreateUserReq: CreateUserReq
  CreateUserRsp: CreateUserRsp
  ID: Scalars['ID']
  LoginReq: LoginReq
  LoginRsp: LoginRsp
  LogoutReq: LogoutReq
  Mutation: {}
  Query: {}
  SendSmsReq: SendSmsReq
  String: Scalars['String']
}>

export type CreateUserRspResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['CreateUserRsp'] = ResolversParentTypes['CreateUserRsp']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type LoginRspResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['LoginRsp'] = ResolversParentTypes['LoginRsp']
> = ResolversObject<{
  st?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  tgt?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type LogoutReqResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['LogoutReq'] = ResolversParentTypes['LogoutReq']
> = ResolversObject<{
  invalidateTgtFlag?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  service?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  st?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = ResolversObject<{
  login?: Resolver<
    ResolversTypes['LoginRsp'],
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, 'req'>
  >
  register?: Resolver<
    ResolversTypes['CreateUserRsp'],
    ParentType,
    ContextType,
    RequireFields<MutationRegisterArgs, 'req'>
  >
  sendSms?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<MutationSendSmsArgs, 'req'>
  >
}>

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  ping?: Resolver<ResolversTypes['String'], ParentType, ContextType>
}>

export type Resolvers<ContextType = Context> = ResolversObject<{
  CreateUserRsp?: CreateUserRspResolvers<ContextType>
  LoginRsp?: LoginRspResolvers<ContextType>
  LogoutReq?: LogoutReqResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
}>
