import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
export declare class WoocommerceService {
    private readonly configService;
    private readonly http;
    private readonly ordersEndpoint;
    private readonly productsEndpoint;
    private readonly customersEndpoint;
    private readonly bookingsEndpoint;
    private productCache;
    private ordersCache;
    private readonly baseUrl;
    private readonly apiKey;
    private readonly apiSecret;
    private readonly httpHeaders;
    constructor(configService: ConfigService, http: HttpService);
    retrieveOrders(): Promise<{
        customerId: number;
        orderId: number;
        amount: number;
        currency: string;
        email: string;
        datePaid: Date;
        isSubscription: boolean;
    }[]>;
    retrieveBookings(): Promise<{
        id: number;
        cost: string;
        dateCreated: Date;
        startDate: Date;
        endDate: Date;
        orderIds: number[];
        productId: number;
        status: import("./dto/get-bookings.response.dto").BookingStatus;
        event: {
            name: string;
            dateCreated: string;
            description: string;
        };
    }[]>;
    retrieveCurrentOrders(ordersIds: number[]): Promise<{
        id: number;
        status: import("./dto/get-bookings.response.dto").OrderStatus;
        dateCreated: string;
        dateCompleted: string;
        datePaid: string;
        user: {
            first_name: string;
            last_name: string;
            company: string;
            address_1: string;
            address_2: string;
            city: string;
            state: string;
            postcode: string;
            country: string;
            email: string;
            phone: string;
            customerId: number;
        };
    }[]>;
}
