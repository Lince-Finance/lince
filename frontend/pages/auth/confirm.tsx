"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import { VStack, Box, Button, Text, Image } from "@chakra-ui/react";

import AuthLayout from "@/components/AuthLayout";
import { csrfFetch } from "@/utils/fetcher";
import { GetServerSideProps } from "next";
import { useSignupCreds } from "@/contexts/SignupCredsContext";

/* UI */
import Icon from "@/assets/lince-icon.svg";
import CustomContainer from "@/components/reusable/CustomContainer";
import LoginFormHeading from "@/components/login/login-form-heading";
import OTPBox from "@/components/signup/otp-box";
import { emailLoginBtnStyles } from "@/styles/reusable-styles";
import { redirectIfLogged } from "@/lib/redirectIfLogged";
/* ----- */

interface Props {
  signupToken: string | null;
}

export default function ConfirmPage({ signupToken }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL!;
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [msg, setMsg] = useState("");

  const { creds, clearCreds } = useSignupCreds();

  if (!signupToken) return null;

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    const code = otp.join("");
    if (code.length !== 6) return setMsg("Enter the 6-digit code");

    try {
      const r = await csrfFetch(`${baseUrl}/auth/confirm`, {
        method: "POST",
        body: JSON.stringify({ token: signupToken, code }),
      });
      if (!r.ok) throw new Error(`confirm → ${r.status}`);

      if (creds.email && creds.password) {
        try {
          const r = await csrfFetch(`${baseUrl}/auth/signin`, {
            method: "POST",
            body: JSON.stringify({
              email: creds.email,
              password: creds.password,
            }),
          });
          if (!r.ok) throw new Error(`signin → ${r.status}`);
          const data = await r.json();
          
          if (data.pendingInvite) {
            clearCreds();
            return router.replace("/auth/invite");
          }
          if (data.pendingOnboarding) {
            clearCreds();
            return router.replace("/advisor");
          }
        } catch (err) {
          console.error("[auto-login]", err);
        }
        clearCreds();
      }

      setMsg("Confirmed! Redirecting…");
      setTimeout(() => router.push("/user/dashboard"), 800);
    } catch (err: any) {
      if (err.message.includes("expired"))
        setMsg("Your token has expired. Please sign up again.");
      else setMsg(`Error: ${err.message}`);
    }
  }

  async function handleResend() {
    try {
      setMsg("Resending code…");
      await csrfFetch(`${baseUrl}/auth/resend`, {
        method: "POST",
        body: JSON.stringify({ token: signupToken }),
      });
      setMsg("New code sent! Check your email.");
    } catch (err: any) {
      setMsg(err.message || "Unable to resend");
    }
  }

  return (
    <AuthLayout>
      <CustomContainer as="section" px={"2xl"}>
        {/* Top Part */}
        <Box w={"100%"}>
          <VStack w="100%" gap={6} alignItems={"start"}>
            <Image src={Icon.src} alt="lince-icon" w={12} h={12} />
            <LoginFormHeading
              title="Confirm your email"
              desc="Enter the 6-digit code we just sent you"
            />
          </VStack>

          <Box
            as="form"
            onSubmit={handleConfirm}
            w="100%"
            mt={8}
            display="flex"
            flexDir="column"
            gap={6}
          >
            <OTPBox value={otp} setValue={setOtp} />

            <Button {...emailLoginBtnStyles} type="submit">
              Confirm
            </Button>

            <Button
              variant="ghost"
              fontWeight="400"
              onClick={handleResend}
              _hover={{ textDecoration: "underline" }}
            >
              Resend code
            </Button>
          </Box>

          {msg && (
            <Text mt={4} color="grayCliff.solid.400" textAlign="center">
              {msg}
            </Text>
          )}
        </Box>
      </CustomContainer>
    </AuthLayout>
  );
}

export const getServerSideProps: GetServerSideProps = redirectIfLogged(
  async ({ req, query }) => {
    const signupToken =
      (query.t as string | undefined) || req.cookies.signupToken || null;

    if (!signupToken)
      return { redirect: { destination: "/auth/signUp", permanent: false } };

    return { props: { signupToken } };
  }
);