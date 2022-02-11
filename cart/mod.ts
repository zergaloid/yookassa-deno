import { Checkout } from '../mod.ts';

export default class YookassaCart {
    items: Record<string, number>;
    checkout: Checkout;
    currency: string;
    return_url: string;
    constructor(checkout: Checkout, items: Record<string, number>, meta: Record<string, string>) {
        this.items = items || []
        this.checkout = checkout
        this.currency = meta.currency
        this.return_url = meta.return_url
    }
    async pay(description: string, items: string[]) {
        const amount = items.map((item: string) => this.items[item]).reduce((a: number, b: number) => a + b, 0)
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
        return payment.confirmation.confirmation_url;
    }
}