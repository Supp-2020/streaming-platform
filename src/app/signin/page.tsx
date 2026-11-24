"use client";
import Link from "next/link";
import { useState } from "react";

// UI only: there is no authentication. "Sign in" just continues to profile selection.
export default function SignInPage() {
  const [show, setShow] = useState(false);
  const field = "h-[52px] w-full rounded-lg border border-[#8a8378] bg-surface px-4 text-base text-fg placeholder:text-muted";

  return (
    <div className="flex min-h-screen">
      <main className="flex w-full flex-col justify-center gap-7 px-6 py-12 md:px-[72px] lg:w-[560px] lg:shrink-0">
        <Link href="/signin" className="font-display text-2xl font-extrabold tracking-tight">
          Kinora<span className="text-accent">.</span>
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-[44px]">Sign in</h1>
          <p className="text-base text-muted">Welcome back. Pick up where you left off.</p>
        </div>

        <form action="/profiles" onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="em" className="text-sm font-medium">
              Email
            </label>
            <input id="em" type="email" autoComplete="email" placeholder="name@example.com" className={field} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="pw" className="text-sm font-medium">
                Password
              </label>
              <a href="#" className="py-3 text-sm font-medium text-accent">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input id="pw" type={show ? "text" : "password"} autoComplete="current-password" className={`${field} pr-20`} />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-pressed={show}
                className="absolute right-1 top-1 h-11 px-3.5 text-sm font-semibold"
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px] text-[#cfc9be]">
            <input type="checkbox" className="h-5 w-5 accent-accent" />
            Keep me signed in on this device
          </label>

          <div className="flex flex-col gap-3">
            <Link href="/profiles" className="flex h-[52px] items-center justify-center rounded-lg bg-accent text-base font-semibold text-[#1a1208]">
              Sign in
            </Link>
            <div className="flex items-center gap-3 text-[13px] text-muted">
              <div className="h-px flex-1 bg-line" />
              or
              <div className="h-px flex-1 bg-line" />
            </div>
            <Link href="/profiles" className="flex h-[52px] items-center justify-center rounded-lg border border-[#8a8378] text-base font-semibold">
              Sign in with a code from your TV
            </Link>
          </div>
        </form>
        <p className="text-sm text-muted">
          New to Kinora?{" "}
          <Link href="/plans" className="font-semibold text-fg underline">
            Create an account
          </Link>
        </p>
        <p className="text-xs text-muted">Demo build: no account is needed and nothing is sent anywhere.</p>
      </main>

      <div aria-hidden="true" className="relative hidden flex-1 overflow-hidden bg-[#2b3a55] lg:block">
        <div className="absolute -right-20 -top-20 h-[520px] w-[520px] rounded-full bg-accent" />
        <div className="absolute bottom-0 left-[120px] h-[420px] w-[300px] rounded-t-full bg-bg" />
        <div className="absolute bottom-0 left-[300px] h-[240px] w-[420px] rounded-t-full bg-[#1b2336]" />
        <p className="absolute left-12 top-12 max-w-[420px] font-display text-[40px] font-extrabold leading-[1.05] tracking-tight">
          Stories worth turning the lights off for.
        </p>
      </div>
    </div>
  );
}
