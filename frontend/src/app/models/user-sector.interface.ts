import { ISector } from "./sector.interface";


export interface IUserSector {
    Id?: number;
    Username?: string;
    IsTermsAgreed?: boolean;
    Sectors: ISector[];
}

export const ALL_USERSECTOR_FIELDS: string[] = [
    "Id",
    "Username",
    "IsTermsAgreed"
];

export function createUserSector(user?: Partial<IUserSector>): IUserSector {
    const defaultValue: IUserSector = {
        Sectors: []
    };  

    return {
        ...defaultValue,
        ...user,
    }
}
