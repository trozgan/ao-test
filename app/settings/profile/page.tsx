import type { Metadata } from "next";
import ProfileForm from "../../components/ProfileForm";
import Container from "../../components/Container";

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Update your name, email, and timezone.",
};

export default function ProfileSettings() {
  return (
    <Container className="py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Profile Settings
      </h1>
      <p className="mt-6 max-w-prose text-lg leading-8 text-foreground/70">
        Update your name, email, and timezone below.
      </p>
      <ProfileForm />
    </Container>
  );
}
