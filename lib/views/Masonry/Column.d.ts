export interface ColumnReservation {
    min: number;
    max: number;
}
export interface ColumnRegion {
    height: number;
    width: number;
    x: number;
    y: number;
}
export declare class Column {
    readonly index: number;
    readonly next: Column | null;
    readonly reserved: ColumnReservation[];
    constructor(index: number, next: Column | null);
    getAllPositions(columns: number, height: number, result?: ColumnRegion[]): ColumnRegion[];
    getMaxHeight(columns?: number): number;
    isFree(columns: number, height: number, offset: number): boolean;
    reserve(position: ColumnRegion): ColumnRegion;
    reset(): void;
    walk(columns: number, callback: (min: number, max: number) => void): void;
}
