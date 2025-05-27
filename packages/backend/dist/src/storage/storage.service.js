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
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const config_1 = require("@nestjs/config");
let StorageService = class StorageService extends client_s3_1.S3 {
    constructor(configService) {
        super({
            credentials: {
                accessKeyId: configService.getOrThrow('S3_ACCESS_KEY_ID'),
                secretAccessKey: configService.getOrThrow('S3_SECRET_ACCESS_KEY'),
            },
            region: configService.getOrThrow('S3_REGION'),
            endpoint: configService.getOrThrow('S3_ENDPOINT'),
            forcePathStyle: true,
        });
        this.configService = configService;
    }
    async generateGetSignedUrl(opts) {
        const params = {
            Bucket: this.configService.getOrThrow('S3_PRIVATE_BUCKET_NAME'),
            Key: opts.s3Key,
            Expires: opts.expires || 60 * 5,
            ResponseContentType: (opts === null || opts === void 0 ? void 0 : opts.contentType) || undefined,
        };
        const command = new client_s3_1.GetObjectCommand(params);
        return (0, s3_request_presigner_1.getSignedUrl)(this, command);
    }
};
StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
exports.StorageService = StorageService;
//# sourceMappingURL=storage.service.js.map