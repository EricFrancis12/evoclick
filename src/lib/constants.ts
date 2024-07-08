import { startOfToday, endOfToday, addDays } from "date-fns";

export const SALT_ROUNDS = 10;

export const JWT_SECRET = process.env.JWT_SECRET || "myjwtsecret";
export const JWT_EXPIRY = Number(process.env.JWT_EXPIRY) || 604_800; // 604,800 seconds is 7 days

export const defaultTimeframe: [Date, Date] = [addDays(startOfToday(), -7), endOfToday()];
