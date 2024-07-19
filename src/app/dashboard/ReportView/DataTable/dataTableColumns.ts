

export type TDataTableColumn = {
    title: string;
    format?: (value: number) => string;
};

const toFixed2 = makeToFixedFunc(2);
const $toFixed2 = (n: number) => "$" + toFixed2(n);
const toFixed2Percentage = (n: number) => toFixed2(n * 100) + "%";

const dataTableColumns: TDataTableColumn[] = [
    { title: "Name" },
    { title: "Visits" },
    { title: "Clicks" },
    { title: "Conversions" },
    { title: "Revenue", format: $toFixed2 },
    { title: "Cost", format: $toFixed2 },
    { title: "Profit", format: $toFixed2 },
    { title: "CPV", format: $toFixed2 },
    { title: "CPC", format: $toFixed2 },
    { title: "CPCV", format: $toFixed2 },
    { title: "CTR", format: toFixed2Percentage },
    { title: "CVR", format: toFixed2Percentage },
    { title: "ROI", format: toFixed2Percentage },
    { title: "EPV", format: $toFixed2 },
    { title: "EPC", format: $toFixed2 },
];
export default dataTableColumns;

function makeToFixedFunc(n: number): (_n: number) => string {
    return (_n: number) => _n.toFixed(n);
}
