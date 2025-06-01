import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import UserLayout from "../../components/UserLayout";
import { csrfFetch } from "../../utils/fetcher";
import { requireMfaPending } from "@/lib/requireMfaPending";
import { useAuth } from "@/contexts/AuthContext";
import CustomContainer from "@/components/reusable/CustomContainer";
import { Box, Button, Image, Input, VStack, Link as ChakraLink } from "@chakra-ui/react";

import Icon from "@/assets/lince-icon.svg";
import LoginFormHeading from "@/components/login/login-form-heading";
import {
  emailInputStyles,
  emailLoginBtnStyles,
} from "@/styles/reusable-styles";

function MfaVerifyPage() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const [msg, setMsg] = useState("");
  const [userCode, setUserCode] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    if (user && user.mfaEnabled === true) {
      router.replace("/user/profile");
    }
  }, [user, router]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setMsg("Verifying TOTP...");
    try {
      const res = await csrfFetch(`${baseUrl}/user/mfa-verify`, {
        method: "POST",
        body: JSON.stringify({ userCode }),
      });
      await res.json();
      setMsg("MFA TOTP verified & enabled successfully!");
      setTimeout(() => {
        router.push("/user/dashboard");
      }, 1500);
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  }

  return (
    <UserLayout>
      <CustomContainer as={"section"} p={"xl"}>
        <Box w={"100%"}>
          <VStack w="100%" gap={6} alignItems={"start"}>
            <Image src={Icon.src} alt="lince-icon" w={12} h={12} />
            <LoginFormHeading
              title="Verify MFA (Step 2)"
              desc="Enter your 6-digit code from Authenticator"
            />
          </VStack>

          <Box as={"form"} onSubmit={handleVerify}>
            <Input
              {...emailInputStyles}
              placeholder="MFA Code"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
            />
          </Box>
        </Box>

        <Box w={"100%"}>
          <Button {...emailLoginBtnStyles} type="submit" onClick={handleVerify}>
            Verify OTP
          </Button>
          {msg && <p>{msg}</p>}
          
          <Box mt={4}>
            <ChakraLink 
              onClick={() => router.push("/user/mfaAssociate")}
              color="blue.500"
              cursor="pointer"
              fontSize="sm"
            >
              ← Back to generate new QR code
            </ChakraLink>
          </Box>
        </Box>
      </CustomContainer>
    </UserLayout>
  );
}

export const getServerSideProps = requireMfaPending();

export default MfaVerifyPage;
