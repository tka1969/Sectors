import { DataRowOperation } from "../enums/data-row-operation.enum";

export interface ISector {
    Id?: number;
    UserId?: number;
    SectorId?: number;
    RowState?: DataRowOperation;
}

export const ALL_SECTOR_FIELDS: string[] = [
    "Id",
    "UserId",
    "SectorId"
];

export function createSector(sector?: Partial<ISector>): ISector {
    const defaultValue: ISector = {
        SectorId: 0
    };  

    return {
        ...defaultValue,
        ...sector,
    }
}
