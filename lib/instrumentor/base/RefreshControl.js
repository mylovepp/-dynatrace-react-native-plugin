"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshControlHelper = void 0;
const RefreshControlHelper = (Dynatrace, Logger) => ({
    attachOnRefresh: (refreshControlProps) => {
        const origOnRefresh = refreshControlProps.onRefresh;
        refreshControlProps.onRefresh = () => __awaiter(void 0, void 0, void 0, function* () {
            const action = Dynatrace.enterAutoAction('Swipe to Refesh');
            if (origOnRefresh != null) {
                yield origOnRefresh();
            }
            action.leaveAction();
        });
    },
});
exports.RefreshControlHelper = RefreshControlHelper;
