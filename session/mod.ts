import { Checkout } from '../mod.ts';

export default class Session {
    checkout: Checkout;
    currency: string;
    return_url: string;
    constructor(checkout: Checkout, meta: Record<string, string>) {
        this.checkout = checkout
        this.currency = meta.currency
        this.return_url = meta.return_url
    }
    async pay(description: string, amount: number) {
        const payment = await this.checkout.execute({
            amount: {
                value: amount.toFixed(2),
                currency: this.currency
            },
            confirmation: {
                type: "redirect",
                return_url: this.return_url
            },
            description
        })
        return payment;
    }
}