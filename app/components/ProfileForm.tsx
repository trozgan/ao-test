"use client";

import { useState } from "react";
import {
  TIMEZONES,
  validateProfile,
  type ProfileErrors,
  type ProfileInput,
} from "../lib/profile/validation";
import Button from "./Button";

const EMPTY_PROFILE: ProfileInput = { name: "", email: "", timezone: "" };

type Status = "idle" | "saving" | "saved";

export default function ProfileForm() {
  const [values, setValues] = useState<ProfileInput>(EMPTY_PROFILE);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function updateField(field: keyof ProfileInput, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!(field in current)) {
        return current;
      }
      const next = { ...current };
      delete next[field];
      return next;
    });
    setStatus("idle");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateProfile(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("saving");

    const response = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const body = await response.json();
      setErrors(body.errors ?? {});
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("saved");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="profile-name" className="text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="profile-name"
          type="text"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "profile-name-error" : undefined}
          className="h-11 rounded-md border border-solid border-black/[.08] px-3 text-base dark:border-white/[.145]"
        />
        {errors.name && (
          <p id="profile-name-error" role="alert" className="text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="profile-email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="profile-email"
          type="email"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "profile-email-error" : undefined}
          className="h-11 rounded-md border border-solid border-black/[.08] px-3 text-base dark:border-white/[.145]"
        />
        {errors.email && (
          <p id="profile-email-error" role="alert" className="text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="profile-timezone" className="text-sm font-medium text-foreground">
          Timezone
        </label>
        <select
          id="profile-timezone"
          value={values.timezone}
          onChange={(event) => updateField("timezone", event.target.value)}
          aria-invalid={errors.timezone ? true : undefined}
          aria-describedby={errors.timezone ? "profile-timezone-error" : undefined}
          className="h-11 rounded-md border border-solid border-black/[.08] px-3 text-base dark:border-white/[.145]"
        >
          <option value="">Select a timezone</option>
          {TIMEZONES.map((timezone) => (
            <option key={timezone} value={timezone}>
              {timezone}
            </option>
          ))}
        </select>
        {errors.timezone && (
          <p id="profile-timezone-error" role="alert" className="text-sm text-red-600">
            {errors.timezone}
          </p>
        )}
      </div>

      {status === "saved" && (
        <p role="status" className="text-sm text-foreground">
          Profile saved.
        </p>
      )}

      <div>
        <Button type="submit">Save profile</Button>
      </div>
    </form>
  );
}
