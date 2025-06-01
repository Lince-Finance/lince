import IntroContent from "@/components/onboarding/intro/intro-content";
import CustomContainer from "@/components/reusable/CustomContainer";
import withAuth from "@/helpers/withAuth";
import { withUserSSR } from "@/lib/withUserSSR";

function AdvisorIntro() {
  return (
    <CustomContainer as="section" p={"2xl"}>
      <IntroContent />
    </CustomContainer>
  );
}

export const getServerSideProps = withUserSSR();
export default withAuth(AdvisorIntro);
