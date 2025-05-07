// theme.ts
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  strictTokens: true,
  theme: {
    tokens: {
      colors: {
        transparent: {
          value: "rgba(255, 255, 255, 0)",
        },
        black: {
          value: "#090b0b",
        },
        white: {
          value: "#ffffff",
        },
        whiteAlpha: {
          "50": {
            value: "rgba(255, 255, 255, 4)",
          },
          "100": {
            value: "rgba(255, 255, 255, 6)",
          },
          "200": {
            value: "rgba(255, 255, 255, 8)",
          },
          "300": {
            value: "rgba(255, 255, 255, 16)",
          },
          "400": {
            value: "rgba(255, 255, 255, 24)",
          },
          "500": {
            value: "rgba(255, 255, 255, 36)",
          },
          "600": {
            value: "rgba(255, 255, 255, 48)",
          },
          "700": {
            value: "rgba(255, 255, 255, 64)",
          },
          "800": {
            value: "rgba(255, 255, 255, 80)",
          },
          "900": {
            value: "rgba(255, 255, 255, 92)",
          },
          "950": {
            value: "rgba(255, 255, 255, 95)",
          },
        },
        blackAlpha: {
          "50": {
            value: "rgba(0, 0, 0, 4)",
          },
          "100": {
            value: "rgba(0, 0, 0, 6)",
          },
          "200": {
            value: "rgba(0, 0, 0, 8)",
          },
          "300": {
            value: "rgba(0, 0, 0, 16)",
          },
          "400": {
            value: "rgba(0, 0, 0, 24)",
          },
          "500": {
            value: "rgba(0, 0, 0, 36)",
          },
          "600": {
            value: "rgba(0, 0, 0, 48)",
          },
          "700": {
            value: "rgba(0, 0, 0, 64)",
          },
          "800": {
            value: "rgba(0, 0, 0, 80)",
          },
          "900": {
            value: "rgba(0, 0, 0, 92)",
          },
          "950": {
            value: "rgba(0, 0, 0, 95)",
          },
        },
        grayCliff: {
          solid: {
            "50": {
              value: "#f1f0ee",
            },
            "100": {
              value: "#ecebe8",
            },
            "200": {
              value: "#cdcbc3",
            },
            "300": {
              value: "#b3afa3",
            },
            "400": {
              value: "#9c9888",
            },
            "500": {
              value: "#888471",
            },
            "600": {
              value: "#716e5e",
            },
            "700": {
              value: "#4c4b3f",
            },
            "800": {
              value: "#3f3d35",
            },
            "900": {
              value: "#373630",
            },
            "950": {
              value: "#1c1b17",
            },
          },
          alpha: {
            "50": {
              value: "rgba(56, 56, 82, 4)",
            },
            "100": {
              value: "rgba(11, 11, 40, 7.000000000000001)",
            },
            "200": {
              value: "rgba(8, 8, 28, 15)",
            },
            "300": {
              value: "rgba(5, 5, 31, 28.000000000000004)",
            },
            "400": {
              value: "rgba(4, 6, 27, 43)",
            },
            "500": {
              value: "rgba(4, 6, 27, 55.00000000000001)",
            },
            "600": {
              value: "rgba(1, 1, 19, 63)",
            },
            "700": {
              value: "rgba(4, 4, 16, 70)",
            },
            "800": {
              value: "rgba(3, 3, 13, 75)",
            },
            "900": {
              value: "rgba(2, 2, 9, 78)",
            },
            "950": {
              value: "rgba(1, 1, 4, 85)",
            },
          },
          alphaDark: {
            "50": {
              value: "rgba(252, 252, 253, 98)",
            },
            "100": {
              value: "rgba(252, 252, 253, 95)",
            },
            "200": {
              value: "rgba(251, 251, 254, 87)",
            },
            "300": {
              value: "rgba(242, 242, 253, 76)",
            },
            "400": {
              value: "rgba(237, 239, 253, 62)",
            },
            "500": {
              value: "rgba(229, 232, 255, 51)",
            },
            "600": {
              value: "rgba(227, 227, 252, 42)",
            },
            "700": {
              value: "rgba(228, 228, 251, 35)",
            },
            "800": {
              value: "rgba(222, 222, 247, 30)",
            },
            "900": {
              value: "rgba(223, 223, 246, 26)",
            },
            "950": {
              value: "rgba(228, 228, 247, 17)",
            },
          },
        },
        orangeInx: {
          solid: {
            "50": {
              value: "#fcf6f4",
            },
            "100": {
              value: "#f9ebe7",
            },
            "200": {
              value: "#f5dad3",
            },
            "300": {
              value: "#f0cbc1",
            },
            "400": {
              value: "#e19b88",
            },
            "500": {
              value: "#d17a62",
            },
            "600": {
              value: "#bc5f46",
            },
            "700": {
              value: "#9e4d37",
            },
            "800": {
              value: "#834231",
            },
            "900": {
              value: "#6e3c2e",
            },
            "950": {
              value: "#3b1c14",
            },
          },
          alpha: {
            "50": {
              value: "rgba(224, 112, 26, 7.000000000000001)",
            },
            "100": {
              value: "rgba(227, 89, 2, 15)",
            },
            "200": {
              value: "rgba(222, 83, 2, 30)",
            },
            "300": {
              value: "rgba(225, 78, 5, 50)",
            },
            "400": {
              value: "rgba(218, 63, 1, 74)",
            },
            "500": {
              value: "rgba(219, 51, 0, 82)",
            },
            "600": {
              value: "rgba(202, 35, 2, 87)",
            },
            "700": {
              value: "rgba(163, 19, 0, 88)",
            },
            "800": {
              value: "rgba(126, 10, 2, 88)",
            },
            "900": {
              value: "rgba(96, 9, 1, 89)",
            },
            "950": {
              value: "rgba(51, 3, 0, 95)",
            },
          },
        },
        goldFang: {
          solid: {
            "50": {
              value: "#cabe90",
            },
            "100": {
              value: "#baaa6e",
            },
            "200": {
              value: "#ab9952",
            },
            "300": {
              value: "#928346",
            },
            "400": {
              value: "#7d703c",
            },
            "500": {
              value: "#6b6033",
            },
            "600": {
              value: "#59502a",
            },
            "700": {
              value: "#4a4223",
            },
            "800": {
              value: "#3d371d",
            },
            "900": {
              value: "#332e18",
            },
            "950": {
              value: "#2a2614",
            },
          },
          alpha: {
            "50": {
              value: "rgba(157, 157, 12, 7.000000000000001)",
            },
            "100": {
              value: "rgba(150, 162, 11, 18)",
            },
            "200": {
              value: "rgba(156, 158, 5, 34)",
            },
            "300": {
              value: "rgba(157, 151, 2, 53)",
            },
            "400": {
              value: "rgba(154, 144, 4, 68)",
            },
            "500": {
              value: "rgba(141, 127, 2, 73)",
            },
            "600": {
              value: "rgba(110, 90, 2, 79)",
            },
            "700": {
              value: "rgba(86, 62, 1, 81)",
            },
            "800": {
              value: "rgba(65, 44, 1, 82)",
            },
            "900": {
              value: "rgba(55, 33, 1, 83)",
            },
            "950": {
              value: "rgba(34, 20, 2, 92)",
            },
          },
        },
        greenInx: {
          solid: {
            "50": {
              value: "#f3faf7",
            },
            "100": {
              value: "#d7f0e8",
            },
            "200": {
              value: "#afe0d0",
            },
            "300": {
              value: "#7fc9b5",
            },
            "400": {
              value: "#65b4a1",
            },
            "500": {
              value: "#3b917d",
            },
            "600": {
              value: "#2d7466",
            },
            "700": {
              value: "#285d53",
            },
            "800": {
              value: "#234c44",
            },
            "900": {
              value: "#21403a",
            },
            "950": {
              value: "#0e2521",
            },
          },
          alpha: {
            "50": {
              value: "rgba(57, 224, 11, 9)",
            },
            "100": {
              value: "rgba(49, 217, 2, 19)",
            },
            "200": {
              value: "rgba(45, 217, 2, 36)",
            },
            "300": {
              value: "rgba(41, 212, 2, 56.99999999999999)",
            },
            "400": {
              value: "rgba(35, 202, 2, 70)",
            },
            "500": {
              value: "rgba(27, 179, 0, 86)",
            },
            "600": {
              value: "rgba(20, 142, 1, 91)",
            },
            "700": {
              value: "rgba(10, 102, 0, 91)",
            },
            "800": {
              value: "rgba(9, 75, 1, 91)",
            },
            "900": {
              value: "rgba(8, 59, 2, 91)",
            },
            "950": {
              value: "rgba(2, 36, 0, 97)",
            },
          },
        },
        blueInx: {
          solid: {
            "50": {
              value: "#f2f7f9",
            },
            "100": {
              value: "#dfebee",
            },
            "200": {
              value: "#c2d8df",
            },
            "300": {
              value: "#98bbc8",
            },
            "400": {
              value: "#6999ab",
            },
            "500": {
              value: "#4b7b8f",
            },
            "600": {
              value: "#416679",
            },
            "700": {
              value: "#3a5564",
            },
            "800": {
              value: "#354955",
            },
            "900": {
              value: "#303e49",
            },
            "950": {
              value: "#1c2730",
            },
          },
          alpha: {
            "50": {
              value: "rgba(15, 96, 194, 5)",
            },
            "100": {
              value: "rgba(5, 94, 184, 10)",
            },
            "200": {
              value: "rgba(0, 97, 189, 22)",
            },
            "300": {
              value: "rgba(3, 103, 191, 42)",
            },
            "400": {
              value: "rgba(2, 107, 187, 64)",
            },
            "500": {
              value: "rgba(3, 98, 176, 79)",
            },
            "600": {
              value: "rgba(2, 79, 146, 85)",
            },
            "700": {
              value: "rgba(2, 63, 121, 87)",
            },
            "800": {
              value: "rgba(0, 47, 92, 88)",
            },
            "900": {
              value: "rgba(0, 36, 71, 88)",
            },
            "950": {
              value: "rgba(2, 22, 44, 93)",
            },
          },
        },
        redInx: {
          solid: {
            "50": {
              value: "#e2c7c7",
            },
            "100": {
              value: "#f7edec",
            },
            "200": {
              value: "#f0dddb",
            },
            "300": {
              value: "#e3c1be",
            },
            "400": {
              value: "#d39d99",
            },
            "500": {
              value: "#bf7774",
            },
            "600": {
              value: "#ac5d5d",
            },
            "700": {
              value: "#8c4446",
            },
            "800": {
              value: "#763b3e",
            },
            "900": {
              value: "#663539",
            },
            "950": {
              value: "#371a1c",
            },
          },
          alpha: {
            "50": {
              value: "rgba(239, 37, 37, 6)",
            },
            "100": {
              value: "rgba(240, 0, 0, 11)",
            },
            "200": {
              value: "rgba(240, 0, 0, 20)",
            },
            "300": {
              value: "rgba(239, 6, 6, 35)",
            },
            "400": {
              value: "rgba(233, 1, 1, 54)",
            },
            "500": {
              value: "rgba(222, 2, 2, 75)",
            },
            "600": {
              value: "rgba(208, 1, 1, 83)",
            },
            "700": {
              value: "rgba(171, 3, 3, 88)",
            },
            "800": {
              value: "rgba(138, 0, 0, 88)",
            },
            "900": {
              value: "rgba(105, 2, 2, 88)",
            },
            "950": {
              value: "rgba(59, 2, 2, 96)",
            },
          },
        },
      },
      radii: {
        "2xs": { value: "clamp(0.125rem, 0.1126rem + 0.0603vw, 0.1875rem)" },
        xs: { value: "clamp(0.25rem, 0.2253rem + 0.1206vw, 0.375rem)" },
        sm: { value: "clamp(0.375rem, 0.3379rem + 0.1809vw, 0.5625rem)" },
        md: { value: "clamp(0.5rem, 0.4505rem + 0.2413vw, 0.75rem)" },
        lg: { value: "clamp(0.625rem, 0.5632rem + 0.3016vw, 0.9375rem)" },
        xl: { value: "clamp(0.75rem, 0.6758rem + 0.3619vw, 1.125rem)" },
        "2xl": { value: "clamp(0.875rem, 0.7884rem + 0.4222vw, 1.3125rem)" },
        "3xl": { value: "clamp(1rem, 0.9011rem + 0.4825vw, 1.5rem)" },
        "4xl": { value: "clamp(1.125rem, 1.0137rem + 0.5428vw, 1.6875rem)" },
        full: { value: "9999px" },
      },
      blurs: {
        xs: { value: "2px" },
        sm: { value: "4px" },
        md: { value: "8px" },
        lg: { value: "16px" },
        xl: { value: "24px" },
        "2xl": { value: "40px" },
        "3xl": { value: "400px" },
      },
      breakpoints: {
        min: { value: "328px" },
        sm: { value: "768px" },
        md: { value: "1024px" },
        lg: { value: "1440px" },
        max: { value: "1986px" },
      },
      sizes: {
        "7xs": { value: "clamp(0.125rem, 0.1126rem + 0.0603vw, 0.1875rem)" },
        "6xs": { value: "clamp(0.25rem, 0.2253rem + 0.1206vw, 0.375rem)" },
        "5xs": { value: "clamp(0.375rem, 0.3379rem + 0.1809vw, 0.5625rem)" },
        "4xs": { value: "clamp(0.5rem, 0.4505rem + 0.2413vw, 0.75rem)" },
        "3xs": { value: "clamp(0.625rem, 0.5632rem + 0.3016vw, 0.9375rem)" },
        "2xs": { value: "clamp(0.75rem, 0.6758rem + 0.3619vw, 1.125rem)" },
        xs: { value: "clamp(0.875rem, 0.7884rem + 0.4222vw, 1.3125rem)" },
        s: { value: "clamp(1rem, 0.9011rem + 0.4825vw, 1.5rem)" },
        m: { value: "clamp(1.125rem, 1.0137rem + 0.5428vw, 1.6875rem)" },
        l: { value: "clamp(1.25rem, 1.1264rem + 0.6031vw, 1.875rem)" },
        xl: { value: "clamp(1.5rem, 1.3516rem + 0.7238vw, 2.25rem)" },
        "2xl": { value: "clamp(1.75rem, 1.5769rem + 0.8444vw, 2.625rem)" },
        "3xl": { value: "clamp(2rem, 1.8022rem + 0.965vw, 3rem)" },
        "4xl": { value: "clamp(2.25rem, 2.0274rem + 1.0856vw, 3.375rem)" },
        "5xl": { value: "clamp(2.5rem, 2.2527rem + 1.2063vw, 3.75rem)" },
        "6xl": { value: "clamp(2.80rem, 2.478rem + 1.3269vw, 4.125rem)" },
        "7xl": { value: "clamp(3rem, 2.7033rem + 1.4475vw, 4.5rem)" },
        "8xl": { value: "clamp(3.5rem, 3.1538rem + 1.6888vw, 5.25rem)" },
        "9xl": { value: "clamp(4rem, 3.6043rem + 1.93vw, 6rem)" },
        "10xl": { value: "clamp(5rem, 4.5054rem + 2.4125vw, 7.5rem)" },
        "11xl": { value: "clamp(6rem, 5.4065rem + 2.8951vw, 9rem)" },
        "12xl": { value: "clamp(7rem, 6.3076rem + 3.3776vw, 10.5rem)" },
        "13xl": { value: "clamp(8rem, 7.2087rem + 3.8601vw, 12rem)" },
        "14xl": { value: "clamp(9rem, 8.1098rem + 4.3426vw, 13.5rem)" },
        "15xl": { value: "clamp(10rem, 9.0109rem + 4.8251vw, 15rem)" },
        "16xl": { value: "clamp(11rem, 9.9119rem + 5.3076vw, 16.5rem)" },
        "17xl": { value: "clamp(12rem, 10.813rem + 5.7901vw, 18rem)" },
        "18xl": { value: "clamp(13rem, 11.7141rem + 6.2726vw, 19.5rem)" },
        "19xl": { value: "clamp(14rem, 12.6152rem + 6.7551vw, 21rem)" },
        "20xl": { value: "clamp(15rem, 13.5163rem + 7.2376vw, 22.5rem)" },
        "21xl": { value: "clamp(16rem, 14.4174rem + 7.7201vw, 24rem)" },
        "22xl": { value: "clamp(18rem, 16.2195rem + 8.6852vw, 27rem)" },
        "23xl": { value: "clamp(20rem, 18.0217rem + 9.6502vw, 30rem)" },
        "24xl": { value: "clamp(24rem, 21.6261rem + 11.5802vw, 36rem)" },
      },
      spacing: {
        "7xs": { value: "clamp(0.125rem, 0.1126rem + 0.0603vw, 0.1875rem)" },
        "6xs": { value: "clamp(0.25rem, 0.2253rem + 0.1206vw, 0.375rem)" },
        "5xs": { value: "clamp(0.375rem, 0.3379rem + 0.1809vw, 0.5625rem)" },
        "4xs": { value: "clamp(0.5rem, 0.4505rem + 0.2413vw, 0.75rem)" },
        "3xs": { value: "clamp(0.625rem, 0.5632rem + 0.3016vw, 0.9375rem)" },
        "2xs": { value: "clamp(0.75rem, 0.6758rem + 0.3619vw, 1.125rem)" },
        xs: { value: "clamp(0.875rem, 0.7884rem + 0.4222vw, 1.3125rem)" },
        s: { value: "clamp(1rem, 0.9011rem + 0.4825vw, 1.5rem)" },
        m: { value: "clamp(1.125rem, 1.0137rem + 0.5428vw, 1.6875rem)" },
        l: { value: "clamp(1.25rem, 1.1264rem + 0.6031vw, 1.875rem)" },
        xl: { value: "clamp(1.5rem, 1.3516rem + 0.7238vw, 2.25rem)" },
        "2xl": { value: "clamp(1.75rem, 1.5769rem + 0.8444vw, 2.625rem)" },
        "3xl": { value: "clamp(2rem, 1.8022rem + 0.965vw, 3rem)" },
        "4xl": { value: "clamp(2.25rem, 2.0274rem + 1.0856vw, 3.375rem)" },
        "5xl": { value: "clamp(2.5rem, 2.2527rem + 1.2063vw, 3.75rem)" },
        "6xl": { value: "clamp(2.75rem, 2.478rem + 1.3269vw, 4.125rem)" },
        "7xl": { value: "clamp(3rem, 2.7033rem + 1.4475vw, 4.5rem)" },
        "8xl": { value: "clamp(3.5rem, 3.1538rem + 1.6888vw, 5.25rem)" },
        "9xl": { value: "clamp(4rem, 3.6043rem + 1.93vw, 6rem)" },
        "10xl": { value: "clamp(5rem, 4.5054rem + 2.4125vw, 7.5rem)" },
        "11xl": { value: "clamp(6rem, 5.4065rem + 2.8951vw, 9rem)" },
        "12xl": { value: "clamp(7rem, 6.3076rem + 3.3776vw, 10.5rem)" },
        "13xl": { value: "clamp(8rem, 7.2087rem + 3.8601vw, 12rem)" },
        "14xl": { value: "clamp(9rem, 8.1098rem + 4.3426vw, 13.5rem)" },
        "15xl": { value: "clamp(10rem, 9.0109rem + 4.8251vw, 15rem)" },
        "16xl": { value: "clamp(11rem, 9.9119rem + 5.3076vw, 16.5rem)" },
        "17xl": { value: "clamp(12rem, 10.813rem + 5.7901vw, 18rem)" },
        "18xl": { value: "clamp(13rem, 11.7141rem + 6.2726vw, 19.5rem)" },
        "19xl": { value: "clamp(14rem, 12.6152rem + 6.7551vw, 21rem)" },
        "20xl": { value: "clamp(15rem, 13.5163rem + 7.2376vw, 22.5rem)" },
        "21xl": { value: "clamp(16rem, 14.4174rem + 7.7201vw, 24rem)" },
        "22xl": { value: "clamp(18rem, 16.2195rem + 8.6852vw, 27rem)" },
        "23xl": { value: "clamp(20rem, 18.0217rem + 9.6502vw, 30rem)" },
        "24xl": { value: "clamp(24rem, 21.6261rem + 11.5802vw, 36rem)" },
      },
      fontSizes: {
        "step -5": {
          value: "clamp(0.4019rem, 0.3841rem + 0.0865vw, 0.4915rem)",
        },
        "step -4": {
          value: "clamp(0.4823rem, 0.4561rem + 0.1275vw, 0.6144rem)",
        },
        "step -3": {
          value: "clamp(0.5787rem, 0.5413rem + 0.1827vw, 0.768rem)",
        },
        "step -2": { value: "clamp(0.6944rem, 0.6419rem + 0.2563vw, 0.96rem)" },
        "step -1": { value: "clamp(0.8333rem, 0.7608rem + 0.3538vw, 1.2rem)" },
        step0: { value: "clamp(1rem, 0.9011rem + 0.4825vw, 1.5rem)" },
        step1: { value: "clamp(1.2rem, 1.0665rem + 0.6514vw, 1.875rem)" },
        step2: { value: "clamp(1.44rem, 1.2612rem + 0.8721vw, 2.3438rem)" },
        step3: { value: "clamp(1.728rem, 1.4903rem + 1.1597vw, 2.9297rem)" },
        step4: { value: "clamp(2.0736rem, 1.7593rem + 1.5329vw, 3.6621rem)" },
        step5: { value: "clamp(2.4883rem, 2.075rem + 2.0162vw, 4.5776rem)" },
        step6: { value: "clamp(2.986rem, 2.4447rem + 2.6403vw, 5.722rem)" },
        step7: { value: "clamp(3.5832rem, 2.8771rem + 3.4445vw, 7.1526rem)" },
        step8: { value: "clamp(4.2998rem, 3.3817rem + 4.4785vw, 8.9407rem)" },
        step9: { value: "clamp(5.1598rem, 3.9696rem + 5.8056vw, 11.1759rem)" },
        step10: { value: "clamp(6.1917rem, 4.653rem + 7.506vw, 13.9698rem)" },
      },
    },
    semanticTokens: {
      colors: {
        text: {
          lince: {
            fg: {
              value: "{colors.grayCliff.solid.900}",
            },
            muted: {
              value: "{colors.grayCliff.solid.600}",
            },
            subtle: {
              value: "{colors.grayCliff.solid.400}",
            },
            inverted: {
              value: "{colors.grayCliff.solid.100}",
            },
          },
        },
        grayLince: {
          fg: {
            contrast: {
              value: "{colors.white}",
            },
            fg: {
              value: "{colors.black}",
            },
            muted: {
              value: "{colors.grayCliff.solid.600}",
            },
            subtle: {
              value: "{colors.grayCliff.solid.400}",
            },
            emphasized: {
              value: "{colors.grayCliff.solid.300}",
            },
            inverted: {
              value: "{colors.grayCliff.solid.50}",
            },
            solid: {
              value: "{colors.grayCliff.solid.900}",
            },
          },
          bg: {
            bg: {
              value: "{colors.white}",
            },
            subtle: {
              value: "{colors.grayCliff.solid.50}",
            },
            muted: {
              value: "{colors.grayCliff.solid.100}",
            },
            "emphasized\u200e": {
              value: "{colors.grayCliff.solid.200}",
            },
            inverted: {
              value: "{colors.black}",
            },
            panel: {
              value: "{colors.white}",
            },
            solid: {
              value: "{colors.grayCliff.solid.900}",
            },
          },
          border: {
            contrast: {
              value: "{colors.white}",
            },
            focusRing: {
              value: "{colors.grayCliff.solid.800}",
            },
            border: {
              value: "{colors.grayCliff.solid.200}",
            },
            muted: {
              value: "{colors.grayCliff.solid.100}",
            },
            subtle: {
              value: "{colors.grayCliff.solid.50}",
            },
            emphasized: {
              value: "{colors.grayCliff.solid.300}",
            },
            inverted: {
              value: "{colors.grayCliff.solid.800}",
            },
            solid: {
              value: "{colors.grayCliff.solid.800}",
            },
          },
          alpha: {
            "50": {
              value: "{colors.grayCliff.alpha.50}",
            },
            "100": {
              value: "{colors.grayCliff.alpha.100}",
            },
            "200": {
              value: "{colors.grayCliff.alpha.200}",
            },
            "300": {
              value: "{colors.grayCliff.alpha.300}",
            },
            "400": {
              value: "{colors.grayCliff.alpha.400}",
            },
            "500": {
              value: "{colors.grayCliff.alpha.500}",
            },
            "600": {
              value: "{colors.grayCliff.alpha.600}",
            },
            "700": {
              value: "{colors.grayCliff.alpha.700}",
            },
            "800": {
              value: "{colors.grayCliff.alpha.800}",
            },
            "900": {
              value: "{colors.grayCliff.alpha.900}",
            },
            "950": {
              value: "{colors.grayCliff.alpha.950}",
            },
          },
        },
        orangeLince: {
          fg: {
            contrast: {
              value: "{colors.white}",
            },
            fg: {
              value: "{colors.orangeInx.solid.700}",
            },
            muted: {
              value: "{colors.orangeInx.solid.200}",
            },
            subtle: {
              value: "{colors.orangeInx.solid.100}",
            },
            emphasized: {
              value: "{colors.orangeInx.solid.300}",
            },
            inverted: {
              value: "{colors.orangeInx.solid.50}",
            },
            solid: {
              value: "{colors.orangeInx.solid.600}",
            },
          },
          bg: {
            bg: {
              value: "{colors.white}",
            },
            subtle: {
              value: "{colors.orangeInx.solid.50}",
            },
            muted: {
              value: "{colors.orangeInx.solid.100}",
            },
            "emphasized\u200e": {
              value: "{colors.orangeInx.solid.300}",
            },
            inverted: {
              value: "{colors.orangeInx.solid.950}",
            },
            panel: {
              value: "{colors.white}",
            },
            solid: {
              value: "{colors.orangeInx.solid.600}",
            },
          },
          border: {
            contrast: {
              value: "{colors.white}",
            },
            focusRing: {
              value: "{colors.orangeInx.solid.600}",
            },
            border: {
              value: "{colors.orangeInx.solid.200}",
            },
            muted: {
              value: "{colors.orangeInx.solid.100}",
            },
            subtle: {
              value: "{colors.orangeInx.solid.50}",
            },
            emphasized: {
              value: "{colors.orangeInx.solid.300}",
            },
            inverted: {
              value: "{colors.orangeInx.solid.800}",
            },
            solid: {
              value: "{colors.orangeInx.solid.600}",
            },
          },
        },
        lince: {
          fg: {
            contrast: {
              value: "{colors.white}",
            },
            fg: {
              value: "{colors.goldFang.solid.600}",
            },
            muted: {
              value: "{colors.goldFang.solid.200}",
            },
            subtle: {
              value: "{colors.goldFang.solid.100}",
            },
            emphasized: {
              value: "{colors.goldFang.solid.300}",
            },
            inverted: {
              value: "{colors.goldFang.solid.50}",
            },
            solid: {
              value: "{colors.goldFang.solid.400}",
            },
          },
          bg: {
            bg: {
              value: "{colors.white}",
            },
            subtle: {
              value: "{colors.goldFang.solid.50}",
            },
            muted: {
              value: "{colors.goldFang.solid.100}",
            },
            "emphasized\u200e": {
              value: "{colors.goldFang.solid.300}",
            },
            inverted: {
              value: "{colors.goldFang.solid.950}",
            },
            panel: {
              value: "{colors.white}",
            },
            solid: {
              value: "{colors.goldFang.solid.400}",
            },
          },
          border: {
            contrast: {
              value: "{colors.black}",
            },
            focusRing: {
              value: "{colors.goldFang.solid.300}",
            },
            border: {
              value: "{colors.goldFang.solid.200}",
            },
            muted: {
              value: "{colors.goldFang.solid.400}",
            },
            subtle: {
              value: "{colors.goldFang.solid.50}",
            },
            emphasized: {
              value: "{colors.goldFang.solid.300}",
            },
            inverted: {
              value: "{colors.goldFang.solid.800}",
            },
            solid: {
              value: "{colors.goldFang.solid.300}",
            },
          },
        },
        greenLince: {
          fg: {
            contrast: {
              value: "{colors.white}",
            },
            fg: {
              value: "{colors.greenInx.solid.700}",
            },
            muted: {
              value: "{colors.greenInx.solid.200}",
            },
            subtle: {
              value: "{colors.greenInx.solid.100}",
            },
            emphasized: {
              value: "{colors.greenInx.solid.300}",
            },
            inverted: {
              value: "{colors.greenInx.solid.50}",
            },
            solid: {
              value: "{colors.greenInx.solid.600}",
            },
          },
          bg: {
            bg: {
              value: "{colors.white}",
            },
            subtle: {
              value: "{colors.greenInx.solid.50}",
            },
            muted: {
              value: "{colors.greenInx.solid.100}",
            },
            "emphasized\u200e": {
              value: "{colors.greenInx.solid.300}",
            },
            inverted: {
              value: "{colors.greenInx.solid.950}",
            },
            panel: {
              value: "{colors.white}",
            },
            solid: {
              value: "{colors.greenInx.solid.600}",
            },
          },
          border: {
            contrast: {
              value: "{colors.white}",
            },
            focusRing: {
              value: "{colors.greenInx.solid.600}",
            },
            border: {
              value: "{colors.greenInx.solid.200}",
            },
            muted: {
              value: "{colors.greenInx.solid.100}",
            },
            subtle: {
              value: "{colors.greenInx.solid.50}",
            },
            emphasized: {
              value: "{colors.greenInx.solid.300}",
            },
            inverted: {
              value: "{colors.greenInx.solid.800}",
            },
            solid: {
              value: "{colors.greenInx.solid.600}",
            },
          },
        },
        blueLince: {
          fg: {
            contrast: {
              value: "{colors.white}",
            },
            fg: {
              value: "{colors.blueInx.solid.700}",
            },
            muted: {
              value: "{colors.blueInx.solid.200}",
            },
            subtle: {
              value: "{colors.blueInx.solid.100}",
            },
            emphasized: {
              value: "{colors.blueInx.solid.300}",
            },
            inverted: {
              value: "{colors.blueInx.solid.50}",
            },
            solid: {
              value: "{colors.blueInx.solid.400}",
            },
          },
          bg: {
            bg: {
              value: "{colors.white}",
            },
            subtle: {
              value: "{colors.blueInx.solid.50}",
            },
            muted: {
              value: "{colors.blueInx.solid.100}",
            },
            "emphasized\u200e": {
              value: "{colors.blueInx.solid.300}",
            },
            inverted: {
              value: "{colors.blueInx.solid.950}",
            },
            panel: {
              value: "{colors.white}",
            },
            solid: {
              value: "{colors.blueInx.solid.400}",
            },
          },
          border: {
            contrast: {
              value: "{colors.white}",
            },
            focusRing: {
              value: "{colors.blueInx.solid.600}",
            },
            border: {
              value: "{colors.blueInx.solid.200}",
            },
            muted: {
              value: "{colors.blueInx.solid.100}",
            },
            subtle: {
              value: "{colors.blueInx.solid.50}",
            },
            emphasized: {
              value: "{colors.blueInx.solid.300}",
            },
            inverted: {
              value: "{colors.blueInx.solid.800}",
            },
            solid: {
              value: "{colors.blueInx.solid.600}",
            },
          },
        },
        redLince: {
          fg: {
            contrast: {
              value: "{colors.white}",
            },
            fg: {
              value: "{colors.redInx.solid.700}",
            },
            muted: {
              value: "{colors.redInx.solid.200}",
            },
            subtle: {
              value: "{colors.redInx.solid.100}",
            },
            emphasized: {
              value: "{colors.redInx.solid.300}",
            },
            inverted: {
              value: "{colors.redInx.solid.50}",
            },
            solid: {
              value: "{colors.redInx.solid.600}",
            },
          },
          bg: {
            bg: {
              value: "{colors.white}",
            },
            subtle: {
              value: "{colors.redInx.solid.50}",
            },
            muted: {
              value: "{colors.redInx.solid.100}",
            },
            "emphasized\u200e": {
              value: "{colors.redInx.solid.300}",
            },
            inverted: {
              value: "{colors.redInx.solid.950}",
            },
            panel: {
              value: "{colors.white}",
            },
            solid: {
              value: "{colors.redInx.solid.600}",
            },
          },
          border: {
            contrast: {
              value: "{colors.white}",
            },
            focusRing: {
              value: "{colors.redInx.solid.600}",
            },
            border: {
              value: "{colors.redInx.solid.200}",
            },
            muted: {
              value: "{colors.redInx.solid.100}",
            },
            subtle: {
              value: "{colors.redInx.solid.50}",
            },
            emphasized: {
              value: "{colors.redInx.solid.300}",
            },
            inverted: {
              value: "{colors.redInx.solid.800}",
            },
            solid: {
              value: "{colors.redInx.solid.600}",
            },
          },
        },
      },
      shadows: {
        "black(5)-black": {
          value: "rgba(9, 9, 11, 5)",
        },
        "black(5)-gray-300(5)": {
          value: "rgba(9, 9, 11, 5)",
        },
        "gray-900(10)-black(64)": {
          value: "rgba(24, 24, 27, 10)",
        },
        "gray-900(16)-black(64)": {
          value: "rgba(24, 24, 27, 16)",
        },
        "gray-900(20)-gray-300(20)": {
          value: "rgba(24, 24, 27, 20)",
        },
        "gray-900(30)-gray-300(30)": {
          value: "rgba(24, 24, 27, 30)",
        },
      },
      radii: {
        l1: {
          value: "{radii.xs}",
        },
        l2: {
          value: "{radii.sm}",
        },
        l3: {
          value: "{radii.md}",
        },
      },
      borderWidths: {
        default: {
          value: 1,
        },
        focusRing: {
          value: 2,
        },
        "3xs": {
          value: 0.5,
        },
        "2xs": {
          value: 2,
        },
        "2ixs": {
          value: 3,
        },
        xs: {
          value: 4,
        },
        sm: {
          value: 5,
        },
        md: {
          value: 6,
        },
        lg: {
          value: 7,
        },
        xl: {
          value: 8,
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
