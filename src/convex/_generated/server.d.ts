import type {
  QueryCtx as QueryCtxBase,
  MutationCtx as MutationCtxBase,
  ActionCtx as ActionCtxBase,
  DatabaseReader as DatabaseReaderBase,
  DatabaseWriter as DatabaseWriterBase,
} from "convex/server";
import type { Doc, Id, TableNames } from "./dataModel";

export type DatabaseReader = DatabaseReaderBase<TableNames>;
export type DatabaseWriter = DatabaseWriterBase<TableNames>;
export type QueryCtx = QueryCtxBase<TableNames>;
export type MutationCtx = MutationCtxBase<TableNames>;
export type ActionCtx = ActionCtxBase<TableNames>;

export declare const query: any;
export declare const mutation: any;
export declare const action: any;
export declare const internalQuery: any;
export declare const internalMutation: any;
export declare const internalAction: any;
