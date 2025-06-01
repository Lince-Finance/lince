import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { QRCodeSVG } from "qrcode.react";

import UserLayout from "@/components/UserLayout";
import { csrfFetch } from "@/utils/fetcher";
import { requireMfaDisabled } from "@/lib/requireMfaDisabled";
import { useAuth } from "@/contexts/AuthContext";
import { Box, Button, Code, Link, Stack, Text } from "@chakra-ui/react";
import LoginFormHeading from "@/components/login/login-form-heading";
import { emailLoginBtnStyles, loginBtnStyles } from "@/styles/reusable-styles";

const formatSecret = (s: string) =>
  s
    .replace(/\s+/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();

function MfaAssociatePage() {
  const router = useRouter();

  const { user } = useAuth();

  useEffect(() => {
    if (user && user.mfaEnabled !== false) {
      router.replace("/user/profile");
    }
  }, [user, router]);

  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL as string;

  const [msg, setMsg] = useState("");
  const [otpauthUri, setOtpauthUri] = useState("");
  const [secretRaw, setSecretRaw] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  async function handleAssociate() {
    setMsg("Associating TOTP…");
    try {
      const res = await csrfFetch(`${baseUrl}/user/mfa-associate`, {
        method: "POST",
      });
      const data = await res.json();

      setMsg(
        "TOTP associated! ① Scan QR or introduce the manual key. ② Click \"Verify Code\"."
      );
      setOtpauthUri(data.otpauthUri);
      setSecretRaw(data.secretCode);
    } catch (err: any) {
      setMsg(`Error: ${err.message || "Network error"}`);
    }
  }

  async function handleReset() {
    setIsResetting(true);
    setMsg("Resetting MFA state...");
    try {
      const res = await csrfFetch(`${baseUrl}/user/mfa-reset`, {
        method: "POST",
      });
      await res.json();
      setMsg("MFA state reset successfully. You can now try again.");
      setOtpauthUri("");
      setSecretRaw("");
      window.location.reload();
    } catch (err: any) {
      setMsg(`Reset failed: ${err.message || "Network error"}`);
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <UserLayout>
      <Stack gap={6}>
        <LoginFormHeading
          title="Associate MFA (step 1)"
          desc="Associate MFA (step 1)"
        />

        {!otpauthUri && (
          <Button onClick={handleAssociate} {...emailLoginBtnStyles}>
            Associate TOTP
          </Button>
        )}

        {otpauthUri && (
          <>
            <Text color={"grayCliff.solid.400"}>{msg}</Text>

            <Box
              bg="white"
              display="flex"
              justifyContent="center"
              alignItems="center"
              p={4}
              borderRadius="md"
              boxShadow="md"
              maxW="300px"
              w="fit-content"
              aspectRatio="1"
              mx="auto"
            >
              <QRCodeSVG
                value={otpauthUri}
                size={260}
                level="M"
                marginSize={4}
                bgColor="#ffffff"
                fgColor="#000000"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  display: "block"
                }}
              />
            </Box>

            <Text color={"grayCliff.solid.50"}>
              <strong>Key:</strong>{" "}
              <Code letterSpacing={1.5}>{formatSecret(secretRaw)}</Code>{" "}
              <Button
                size="sm"
                ml={2}
                onClick={() => navigator.clipboard.writeText(secretRaw)}
              >
                Copiar
              </Button>
            </Text>

            <Link
              href={otpauthUri}
              color="grayCliff.solid.50"
              target="_blank"
              textDecoration="underline"
            >
              Open in Authenticator
            </Link>

            <Button
              onClick={() => router.push("/user/mfaVerify")}
              colorScheme="blue"
              {...loginBtnStyles}
            >
              Verify Code
            </Button>
          </>
        )}

        {msg && !otpauthUri && <Text color="red.500">{msg}</Text>}

        {!otpauthUri && (
          <Button
            onClick={handleReset}
            loading={isResetting}
            loadingText="Resetting..."
            variant="outline"
            size="sm"
            colorScheme="orange"
          >
            Reset MFA State
          </Button>
        )}
      </Stack>
    </UserLayout>
  );
}

export const getServerSideProps = requireMfaDisabled();

export default MfaAssociatePage;
