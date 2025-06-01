import React, { useState } from "react";
import { useRouter } from "next/router";
import UserLayout from "../../components/UserLayout";
import { csrfFetch } from "../../utils/fetcher";
import { withUserSSR } from "../../lib/withUserSSR";
import CustomContainer from "@/components/reusable/CustomContainer";

import Icon from "@/assets/lince-icon.svg";
import { Box, Button, Image, Input, VStack } from "@chakra-ui/react";
import LoginFormHeading from "@/components/login/login-form-heading";
import {
  emailInputStyles,
  emailLoginBtnStyles,
} from "@/styles/reusable-styles";

function ChangePasswordPage() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (newPassword !== confirmNewPassword) {
      setMsg("New passwords do not match.");
      return;
    }
    try {
      const res = await csrfFetch(`${baseUrl}/user/changePassword`, {
        method: "POST",
        body: JSON.stringify({
          oldPassword: currentPassword,
          newPassword,
        }),
      });
      await res.json();
      setMsg("Password changed successfully!");
      setTimeout(() => {
        router.push("/user/profile");
      }, 2000);
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  }

  return (
    <UserLayout>
      <CustomContainer p={"xl"}>
        {/* Top Part */}
        <Box w={"100%"}>
          <VStack w="100%" gap={6} alignItems={"start"}>
            <Image src={Icon.src} alt="lince-icon" w={12} h={12} />
            <LoginFormHeading
              title="Change Password"
              desc="It only takes a minute to change"
            />
          </VStack>

          {/* Bottom  */}
          <Box
            as={"form"}
            display={"flex"}
            flexDir={"column"}
            gap={"4xs"}
            onSubmit={handleChangePassword}
            w={"100%"}
          >
            <Box w={"100%"}>
              <Input
                {...emailInputStyles}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Box>

            <Box w={"100%"}>
              <Input
                {...emailInputStyles}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Box>

            <Box w={"100%"}>
              <Input
                {...emailInputStyles}
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </Box>

            <Button {...emailLoginBtnStyles} type="submit">
              Change Password
            </Button>
            {msg && <p>{msg}</p>}
          </Box>
        </Box>
      </CustomContainer>
    </UserLayout>
  );
}

export const getServerSideProps = withUserSSR();

export default ChangePasswordPage;
