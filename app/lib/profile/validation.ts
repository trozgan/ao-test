export type ProfileInput = {
  name: string;
  email: string;
  timezone: string;
};

export type ProfileErrors = Partial<Record<keyof ProfileInput, string>>;

export const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Budapest",
  "Asia/Tokyo",
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateProfile(input: ProfileInput): ProfileErrors {
  const errors: ProfileErrors = {};

  if (input.name.trim() === "") {
    errors.name = "Name is required.";
  }

  const email = input.email.trim();
  if (email === "") {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (input.timezone === "") {
    errors.timezone = "Timezone is required.";
  } else if (!(TIMEZONES as readonly string[]).includes(input.timezone)) {
    errors.timezone = "Choose a timezone from the list.";
  }

  return errors;
}
