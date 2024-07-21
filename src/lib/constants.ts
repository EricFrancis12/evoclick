import { startOfToday, endOfToday, addDays } from "date-fns";
import { Env } from "./types";

export const SALT_ROUNDS = 10;

export const JWT_SECRET = process.env[Env.JWT_SECRET] || "myjwtsecret";
export const JWT_EXPIRY = Number(process.env[Env.JWT_EXPIRY]) || 604_800; // 604,800 seconds is 7 days

export const REDIS_EXPIRY = 60; // in seconds

export const defaultTimeframe: [Date, Date] = [addDays(startOfToday(), -7), endOfToday()];
