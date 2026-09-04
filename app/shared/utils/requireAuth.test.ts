import { describe, expect, it, vi } from "vitest";
import { requireAuth } from "./requireAuth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const router = {
   push: vi.fn()
} as unknown as AppRouterInstance;

describe("", () => {

   it("if the user didn't sign in return false", () => {
      const isSignedIn = false
      expect(requireAuth({isSignedIn, router})).toBe(false)
   })

   it("if the user signed in return true", () => {
      const isSignedIn = true
      expect(requireAuth({isSignedIn, router})).toBe(true)
   })

}) 