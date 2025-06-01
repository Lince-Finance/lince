import React from "react";
import Link from "next/link";
import UserLayout from "../../components/UserLayout";
import { withUserSSR } from "../../lib/withUserSSR";
import CustomContainer from "@/components/reusable/CustomContainer";
import LoginFormHeading from "@/components/login/login-form-heading";
import { Box } from "@chakra-ui/react";
import { emailLoginBtnStyles } from "@/styles/reusable-styles";
import DashboardHomeContainer from "@/components/dashboard/home/dashboard-home-container";
import PortfolioChart from "@/components/dashboard/home/portfolio-chart";

function DashboardPage() {
  return (
    <UserLayout>
      <CustomContainer>
        <Box w={"100%"}>
          <Box p={"xl"}>
            <PortfolioChart />
          </Box>

          <DashboardHomeContainer />

          <Box p={"xl"}>
            <Link href="/payments/buyCrypto">
              <Box as="button" {...emailLoginBtnStyles} mt={4} cursor="pointer">
                Buy crypto
              </Box>
            </Link>
          </Box>
        </Box>
      </CustomContainer>
    </UserLayout>
  );
}

export const getServerSideProps = withUserSSR();

export default DashboardPage;
