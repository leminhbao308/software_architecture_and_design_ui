import {ServiceStatusItemType} from "./ServiceStatusItemType.ts";

export interface ServiceStatusType {
    error?: boolean,
    data: ServiceStatusItemType[]
}
