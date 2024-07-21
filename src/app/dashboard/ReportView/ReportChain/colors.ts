

type TColorPair = { light: string, dark: string };

const defaultColorPair = { light: "#696969", dark: "#d3d3d3" }; // grey

// Maps the depth of the report chain (index) to a color
export const reportChainColors: TColorPair[] = [
    defaultColorPair,
    { light: "#ffffe0", dark: "#ffd700" }, // yellow
    { light: "#e6e6fa", dark: "#9370db" }, // purple
];

export function getReportChainColor(depth: number): TColorPair {
    return reportChainColors[depth] ?? defaultColorPair;
}
