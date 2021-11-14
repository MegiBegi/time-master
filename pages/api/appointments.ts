// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Appointment } from "../types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ appointments: Appointment[] }>
) {
  res.status(200).json({
    appointments: [
      {
        name: "Lunch with Mort",
        startTime: "2021-03-03T12:00:00+0000",
        endTime: "2021-03-03T13:00:00+0000",
      },
      {
        name: "Morning Meeting",
        startTime: "2021-03-03T09:00:00+0000",
        endTime: "2021-03-03T09:30:00+0000",
      },
      {
        name: "Exit Interviews",
        startTime: "2021-03-03T14:00:00+0000",
        endTime: "2021-03-03T17:30:00+0000",
      },
      {
        name: "Exit Interview - Jack Sparrow",
        startTime: "2021-03-03T15:30:00+0000",
        endTime: "2021-03-03T15:45:00+0000",
      },
    ],
  });
}
