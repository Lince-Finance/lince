import LoginBanner from "@/components/login/login-banner";
import LoginBtns from "@/components/login/login-btns";
import LoginCarousel from "@/components/login/login-carousel";
import { Box } from "@chakra-ui/react";

const login = () => {
  return (
    <Box bg={"black"} minH={"100dvh"}>
      {/* Banner */}
      <LoginBanner />

      {/* Carousel */}
      <LoginCarousel />

      {/* Btns */}
      <LoginBtns />
    </Box>
  );
};

export default login;
