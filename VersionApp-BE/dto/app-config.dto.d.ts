export declare class FeaturesDto {
    [key: string]: boolean;
}
export declare class RemoteConfigDto {
    [key: string]: any;
}
export declare class CreateAppConfigDto {
    paramKey: string;
    value: string;
    description: string;
}
export declare class UpdateAppConfigDto {
    paramKey?: string;
    value?: string;
    description?: string;
}
