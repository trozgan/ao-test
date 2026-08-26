import type { ProfileInput } from "./validation";

let storedProfile: ProfileInput | null = null;

export function getProfile(): ProfileInput | null {
  return storedProfile;
}

export function saveProfile(profile: ProfileInput): ProfileInput {
  storedProfile = { ...profile };
  return storedProfile;
}

export function resetProfile(): void {
  storedProfile = null;
}
