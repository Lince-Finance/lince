"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  VStack,
  HStack,
  Box,
  Input,
  Button,
  Text,
  Image,
} from "@chakra-ui/react";

import AuthLayout from "@/components/AuthLayout";
import { csrfFetch } from "@/utils/fetcher";
import { getPasswordPolicy } from "@/utils/passwordPolicy";
import { useSignupCreds } from "@/contexts/SignupCredsContext";

/* UI */
import Icon from "@/assets/lince-icon.svg";
import CustomContainer from "@/components/reusable/CustomContainer";
import LoginFormHeading from "@/components/login/login-form-heading";
import ChoosePasswordInput from "@/components/signup/choose-password-input";
import StrengthMeter from "@/components/signup/strength-meter";
import { getPasswordStrength } from "@/helpers/password";
import {
  emailInputStyles,
  emailLoginBtnStyles,
} from "@/styles/reusable-styles";
import { redirectIfLogged } from "@/lib/redirectIfLogged";
// -----------------------------------------------------------------

export default function SignUpPage() {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL as string;
  const router = useRouter();

  const { email: qEmail = "" } = router.query as Record<string, string>;

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState(qEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [policy, setPolicy] = useState<{ minLength: number }>({ minLength: 8 });
  const [msg, setMsg] = useState("");

  const { setCreds } = useSignupCreds();

  useEffect(() => {
    getPasswordPolicy()
      .then(setPolicy)
      .catch(() => {});
  }, []);

  const pwdStrength = getPasswordStrength(password);
  const pwdIsStrong = pwdStrength === 3;

  const emailValid = /^[^\s@]+@[^\s@]+$/.test(email);

  /* --------------- submit ------------------ */
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    if (password.length < policy.minLength)
      return setMsg(`Password must be at least ${policy.minLength} characters`);
    if (password !== confirmPassword)
      return setMsg("Passwords do not match. Please check and try again.");

    try {
      const res = await csrfFetch(`${baseUrl}/auth/signup`, {
        method: "POST",
        body: JSON.stringify({ email, password, displayName }),
      });

      if (!res.ok) throw new Error(`Signup failed (${res.status})`);

      const { signupToken = "" } = await res.json().catch(() => ({}));
      setCreds({ email, password });
      router.replace(`/auth/confirm?t=${encodeURIComponent(signupToken)}`);
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  }

  return (
    <AuthLayout>
      <CustomContainer as="section" px={"2xl"}>
        <VStack w="100%" gap={6} alignItems={"start"}>
          <Image src={Icon.src} alt="lince-icon" w={12} h={12} />
          <LoginFormHeading
            title="Create account"
            desc="It only takes a minute to get started"
          />
        </VStack>

        <Box
          as="form"
          onSubmit={handleSignup}
          w="100%"
          mt={8}
          display="flex"
          flexDir="column"
          gap={6}
        >
          <Input
            {...emailInputStyles}
            placeholder="Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <Input
            {...emailInputStyles}
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <ChoosePasswordInput
            showPassword={showPassword}
            passwordValue={password}
            setPasswordValue={setPassword}
            setShowPassword={setShowPassword}
          />
          <StrengthMeter
            strength={pwdStrength}
            strengthColor={
              pwdStrength === 1
                ? "redInx.solid.300"
                : pwdStrength === 2
                ? "orangeInx.solid.400"
                : pwdStrength === 3
                ? "greenInx.solid.300"
                : "transparent"
            }
            strengthText={
              pwdStrength === 0
                ? ""
                : pwdStrength === 1
                ? "Weak"
                : pwdStrength === 2
                ? "Medium"
                : "Strong"
            }
          />

          <Input
            type="password"
            placeholder="Confirm password"
            p="m"
            rounded="l2"
            border="2px solid"
            borderColor="grayCliff.solid.800"
            h="9xl"
            color="grayCliff.solid.100"
            _placeholder={{ color: "grayCliff.solid.400" }}
            _focus={{ borderColor: "grayCliff.solid.500", outline: "none" }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            {...emailLoginBtnStyles}
            type="submit"
            disabled={!emailValid || !pwdIsStrong}
          >
            Sign Up
          </Button>
        </Box>

        {msg && (
          <Text mt={4} color="grayCliff.solid.400" textAlign="center">
            {msg}
          </Text>
        )}

        <HStack w="100%" justify="center" mt={8} fontSize="sm">
          <Text>Already have an account?</Text>
          <Link href="/auth/signIn">Sign in</Link>
        </HStack>
      </CustomContainer>
    </AuthLayout>
  );
}

export const getServerSideProps = redirectIfLogged();
