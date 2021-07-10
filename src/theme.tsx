import { colors, createTheme, ThemeProvider } from "@material-ui/core";
import { PaletteColorOptions } from "@material-ui/core/styles/createPalette";
import React, { FC } from "react";
import { 教科 } from "./types";

type HueName = Exclude<keyof typeof colors, "common">;
const laterHalfHues: HueName[] = [
  "red",
  "pink",
  "purple",
  "deepPurple",
  "indigo",
  "blue",
  "lightBlue",
  "cyan",
  "teal",
  "green",
  "lightGreen",
  "lime",
  "yellow",
  "amber",
  "orange",
];

const hues = [
  colors.common.white,
  colors.common.white,
  colors.common.white,
  colors.common.white,
  colors.common.white,
  colors.common.white,
  colors.common.white,
  colors.common.white,
  colors.common.white,
  colors.common.white,
  colors.common.white,
  ...laterHalfHues.map((hue) => colors[hue][300]),
];

const customTheme = createTheme({
  palette: {
    subjects: {
      1: {
        main: hues[0],
      },
      2: {
        main: hues[1],
      },
      3: {
        main: hues[2],
      },
      4: {
        main: hues[3],
      },
      5: {
        main: hues[4],
      },
      6: {
        main: hues[5],
      },
      7: {
        main: hues[6],
      },
      8: {
        main: hues[7],
      },
      9: {
        main: hues[8],
      },
      10: {
        main: hues[9],
      },
      11: {
        main: hues[10],
      },
      12: {
        main: hues[11],
      },
      13: {
        main: hues[12],
      },
      14: {
        main: hues[13],
      },
      15: {
        main: hues[14],
      },
      16: {
        main: hues[15],
      },
      17: {
        main: hues[16],
      },
      18: {
        main: hues[17],
      },
      19: {
        main: hues[18],
      },
      20: {
        main: hues[19],
      },
      21: {
        main: hues[20],
      },
      22: {
        main: hues[21],
      },
      23: {
        main: hues[22],
      },
      24: {
        main: hues[23],
      },
      25: {
        main: hues[24],
      },
      26: {
        main: hues[25],
      },
    },
  },
});

export const CustomThemeProvider: FC = ({ children }) => (
  <ThemeProvider theme={customTheme} children={children} />
);

type SubjectPalette = Record<教科, { readonly main: string }>;

type SubjectPaletteOptions = Partial<Record<教科, PaletteColorOptions>>;

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    readonly subjects: SubjectPalette;
  }
  interface PaletteOptions {
    readonly subjects: SubjectPaletteOptions;
  }
}
