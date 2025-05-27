"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WoocommerceService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const zod_1 = require("zod");
const axios_2 = __importDefault(require("axios"));
const date_fns_1 = require("date-fns");
const CompletedOrderInfoSchema = zod_1.z
    .object({
    customer_id: zod_1.z.number(),
    id: zod_1.z.number(),
    total: zod_1.z.string(),
    currency: zod_1.z.string(),
    billing: zod_1.z
        .object({
        email: zod_1.z.string().optional(),
    })
        .optional(),
    date_paid: zod_1.z.string(),
    created_via: zod_1.z.string(),
})
    .required();
const CustomerInfoSchema = zod_1.z.object({
    email: zod_1.z.string(),
});
let WoocommerceService = class WoocommerceService {
    constructor(configService, http) {
        this.configService = configService;
        this.http = http;
        this.ordersEndpoint = '/wp-json/wc/v3/orders';
        this.productsEndpoint = '/wp-json/wc/v3/products';
        this.customersEndpoint = '/wp-json/wc/v3/customers';
        this.bookingsEndpoint = '/wp-json/wc-bookings/v1/bookings';
        this.productCache = new Map();
        this.ordersCache = new Map();
        this.baseUrl = this.configService.getOrThrow('WOOCOMMERCE_API_BASE_URL');
        this.apiKey = this.configService.getOrThrow('WOOCOMMERCE_API_KEY');
        this.apiSecret = this.configService.getOrThrow('WOOCOMMERCE_API_SECRET');
        this.httpHeaders = {
            Authorization: `Basic ${Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64')}`,
        };
    }
    async retrieveOrders() {
        const totalOrders = [];
        let currentPage = 1;
        let completed = false;
        while (!completed) {
            try {
                const orders = await (0, rxjs_1.lastValueFrom)(this.http.get(this.baseUrl + this.ordersEndpoint + `?page=${currentPage}`, {
                    headers: this.httpHeaders,
                }));
                const linkHeader = orders.headers.next;
                if (!linkHeader) {
                    completed = true;
                }
                const partialOrders = orders.data
                    .map((order) => {
                    var _a;
                    const result = CompletedOrderInfoSchema.safeParse(order);
                    if (!result.success) {
                        return null;
                    }
                    const data = result.data;
                    try {
                        return {
                            customerId: data.customer_id,
                            orderId: data.id,
                            amount: parseFloat(data.total) * 100,
                            currency: data.currency,
                            billingEmail: (_a = data.billing) === null || _a === void 0 ? void 0 : _a.email,
                            datePaid: new Date(data.date_paid),
                            isSubscription: data.created_via === 'subscription',
                        };
                    }
                    catch (error) {
                        return null;
                    }
                })
                    .filter(Boolean);
                const completeInfoOrders = [];
                for (const order of partialOrders) {
                    let email = order.billingEmail;
                    const AULA_EMAIL = this.configService.get('SENDINBLUE_SENDER_EMAIL');
                    if (((email && email === AULA_EMAIL) || !email) &&
                        order.customerId !== 0) {
                        const customer = await (0, rxjs_1.lastValueFrom)(this.http.get(`${this.baseUrl}${this.customersEndpoint}/${order.customerId}`, {
                            headers: {
                                Authorization: `Basic ${Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64')}`,
                            },
                        }));
                        const result = CustomerInfoSchema.safeParse(customer.data);
                        if (result.success) {
                            const data = result.data;
                            email = data.email;
                        }
                    }
                    completeInfoOrders.push(Object.assign(Object.assign({}, order), { email }));
                }
                totalOrders.push(...completeInfoOrders);
                currentPage++;
            }
            catch (error) {
                return null;
            }
        }
        return totalOrders;
    }
    async retrieveBookings() {
        const { data: bookings } = await axios_2.default.get(this.baseUrl + this.bookingsEndpoint, { headers: this.httpHeaders });
        if (bookings.length === 0)
            return [];
        const bookingMap = new Map();
        bookings.forEach((_a) => {
            var { start, end, order_id } = _a, book = __rest(_a, ["start", "end", "order_id"]);
            const key = `${start}_${end}`;
            if (!bookingMap.has(key)) {
                bookingMap.set(key, Object.assign(Object.assign({}, book), { start, end, order_ids: [], order_id }));
            }
            bookingMap.get(key).order_ids.push(order_id);
        });
        const filteredBookings = Array.from(bookingMap.values());
        const getProduct = async (productId) => {
            if (this.productCache.has(productId)) {
                return this.productCache.get(productId) || null;
            }
            try {
                const { data: product } = await axios_2.default.get(`${this.baseUrl}${this.productsEndpoint}/${productId}`, { headers: this.httpHeaders });
                this.productCache.set(productId, product);
                return product;
            }
            catch (error) {
                console.error(`Failed to fetch product with ID ${productId}:`, error);
                this.productCache.set(productId, null);
                return null;
            }
        };
        return Promise.all(filteredBookings.map(async (book) => {
            const product = await getProduct(book.product_id);
            return {
                id: book.id,
                cost: book.cost,
                dateCreated: (0, date_fns_1.fromUnixTime)(book.date_created),
                startDate: (0, date_fns_1.fromUnixTime)(book.start),
                endDate: (0, date_fns_1.fromUnixTime)(book.end),
                orderIds: book.order_ids,
                productId: book.product_id,
                status: book.status,
                event: product
                    ? {
                        name: product.name,
                        dateCreated: product.date_created,
                        description: product.description,
                    }
                    : null,
            };
        }));
    }
    async retrieveCurrentOrders(ordersIds) {
        const getOrder = async (orderId) => {
            if (this.ordersCache.has(orderId)) {
                return this.ordersCache.get(orderId) || null;
            }
            try {
                const { data: order } = await axios_2.default.get(`${this.baseUrl}${this.ordersEndpoint}/${orderId}`, { headers: this.httpHeaders });
                this.ordersCache.set(orderId, order);
                return order;
            }
            catch (error) {
                console.error(`Failed to fetch product with ID ${orderId}:`, error);
                this.ordersCache.set(orderId, null);
                return null;
            }
        };
        return Promise.all(ordersIds.map(async (id) => {
            const order = await getOrder(id);
            return {
                id: order.id,
                status: order.status,
                dateCreated: order.date_created,
                dateCompleted: order.date_completed,
                datePaid: order.date_paid,
                user: Object.assign({ customerId: order.customer_id }, order.billing),
            };
        }));
    }
};
WoocommerceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService])
], WoocommerceService);
exports.WoocommerceService = WoocommerceService;
//# sourceMappingURL=woocommerce.service.js.map