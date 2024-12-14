import { logger, schedules, wait } from "@trigger.dev/sdk/v3";
import { telegramClient } from "../index";

export const firstScheduledTask = schedules.task({
  id: "scheduled-legal-jobs-scraping",
  cron: "0 * * * *",
  run: async (payload, { ctx }) => {
    const distanceInMs =
      payload.timestamp.getTime() - (payload.lastTimestamp ?? new Date()).getTime();

    logger.log("First scheduled tasks", { payload, distanceInMs });

    await wait.for({ seconds: 5 });

    const formatted = payload.timestamp.toLocaleString("en-US", {
      timeZone: payload.timezone,
    });

    logger.log(formatted);
  },
});