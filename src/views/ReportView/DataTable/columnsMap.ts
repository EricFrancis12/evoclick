import { TClick } from "@/lib/types";
import { numberWithCommas } from "@/lib/utils";

export type TDataTableColumn = {
    title: EColumnTitle;
    calcValue: (clicks: TClick[], name?: string) => string | number;
    format?: (value: number) => string;
};

export enum EColumnTitle {
    Name = "Name",
    Visits = "Visits",
    Clicks = "Clicks",
    Conversions = "Conversions",
    Revenue = "Revenue",
    Cost = "Cost",
    Profit = "Profit",
    CPV = "CPV",
    CPC = "CPC",
    CPCV = "CPCV",
    CTR = "CTR",
    CVR = "CVR",
    ROI = "ROI",
    EPV = "EPV",
    EPC = "EPC",
};

function makeToFixedFunc(n: number): (_n: number) => number {
    return (_n: number) => parseFloat(_n.toFixed(n));
}

const toFixed2 = makeToFixedFunc(2);
const toFixed2WithCommas = (n: number) => numberWithCommas(toFixed2(n));

const $toFixed2WithCommas = (n: number) => "$" + toFixed2WithCommas(n);
const toFixed2WithCommasPercentage = (n: number) => toFixed2WithCommas(n * 100) + "%";

const dataTableColumns: TDataTableColumn[] = [
    {
        title: EColumnTitle.Name,
        calcValue: (_: TClick[], name?: string) => name ?? "",
    },
    {
        title: EColumnTitle.Visits,
        calcValue: calcVisits,
    },
    {
        title: EColumnTitle.Clicks,
        calcValue: calcClicks,
    },
    {
        title: EColumnTitle.Conversions,
        calcValue: calcConversions,
    },
    {
        title: EColumnTitle.Revenue,
        calcValue: calcTotalRevenue,
        format: $toFixed2WithCommas,
    },
    {
        title: EColumnTitle.Cost,
        calcValue: calcTotalCost,
        format: $toFixed2WithCommas,
    },
    {
        title: EColumnTitle.Profit,
        calcValue: (clicks: TClick[]) => calcProfit(calcTotalRevenue(clicks), calcTotalCost(clicks)),
        format: $toFixed2WithCommas,
    },
    {
        title: EColumnTitle.CPV,
        calcValue: (clicks: TClick[]) => calcCostPerVisit(calcTotalCost(clicks), calcVisits(clicks)),
        format: $toFixed2WithCommas,
    },
    {
        title: EColumnTitle.CPC,
        calcValue: (clicks: TClick[]) => calcCostPerClick(calcTotalCost(clicks), calcClicks(clicks)),
        format: $toFixed2WithCommas,
    },
    {
        title: EColumnTitle.CPCV,
        calcValue: (clicks: TClick[]) => calcCostPerConversion(calcTotalCost(clicks), calcConversions(clicks)),
        format: $toFixed2WithCommas,
    },
    {
        title: EColumnTitle.CTR,
        calcValue: (clicks: TClick[]) => calcClickThroughRate(calcClicks(clicks), calcVisits(clicks)),
        format: toFixed2WithCommasPercentage,
    },
    {
        title: EColumnTitle.CVR,
        calcValue: (clicks: TClick[]) => calcConversionRate(calcConversions(clicks), calcVisits(clicks)),
        format: toFixed2WithCommasPercentage,
    },
    {
        title: EColumnTitle.ROI,
        calcValue: (clicks: TClick[]) => calcROI(calcTotalRevenue(clicks), calcTotalCost(clicks)),
        format: toFixed2WithCommasPercentage,
    },
    {
        title: EColumnTitle.EPV,
        calcValue: (clicks: TClick[]) => calcEarningsPerVisit(calcTotalRevenue(clicks), calcVisits(clicks)),
        format: $toFixed2WithCommas,
    },
    {
        title: EColumnTitle.EPC,
        calcValue: (clicks: TClick[]) => calcEarningsPerClick(calcTotalRevenue(clicks), calcClicks(clicks)),
        format: $toFixed2WithCommas,
    },
];

export type TColumnsMap = Map<EColumnTitle, TColumnsMapValue>;
export type TColumnsMapValue = { index: number, dtc: TDataTableColumn };

const columnsMap: TColumnsMap = new Map();
dataTableColumns.forEach((dtc, index) => columnsMap.set(dtc.title, { index, dtc }));

export default columnsMap;

export function makeCells(columnsMap: TColumnsMap, clicks: TClick[], name: string): (string | number)[] {
    return Array.from(columnsMap).map(([_, { dtc }]) => dtc.calcValue(clicks, name));
}

export function calcVisits(clicks: TClick[]): number {
    return clicks.length;
}

export function calcClicks(clicks: TClick[]): number {
    return clicks.filter(click => !!click.clickTime).length;
}

export function calcConversions(clicks: TClick[]): number {
    return clicks.filter(click => !!click.convTime).length;
}

export function calcTotalRevenue(clicks: TClick[]): number {
    return clicks.reduce((total, click) => total + click.revenue, 0);
}

export function calcTotalCost(clicks: TClick[]): number {
    return clicks.reduce((total, click) => total + click.cost, 0);
}

export function calcProfit(revenue: number, cost: number): number {
    return revenue - cost;
}

export function calcCostPerVisit(cost: number, numVisits: number): number {
    return numVisits ? cost / numVisits : 0;
}

export function calcCostPerClick(cost: number, numClicks: number): number {
    return numClicks ? cost / numClicks : 0;
}

export function calcCostPerConversion(cost: number, numConversions: number): number {
    return numConversions ? cost / numConversions : 0;
}

export function calcClickThroughRate(numClicks: number, numVisits: number): number {
    return numVisits ? numClicks / numVisits : 0;
}

export function calcConversionRate(numConversions: number, numVisits: number): number {
    return numVisits ? numConversions / numVisits : 0;
}

export function calcROI(revenue: number, cost: number): number {
    return cost ? (revenue - cost) / cost : 0;
}

export function calcEarningsPerVisit(revenue: number, numVisits: number): number {
    return numVisits ? revenue / numVisits : 0;
}

export function calcEarningsPerClick(revenue: number, numClicks: number): number {
    return numClicks ? revenue / numClicks : 0;
}
