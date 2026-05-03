import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatARS(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateTimeSlots(): string[] {
  return ["08:00", "11:00", "14:00", "16:30", "18:30"];
}

export function isLateSlot(time: string): boolean {
  return time === "18:30";
}

export function getMinBookingDate(): Date {
  const date = new Date();
  date.setHours(date.getHours() + 24);
  return date;
}

export function getAppointmentExpiry(): Date {
  return new Date(Date.now() + 2 * 60 * 60 * 1000);
}
