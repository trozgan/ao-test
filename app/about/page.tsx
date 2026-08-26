import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "About this Next.js application",
};

export default function About() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col justify-center gap-6 py-24 px-8 bg-white dark:bg-black sm:py-32 sm:px-16">
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 sm:text-4xl">
          About
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          This is a minimal Next.js application built with the App Router,
          TypeScript, and Tailwind CSS.
        </p>
        <Link
          href="/"
          className="font-medium text-zinc-950 underline dark:text-zinc-50"
        >
          Back to home
        </Link>
      </main>
    </div>
  );
}
