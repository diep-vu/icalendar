declare type Success = (rawFeed: string, xhr: XMLHttpRequest) => void;
declare type Failure = (error: string, xhr: XMLHttpRequest) => void;
export declare function requestICal(url: string, successCallback: Success, failureCallback: Failure): void;
declare const _default: import("@fullcalendar/common").PluginDef;
export default _default;
//# sourceMappingURL=main.d.ts.map