/* eslint-disable */
import { Store } from "vuex"
import { dayjs, ElMessageBoxShortcutMethod } from "element-plus"
import { AxiosInstance } from "axios"
import type { Config } from "./config"
import { State } from "@@/store"
import { Helper } from "@@/helper"
// import { MessagePartial } from "element-plus/lib/message/src/message"
import { TreeNodeOptions } from "element-plus/lib/components/tree/src/tree.type"
import { IElDropdownInstance } from "element-plus/lib/dropdown/src/dropdown"
import { ICaceh } from "@/cache/cache"
import { $t } from "@/i18n/i18n"

type Data = Record<string, unknown>;
type Message = {
    closeAll(): void;
    success: (msg?: string) => void;
    warning: (msg?: string) => void;
    info: (msg?: string) => void;
    error: (msg?: string) => void;
}

declare module "@vue/runtime-core" {
    export interface ComponentCustomProperties {
        $refs: {
            form: {
                validate: (fn: (valid: boolean) => void) => void,
                validateField: (field: string) => void,
                resetFields: () => void,
                $el: HTMLElement,
                formInfo: Data,
            }
            table: {
                /**
                 * 获取表格数据
                 */
                getData: <T = Data>(params?: T) => Promise<T>,
                /**
                 * 表格数据
                 */
                tableData: unknown[],
                /**
                 * 表格数据总量
                 */
                total: number,
                $el: HTMLElement,
            },
            tree: TreeNodeOptions["store"],
            dropdown: IElDropdownInstance,
        },
        $store: Store<State>,
        $confirm: typeof ElMessageBoxShortcutMethod,
        $alert: typeof ElMessageBoxShortcutMethod,
        $message: Message,
        $nextTick: (fn: () => void) => void,
        axios: AxiosInstance,
        $helper: Helper,
        $t: typeof $t,
        config: Config
    }
}
// 测试declare是覆盖还是添加，不import就是覆盖了，而且修改o后得重启

// import dayjs from 'dayjs';
declare module "dayjs" {
    // export function foo(d) {
    //     console.log(d);
    //     // return dayjs(d).format('YYYY-MM-DD')
    // }
    export function foo(x): (d) => d {
        return x
    }
}