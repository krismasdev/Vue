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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const common_2 = require("@nestjs/common");
const stripe_service_1 = require("../stripe/stripe.service");
const woocommerce_service_1 = require("../woocommerce/woocommerce.service");
let PaymentsService = class PaymentsService {
    constructor(databaseService, stripeService, woocommerceService) {
        this.databaseService = databaseService;
        this.stripeService = stripeService;
        this.woocommerceService = woocommerceService;
    }
    async loadFromStripe() {
        common_2.Logger.log('Fetching stripe payments', 'PaymentsService');
        const users = await this.databaseService.user.findMany({
            select: {
                email: true,
                id: true,
            },
            where: {
                role: 'STUDENT',
            },
        });
        const registeredEmails = new Set(users.map((user) => user.email));
        const fiveDaysAgo = Math.floor((Date.now() - 100000 * 24 * 60 * 60 * 1000) / 1000);
        let lastPaymentId = undefined;
        let hasMore = true;
        let payments = [];
        while (hasMore) {
            const paymentIntents = await this.stripeService.stripe.paymentIntents.list({
                created: {
                    gte: fiveDaysAgo,
                },
                expand: ['data.invoice', 'data.latest_charge'],
                starting_after: lastPaymentId,
            });
            payments = payments.concat(paymentIntents.data
                .map((paymentIntent) => {
                paymentIntent.receipt_email = paymentIntent.receipt_email
                    ? paymentIntent.receipt_email.toLowerCase()
                    : null;
                return paymentIntent;
            })
                .filter((paymentIntent) => paymentIntent.status === 'succeeded' &&
                paymentIntent.latest_charge.refunded === false)
                .filter((paymentIntent) => {
                if (process.env.NODE_ENV === 'development') {
                    const random = Math.random();
                    if (random < 0.25) {
                        paymentIntent.receipt_email = 'john@example.com';
                    }
                    else if (random < 0.5) {
                        paymentIntent.receipt_email = 'jane@example.com';
                    }
                    else {
                        const randomIndex = Math.floor(Math.random() * users.length);
                        paymentIntent.receipt_email = users[randomIndex].email;
                    }
                }
                return (paymentIntent.receipt_email &&
                    registeredEmails.has(paymentIntent.receipt_email));
            }));
            hasMore = paymentIntents.has_more;
            if (hasMore) {
                lastPaymentId = paymentIntents.data[paymentIntents.data.length - 1].id;
            }
        }
        const data = payments.map((paymentIntent) => {
            const isSubscription = paymentIntent.invoice !== null &&
                typeof paymentIntent.invoice !== 'string' &&
                paymentIntent.invoice.subscription;
            return {
                stripePaymentIntentId: paymentIntent.id,
                amount: paymentIntent.amount,
                paidAt: new Date(paymentIntent.created * 1000),
                currency: paymentIntent.currency,
                method: 'STRIPE',
                type: isSubscription ? 'SUBSCRIPTION' : 'ONE_TIME',
                userId: users.find((user) => user.email === paymentIntent.receipt_email).id,
            };
        });
        const loaded = await this.databaseService.payment.createMany({
            data,
            skipDuplicates: true,
        });
        common_2.Logger.log(`Fetched ${data.length} stripe payments, and loaded ${loaded.count} into the database`, 'PaymentsService');
    }
    async loadFromWoocommerce() {
        common_2.Logger.log('Fetching woocommerce payments', 'PaymentsService');
        const orders = await this.woocommerceService.retrieveOrders();
        const users = await this.databaseService.user
            .findMany({
            select: {
                email: true,
                id: true,
            },
            where: {
                role: 'STUDENT',
            },
        })
            .then((users) => users.map((user) => (Object.assign(Object.assign({}, user), { email: user.email.toLowerCase() }))));
        const data = orders
            .map((order) => {
            var _a;
            if (process.env.NODE_ENV === 'development') {
                const random = Math.random();
                if (random < 0.25) {
                    order.email = 'john@example.com';
                }
                else if (random < 0.5) {
                    order.email = 'jane@example.com';
                }
            }
            const userId = (_a = users.find((user) => user.email === order.email)) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return null;
            }
            return {
                woocommerceOrderId: String(order.orderId),
                amount: order.amount,
                paidAt: order.datePaid,
                currency: order.currency,
                method: 'WOOCOMMERCE',
                type: order.isSubscription ? 'SUBSCRIPTION' : 'ONE_TIME',
                userId,
            };
        })
            .filter(Boolean);
        const loaded = await this.databaseService.payment.createMany({
            data,
            skipDuplicates: true,
        });
        common_2.Logger.log(`Fetched ${orders.length} woocommerce payments, and loaded ${loaded.count} into the database`, 'PaymentsService');
    }
    async create(createPaymentDto) {
        await this.databaseService.payment.create({
            data: {
                paidAt: createPaymentDto.paidAt,
                amount: createPaymentDto.amount,
                method: createPaymentDto.method,
                type: createPaymentDto.type,
                description: createPaymentDto.description,
                user: {
                    connect: {
                        id: createPaymentDto.userId,
                    },
                },
                currency: 'eur',
            },
        });
    }
    async delete(id) {
        await this.databaseService.payment.delete({
            where: {
                id,
            },
        });
    }
};
PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        stripe_service_1.StripeService,
        woocommerce_service_1.WoocommerceService])
], PaymentsService);
exports.PaymentsService = PaymentsService;
//# sourceMappingURL=payments.service.js.map