export interface IColumn {
    title: string;
    data?: string;
    command?: string;
    hide?: boolean;
    tooltip?: (data: any, row: any) => string;
    display?: (data: any, row: any) => string;
    class?: Object;
    type?: 'string' | 'date' | 'datetime';
}
export interface ISchema {
    total: string;
    results: string;
}
export interface IHooks {
    beforeDelete: (row: any) => Promise<boolean>;
    beforeDisplayRow?: (row: IRow) => void;
}
export interface IDataSource {
    read: (options: any) => Promise<any>;
    delete?: (item: any) => Promise<any>;
    pageSize: number;
    schema?: ISchema;
}
export interface ITypedRow<T> {
    data: T;
    class?: Object;
}
export interface IRow extends ITypedRow<any> {
}
export interface IOptions {
    columns: IColumn[];
    dataSource: IDataSource;
    hooks?: IHooks;
}
