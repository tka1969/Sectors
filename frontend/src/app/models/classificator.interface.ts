
export interface IClassificator {
    Id: number;
	ParentId: number;
	ParameterClass: string;
	Name: string;
}

export function createClassificator(sector?: Partial<IClassificator>): IClassificator {
    const defaultValue: IClassificator = {
		Id: 0,
		ParentId: 0,
		ParameterClass: '',
		Name: '',
		};  

    return {
        ...defaultValue,
        ...sector,
    }
}
