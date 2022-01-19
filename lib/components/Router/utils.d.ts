import { VNode } from 'preact';
import { RoutableProps } from './types';
interface RouteOptions {
    default?: boolean;
}
interface RankedNode extends VNode<RoutableProps> {
    index: number;
    rank: number;
}
export declare function exec(rawUrl: string, rawRoute: string, opts: RouteOptions): false | {
    [key: string]: string;
};
export declare function pathRankSort(a: RankedNode, b: RankedNode): number;
export declare function prepareVNodeForRanking(vnode: any, index: number): vnode is RankedNode;
export declare function segmentize(url: string): Array<string>;
export declare function rankSegment(segment: string): number;
export declare function rank(path: string): string;
export {};
