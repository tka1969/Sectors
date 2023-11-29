

export type IQueryIndexMap<T> = {
	[key in string]: T;
};

export interface QueryModel {
    Parameters?: IQueryIndexMap<any>;

	Limit?: number;
	Offset?: number;
	Count?: boolean;
}

export function createQueryModel(query?: Partial<QueryModel>): QueryModel {
    const defaultValue: QueryModel = {
    };  
    return {
        ...defaultValue,
        ...query,
    }
}

export function queryKey(prefix: string, query: QueryModel): string {
	let cacheKey = prefix;
	let cacheKeyCount = 0;

	for (const pkey in query.Parameters)
	{
   		const indexedItem: string = (typeof query.Parameters[pkey] === 'string') ? query.Parameters[pkey] : JSON.stringify(query.Parameters[pkey]);

		if (indexedItem == undefined) {
			console.warn('queryKey: key=%o, parameter=>%o', pkey, query.Parameters[pkey]);
		}

		cacheKey += '::' + indexedItem.toLowerCase();
		cacheKeyCount++;
	}

	if (cacheKeyCount == 0) {
		cacheKey += '::all';
	}
	//console.log('queryKey: key=%o', cacheKey);
    return cacheKey;
  }

  
