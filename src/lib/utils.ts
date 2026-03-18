import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatApiError(message: string, details?: unknown) {
  return {
    success: false,
    message,
    details,
  };
}

export function formatApiSuccess<T>(message: string, data?: T) {
  return {
    success: true,
    message,
    data,
  };
}
