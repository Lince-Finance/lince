import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Choose a password",
  description:
    "Before we begin, let's set up a strong password to protect your account.",
};

import CustomContainer from "@/components/reusable/CustomContainer";
import ChoosePasswordContent from "@/components/signup/choose-password-content";
import Head from "next/head";

const ChoosePassword = () => {
  return (
    <>
      <Head>
        <title>Choose a password</title>
        <meta
          name="description"
          content="Before we begin, let's set up a strong password to protect your account."
        />
      </Head>

      <CustomContainer>
        <ChoosePasswordContent />
      </CustomContainer>
    </>
  );
};

export default ChoosePassword;
