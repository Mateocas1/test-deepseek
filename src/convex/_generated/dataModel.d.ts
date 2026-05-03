import type { DocBase, IdBase, TableNamesBase } from "convex/server";

export type TableNames =
  | "users"
  | "appointments"
  | "availability"
  | "payments"
  | "gallery"
  | "reviews"
  | "settings";

export type Id<TableName extends TableNames> = IdBase<TableName>;

export type Doc<TableName extends TableNames> = DocBase<TableName>;

export type {};
