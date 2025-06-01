"use client";

import React, { useState, useEffect } from "react";
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

export default function ResetPage() {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email as string);
    }
  }, [router.query.email]);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    if (newPassword !== confirmNewPassword) {
      setMsg("Passwords do not match. Please check and try again.");
      return;
    }

    try {
      const res = await csrfFetch(`${baseUrl}/auth/reset`, {
        method: "POST",
        body: JSON.stringify({ email, code, newPassword }),
      });

      if (!res.ok) throw new Error(`Reset failed (${res.status})`);

      setMsg(
        "Password reset successfully! Please sign in with your new password."
      );

      setTimeout(() => {
        router.push(`/auth/signIn?email=${encodeURIComponent(email)}`);
      }, 2000);
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
            title="Reset your password"
            desc="Enter the code sent to your email and choose a new password."
          />
        </VStack>

        <Box
          as="form"
          onSubmit={handleReset}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            {...emailInputStyles}
            placeholder="Code from email"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <Input
            {...emailInputStyles}
            placeholder="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Input
            {...emailInputStyles}
            placeholder="Confirm new password"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />

          <Button {...emailLoginBtnStyles} type="submit">
            Reset Password
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
