"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEventsPublicResponseDto = void 0;
const openapi = require("@nestjs/swagger");
class GetEventsPublicResponseDto {
    constructor(event) {
        this.id = event.id;
        this.title = event.title;
        this.startDate = event.startDate;
        this.endDate = event.endDate;
        this.freeSlots = event.totalSlots - event.users.length;
        this.description = event.description;
        this.color = event.color;
        this.enableBooking = event.enableBooking;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, title: { required: true, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, freeSlots: { required: true, type: () => Number }, description: { required: true, type: () => String }, color: { required: false, type: () => String }, enableBooking: { required: true, type: () => Boolean } };
    }
}
exports.GetEventsPublicResponseDto = GetEventsPublicResponseDto;
//# sourceMappingURL=get-events-public.response.dto.js.map