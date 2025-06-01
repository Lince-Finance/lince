import React from "react";
import { useRouter } from "next/router";
import UserLayout from "../../components/UserLayout";
import { withUserSSR } from "../../lib/withUserSSR";
import { useAuth } from "@/contexts/AuthContext";
import { emailLoginBtnStyles, loginBtnStyles } from "@/styles/reusable-styles";
import CustomContainer from "@/components/reusable/CustomContainer";
import { Box, VStack } from "@chakra-ui/react";
import LoginFormHeading from "@/components/login/login-form-heading";

function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) return null;

  const mfaState = user.mfaEnabled;

  return (
    <UserLayout>
      <CustomContainer>
        {/* Top Part */}
        <Box w={"100%"}>
          <LoginFormHeading
            title="User Profile"
            desc="Account details"
          />

          <VStack w={"100%"} gap={"2xs"} mt={"2xl"}>
            <button
              {...emailLoginBtnStyles}
              onClick={() => router.push("/user/changePassword")}
            >
              Change Password
            </button>

            {mfaState === false && (
              <button
                {...loginBtnStyles}
                onClick={() => router.push("/user/mfaAssociate")}
              >
                Configure MFA
              </button>
            )}
            {mfaState === "PENDING" && (
              <button
                {...loginBtnStyles}
                onClick={() => router.push("/user/mfaVerify")}
              >
                Finish MFA setup
              </button>
            )}
          </VStack>
        </Box>
      </CustomContainer>
    </UserLayout>
  );
}

export const getServerSideProps = withUserSSR();

export default ProfilePage;
