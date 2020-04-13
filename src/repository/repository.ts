export interface WithId {
    id?: string;
}

export type RepositryInitializer = () => Promise<void>;

export interface Repository<T extends WithId> {
    init: RepositryInitializer ;
    get: () => Promise<T[]>;
    getById: (id:string) =>  Promise<T | undefined>;
    upsert(item: T) : Promise<T | undefined>;
    delete(id: string) :  Promise<string | undefined>;
}