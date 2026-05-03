import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "expire unpaid appointments",
  { minutes: 5 },
  internal.cronTasks.expireUnpaid
);

crons.interval(
  "release expired pending slots",
  { minutes: 10 },
  internal.cronTasks.releaseExpired
);

export default crons;
