import { numberWithCommas } from "@/lib/utils";

export type TDataTableColumn = {
    title: string;
    format?: (value: number) => string;
};

const toFixed2 = makeToFixedFunc(2);
const toFixed2WithCommas = (n: number) => numberWithCommas(toFixed2(n));

const $toFixed2WithCommas = (n: number) => "$" + toFixed2WithCommas(n);
const toFixed2WithCommasPercentage = (n: number) => toFixed2WithCommas(n * 100) + "%";

const dataTableColumns: TDataTableColumn[] = [
    { title: "Name" },
    { title: "Visits" },
    { title: "Clicks" },
    { title: "Conversions" },
    { title: "Revenue", format: $toFixed2WithCommas },
    { title: "Cost", format: $toFixed2WithCommas },
    { title: "Profit", format: $toFixed2WithCommas },
    { title: "CPV", format: $toFixed2WithCommas },
    { title: "CPC", format: $toFixed2WithCommas },
    { title: "CPCV", format: $toFixed2WithCommas },
    { title: "CTR", format: toFixed2WithCommasPercentage },
    { title: "CVR", format: toFixed2WithCommasPercentage },
    { title: "ROI", format: toFixed2WithCommasPercentage },
    { title: "EPV", format: $toFixed2WithCommas },
    { title: "EPC", format: $toFixed2WithCommas },
];
export default dataTableColumns;

function makeToFixedFunc(n: number): (_n: number) => number {
    return (_n: number) => parseFloat(_n.toFixed(n));
}
