import { useEffect } from "react";
import { useRouter } from "next/router";
import { useRiskStore } from "@/contexts/useRiskStore";
import { withAuth } from "@/helpers/withAuth";
import { withUserSSR } from "@/lib/withUserSSR";
import CustomContainer from "@/components/reusable/CustomContainer";
import { Box, Center, SkeletonCircle, Spinner } from "@chakra-ui/react";
import ContainerTopBox from "@/components/reusable/container-top-box";

function BuildingPage() {
  const router = useRouter();
  const { answers, reset } = useRiskStore();

  useEffect(() => {
    let cancel = false;

    (async () => {
      try {
        const res = await fetch("/api/advisor/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ answers }),
        });
        if (!cancel) {
          const json = await res.json();

          router.replace({
            pathname: "/advisor/result",
            query: { data: encodeURIComponent(JSON.stringify(json)) },
          });
        }
      } catch (err) {
        console.error(err);
        if (!cancel) reset();
      }
    })();

    return () => {
      cancel = true;
    };
  }, []);

  return (
    <CustomContainer p={"xl"}>
      {/* Top Part */}
      <Box w={"100%"}>
        <ContainerTopBox
          title="Building...."
          desc="Please give us some time to build your investment strategy."
          showIcon={false}
        />

        <Center w={"100%"} mt={"10vh"}>
          <Spinner w={"32"} h={"32"} rounded={"100%"} />
        </Center>
      </Box>
    </CustomContainer>
  );
}

export const getServerSideProps = withUserSSR();
export default withAuth(BuildingPage);
