import Stripe from 'stripe';
import { StripeModuleOptions } from './stripe.interface';
import { DatabaseService } from './../database/database.service';
export declare class StripeService {
    private options;
    private databaseService;
    readonly stripe: Stripe;
    constructor(options: StripeModuleOptions, databaseService: DatabaseService);
}
