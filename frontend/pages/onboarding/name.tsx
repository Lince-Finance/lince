import OnboardingContent from "@/components/onboarding/name/onboarding-content";
import CustomContainer from "@/components/reusable/CustomContainer";
import Head from "next/head";

const name = () => {
  return (
    <>
      <Head>
        <title>Onboarding Name - Lince</title>
        <meta
          name="description"
          content="Let's get to know you - what should we call you?"
        />
      </Head>

      <CustomContainer>
        <OnboardingContent />
      </CustomContainer>
    </>
  );
};

export default name;
