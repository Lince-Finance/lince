"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  VStack,
  Box,
  Input,
  Button,
  Text,
  HStack,
  Image,
} from "@chakra-ui/react";

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

export default function ForgotPage() {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await csrfFetch(`${baseUrl}/auth/forgot`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMsg("A code has been sent to your email. Redirecting to reset...");
      setTimeout(() => {
        router.push(`/auth/reset?email=${encodeURIComponent(email)}`);
      }, 1500);
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
            title="Forgot your password?"
            desc="Enter your email and we’ll send you a reset code."
          />
        </VStack>

        <Box
          as="form"
          onSubmit={handleForgot}
          w="100%"
          mt={8}
          display="flex"
          flexDir="column"
          gap={6}
        >
          <Input
            {...emailInputStyles}
            placeholder="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button {...emailLoginBtnStyles} type="submit">
            Send Code
          </Button>
        </Box>

        {msg && (
          <Text mt={4} color="grayCliff.solid.400" textAlign="center">
            {msg}
          </Text>
        )}

        <HStack w="100%" justify="center" mt={8} fontSize="sm">
          <Text>Remembered your password?</Text>
          <Link href="/auth/signIn">Sign in</Link>
        </HStack>
      </CustomContainer>
    </AuthLayout>
  );
}

export const getServerSideProps = redirectIfLogged();
