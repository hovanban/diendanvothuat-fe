"use client";

import React, { createContext, useContext, useState } from "react";
import { SignInDialog } from "@/components/auth/SignInDialog";

interface SignInContextType {
  openSignIn: () => void;
}

const SignInContext = createContext<SignInContextType>({ openSignIn: () => {} });

export function useSignIn() {
  return useContext(SignInContext);
}

export function SignInProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <SignInContext.Provider value={{ openSignIn: () => setOpen(true) }}>
      {children}
      <SignInDialog open={open} onOpenChange={setOpen} />
    </SignInContext.Provider>
  );
}
