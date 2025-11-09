import type { MetaMaskInpageProvider } from "@metamask/providers";
import type{ VNodeChild ,ComponentPublicInstance,FunctionalComponent} from "vue";

declare global {
    interface Window {
        ethereum?: MetaMaskInpageProvider | undefined;
    }

    declare type Recordable<T = any> = Record<string, T>;

    declare type VueNode = VNodeChild | JSX.Element;
    declare interface ChangeEvent extends Event {
        target: HTMLInputElement;
    }

    declare interface WheelEvent {
        path?: EventTarget[];
    }
    declare type TimeoutHandle = ReturnType<typeof setTimeout>;
    declare type IntervalHandle = ReturnType<typeof setInterval>;
    declare function parseInt(s: string | number, radix?: number): number;
    declare function parseFloat(string: string | number): number;
}

declare module 'vue' {
    export type JSXComponent<Props = any> = { new(): ComponentPublicInstance<Props> } | FunctionalComponent<Props>;
}
