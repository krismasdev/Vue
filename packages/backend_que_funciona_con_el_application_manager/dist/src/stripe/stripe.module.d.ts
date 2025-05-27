import { StripeModuleOptions } from './stripe.interface';
export declare const ConfigurableModuleClass: import("@nestjs/common").ConfigurableModuleCls<StripeModuleOptions, "forRoot", "create", {
    isGlobal: boolean;
}>, MODULE_OPTIONS_TOKEN: string | symbol;
export declare class StripeModule extends ConfigurableModuleClass {
}
