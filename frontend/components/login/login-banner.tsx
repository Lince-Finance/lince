import { Box, Center, Image } from "@chakra-ui/react";

import BannerImage from "@/assets/login-banner.png";
import Logo from "@/assets/logo.svg";

const LoginBanner = () => {
  return (
    <>
      {/* Top */}
      <Box w={"100%"} bg={"red.900"}>
        <Image
          src={BannerImage?.src}
          alt="login-banner"
          loading="lazy"
          w={"100%"}
          height={"100%"}
        />
      </Box>

      {/* Logo */}
      <Center mt={"-14"}>
        <Image src={Logo.src} alt="site_logo" loading="lazy" />
      </Center>
    </>
  );
};

export default LoginBanner;
