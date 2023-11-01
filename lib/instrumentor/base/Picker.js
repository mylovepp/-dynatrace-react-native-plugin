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
exports.PickerHelper = void 0;
const PickerHelper = (Dynatrace, Logger) => ({
    attachToOnValueChange(onValueChange, children) {
        return (itemValue, itemNumber) => __awaiter(this, void 0, void 0, function* () {
            const value = this.getPickerItemValue(children, itemNumber, itemValue);
            if (value !== undefined) {
                const action = Dynatrace.enterAutoAction(`Picked Value: ${value}`);
                if (onValueChange !== undefined) {
                    yield onValueChange(itemValue, itemNumber);
                }
                if (action != null) {
                    action.leaveAction();
                }
            }
        });
    },
    getPickerItemValue: (children, index, value) => {
        if (children != null && index >= 0) {
            if (children != null &&
                children.length >= index &&
                isPickerItemProps(children[index].props)) {
                return children[index].props.label;
            }
        }
        return value;
    },
});
exports.PickerHelper = PickerHelper;
const isPickerItemProps = (props) => props.label !== undefined;
