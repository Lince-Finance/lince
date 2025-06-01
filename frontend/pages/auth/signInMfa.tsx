"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import { VStack, Box, Input, Button, Text, Image } from "@chakra-ui/react";
import AuthLayout from "@/components/AuthLayout";
import CustomContainer from "@/components/reusable/CustomContainer";
import LoginFormHeading from "@/components/login/login-form-heading";
import Icon from "@/assets/lince-icon.svg";
import { csrfFetch } from "@/utils/fetcher";
import { redirectIfLogged } from "@/lib/redirectIfLogged";
import {
  emailInputStyles,
  emailLoginBtnStyles,
} from "@/styles/reusable-styles";

interface Props {
  mfaToken: string | null;
}

export default function SignInMfaPage({ mfaToken }: Props) {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL as string;

  const [totpCode, setTotpCode] = useState("");
  const [msg, setMsg] = useState("");

  if (!mfaToken) {
    if (typeof window !== "undefined") router.replace("/auth");
    return null;
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    try {
      await csrfFetch(`${baseUrl}/auth/signinmfa`, {
        method: "POST",
        body: JSON.stringify({ mfaToken, totpCode }),
      });

      sessionStorage.removeItem("mfaToken");
      setMsg("MFA verified. Redirecting …");
      setTimeout(() => router.push("/user/dashboard"), 1500);
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  }

  return (
    <AuthLayout>
      <CustomContainer as="section" px="2xl">
        <VStack w="100%" gap={6} alignItems="start">
          <Image src={Icon.src} alt="lince-icon" w={12} h={12} />
          <LoginFormHeading
            title="Sign In – MFA"
            desc="Enter the 6-digit code from your Authenticator app"
          />
        </VStack>

        <Box
          as="form"
          onSubmit={handleVerify}
          w="100%"
          mt={8}
          display="flex"
          flexDir="column"
          gap={6}
        >
          <Input
            {...emailInputStyles}
            placeholder="123 456"
            type="text"
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value)}
          />

          <Button {...emailLoginBtnStyles} type="submit">
            Submit
          </Button>
        </Box>

        {msg && (
          <Text mt={4} color="grayCliff.solid.400" textAlign="center">
            {msg}
          </Text>
        )}
      </CustomContainer>
    </AuthLayout>
  );
}

export const getServerSideProps = async (ctx: any) => {
  return { props: { mfaToken: ctx.req.cookies?.mfaToken ?? null } };
};
