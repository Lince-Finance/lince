import IntroContent from "@/components/onboarding/intro/intro-content";
import CustomContainer from "@/components/reusable/CustomContainer";
import Head from "next/head";

const intro = () => {
  return (
    <>
      <Head>
        <title>Onboarding Questions - Intro</title>

        <meta
          name="description"
          content="I'll analyze your responses to build your personalized investment plan. "
        />
      </Head>

      <CustomContainer>
        <IntroContent />
      </CustomContainer>
    </>
  );
};

export default intro;
