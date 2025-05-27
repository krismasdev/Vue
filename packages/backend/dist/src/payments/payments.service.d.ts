import { CreatePaymentDto } from './dto/create-payment.dto';
import { DatabaseService } from 'src/database/database.service';
import { StripeService } from 'src/stripe/stripe.service';
import { WoocommerceService } from 'src/woocommerce/woocommerce.service';
export declare class PaymentsService {
    private readonly databaseService;
    private readonly stripeService;
    private readonly woocommerceService;
    constructor(databaseService: DatabaseService, stripeService: StripeService, woocommerceService: WoocommerceService);
    loadFromStripe(): Promise<void>;
    loadFromWoocommerce(): Promise<void>;
    create(createPaymentDto: CreatePaymentDto): Promise<void>;
    delete(id: string): Promise<void>;
}
