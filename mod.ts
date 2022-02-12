import { v4 } from "https://deno.land/std/uuid/mod.ts";

export interface Payment {
    amount: {
        value: string;
        currency: string;
    },
    description?: string,
    receipt?: {
        customer: {
            full_name?: string;
            inn?: string;
            email?: string;
            phone?: string;
        },
        items: {
            description: string;
            quantity: string;
            amount: {
                value: string;
                currency: string;
            },
            vat_code?: number;
            payment_subject?: string;
            payment_mode?: string;
            product_code?: string;
            country_of_origin_code?: string;
            customs_declaration_number?: string;
            excise?: string;
        }[],
        tax_system_code?: number;
        phone?: string;
        email?: string;
    };
    recipient?: {
        gateway_id: string;
    };
    payment_token?: string;
    payment_method_id?: string;
    payment_method_data?: {
        type: string;
        login?: string;
    };
    confirmation: {
        type: "qr" | "embedded" | "external" | "mobile_application" | "redirect";
        locale?: string;
        return_url?: string;
        enforce?: boolean;
        confirmation_url?: string;
    };
    save_payment_method?: boolean;
    capture?: boolean;
    client_ip?: string;
    metadata?: unknown;
    merchant_customer_id?: string;
}

class Checkout {
    url = "https://api.yookassa.ru/v3/payments";
    request: RequestInit;
    constructor(id: number, key: string) {
        this.request = {
            method: "POST",
            headers: {
                'Authorization': `Basic ` + btoa(`${id}:${key}`),
                'Content-Type': 'application/json;charset=utf-8',
                'Idempotence-Key': v4.generate()
            }
        }
    }
    execute(object: Payment): Promise<Payment> {
        return new Promise((resolve, reject) => {
            const _requestCopy = Object.assign({}, this.request)
            _requestCopy.body = JSON.stringify(object)

            fetch(this.url, _requestCopy).catch(reject).then(r => {
                if (typeof r == 'undefined')
                    reject("Invalid request object")
                const decoder = new TextDecoderStream()
                r?.body?.pipeThrough(decoder)
                decoder.readable.getReader().read().then(string => {
                    resolve(JSON.parse(string?.value || "{}"))
                })
            })
        })
    }
}

import Session from "./session/mod.ts";
export { Session, Checkout };