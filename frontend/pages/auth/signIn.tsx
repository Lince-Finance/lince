import React, { useState, useEffect } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { Box, Button, Input, Text, HStack } from "@chakra-ui/react";

import AuthLayout from "@/components/AuthLayout";
import { csrfFetch } from "@/utils/fetcher";
import { useSignupCreds } from "@/contexts/SignupCredsContext";
import { redirectIfLogged } from "@/lib/redirectIfLogged";
import LoginFormHeading from "@/components/login/login-form-heading";
import {
  emailInputStyles,
  emailLoginBtnStyles,
} from "@/styles/reusable-styles";

export default function SignInPage() {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL as string;
  const router = useRouter();

  const { email: qEmail = "", name: qName = "" } = router.query as Record<
    string,
    string
  >;

  const email = qEmail.toString().trim().toLowerCase();

  useEffect(() => {
    if (!email && router.isReady) router.replace("/auth");
  }, [email, router]);

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const { clearCreds } = useSignupCreds();
  useEffect(clearCreds, []);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    try {
      const res = await csrfFetch(`${baseUrl}/auth/signin`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("[diag] signin fetch →", data);

      if (data.challenge === "SOFTWARE_TOKEN_MFA") {
        router.replace(`/auth/signInMfa?email=${encodeURIComponent(email)}`);
        return;
      }

      if (data.challenge === "UNCONFIRMED") {
        router.replace(`/auth/confirm?email=${encodeURIComponent(email)}`);
        return;
      }

      if (data.tokenType) {
        if (data.pendingInvite) {
          router.replace("/auth/invite");
          return;
        }

        if (data.pendingOnboarding) {
          router.replace("/advisor");
          return;
        }

        setMsg("Sign-in OK. Redirecting…");
        const handleStart = () =>
          Router.events.off("routeChangeStart", handleStart);
        Router.events.on("routeChangeStart", handleStart);
        setTimeout(() => router.push("/user/dashboard"), 800);
        return;
      }

      setMsg("Unexpected response.");
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  }

  return (
    <AuthLayout>
      <Box
        w="100%"
        maxW="500px"
        mx="auto"
        mt={["s", "l"]}
        px={["m", "2xl"]}
        pb={["xl", "7xl"]}
      >
        <LoginFormHeading
          title={qName ? `Welcome back, ${qName}` : "Welcome back"}
          desc="Enter your password to continue"
        />

        <Box
          as="form"
          onSubmit={handleSignIn}
          mt={["s", "l"]}
          display="flex"
          flexDir="column"
          gap={["4", "6"]}
        >
          <Input
            type="password"
            placeholder="Password"
            {...emailInputStyles}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            {...emailLoginBtnStyles}
            type="submit"
            disabled={password === ""}
          >
            Sign In
          </Button>
        </Box>

        {msg && (
          <Text mt={["2", "4"]} color="grayCliff.solid.400" textAlign="center">
            {msg}
          </Text>
        )}

        <HStack w="100%" justify="space-between" mt={["4", "8"]} fontSize="sm">
          <Link href={`/auth/forgot?email=${encodeURIComponent(email)}`}>
            Forgot your password?
          </Link>
          <Link href="/auth/signUp">Register here</Link>
        </HStack>
      </Box>
    </AuthLayout>
  );
}

export const getServerSideProps = redirectIfLogged();
