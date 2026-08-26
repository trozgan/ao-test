import { saveProfile } from "./repository";
import { validateProfile, type ProfileErrors, type ProfileInput } from "./validation";

export type SaveProfileResult =
  | { ok: true; profile: ProfileInput }
  | { ok: false; errors: ProfileErrors };

export function saveUserProfile(input: ProfileInput): SaveProfileResult {
  const errors = validateProfile(input);

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, profile: saveProfile(input) };
}
