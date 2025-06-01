"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { VStack, Box, Input, Button, Text, Image } from "@chakra-ui/react";

import AuthLayout from "@/components/AuthLayout";
import { csrfFetch } from "@/utils/fetcher";
import Icon from "@/assets/lince-icon.svg";
import CustomContainer from "@/components/reusable/CustomContainer";
import LoginFormHeading from "@/components/login/login-form-heading";
import {
  emailInputStyles,
  emailLoginBtnStyles,
} from "@/styles/reusable-styles";
import { redirectIfLogged } from "@/lib/redirectIfLogged";

/* ---------- helpers ---------- */
function readInviteCookie(): string {
  const m = document.cookie.match(/(?:^|;\s*)inviteCode=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}
function clearInviteCookie() {
  document.cookie = "inviteCode=; Path=/auth; Max-Age=0; SameSite=None; Secure";
}
/* ----------------------------- */

export default function InvitePage() {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL as string;
  const router = useRouter();

  /* ► un único string */
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [invalid, setInvalid] = useState(false);

  /* precarga cookie */
  useEffect(() => {
    const cookieCode = readInviteCookie();
    if (cookieCode) setCode(cookieCode);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setInvalid(false);

    const trimmed = code.toUpperCase().trim();
    if (!trimmed) {
      setInvalid(true);
      return setMsg("Please enter your invite code");
    }

    setSending(true);
    try {
      await csrfFetch(`${baseUrl}/auth/invite`, {
        method: "POST",
        body: JSON.stringify({ inviteCode: trimmed }),
      });

      clearInviteCookie();
      setMsg("Invite accepted! Redirecting…");
      setTimeout(() => router.push("/user/dashboard"), 1000);
    } catch (err: any) {
      setInvalid(true);
      setMsg(err.message || "Error submitting invite");
    } finally {
      setSending(false);
    }
  }

  /* --------------- UI ---------------- */
  return (
    <AuthLayout>
      <CustomContainer as="section">
        <VStack w="100%" gap={6}>
          <Image src={Icon.src} alt="lince-icon" w={12} h={12} />
          <LoginFormHeading
            title="Activate your account"
            desc="Enter the invite code you received"
          />
        </VStack>

        <Box
          as="form"
          onSubmit={handleSubmit}
          w="100%"
          mt={8}
          display="flex"
          flexDir="column"
          gap={6}
        >
          {/* ► único campo de texto */}
          <Input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="INVITE CODE"
            {...emailInputStyles}
          />

          <Button {...emailLoginBtnStyles} type="submit" disabled={sending}>
            {sending ? "Sending…" : "Submit"}
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

export const getServerSideProps = redirectIfLogged();