import { Box, Text } from "@chakra-ui/react";
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { loginCarouselData } from "@/data/placeholder-data";

const LoginCarousel = () => {
  return (
    <Box my={"l"} py={"6xs"} px={"2xl"}>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination]}
        className="mySwiper"
      >
        {loginCarouselData?.map(({ desc, id, title }) => (
          <SwiperSlide key={id}>
            <Box textAlign={"center"}>
              <Text color={"text.lince.inverted"} fontSize={"19.2px"}>
                {title}
              </Text>

              {/* Desc */}
              <Text
                color={"grayLince.fg.subtle"}
                fontWeight={"600"}
                fontSize={"step -1"}
                mt={"6xs"}
              >
                {desc?.split("\n").map((line, idx) => (
                  <Text as={"span"} key={idx}>
                    {line}
                    <br />
                  </Text>
                ))}
              </Text>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default LoginCarousel;
