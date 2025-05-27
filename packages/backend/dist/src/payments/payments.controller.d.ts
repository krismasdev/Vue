import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    loadFromWoocommerce(): Promise<void>;
    create(createPaymentDto: CreatePaymentDto): Promise<void>;
    delete(id: string): Promise<void>;
}
