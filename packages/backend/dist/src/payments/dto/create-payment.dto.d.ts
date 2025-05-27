import { PaymentMethod, PaymentType } from '@prisma/client';
export declare class CreatePaymentDto {
    userId: string;
    amount: number;
    method: PaymentMethod;
    type: PaymentType;
    paidAt: Date;
    description?: string;
}
