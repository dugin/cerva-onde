export class OpeningModel {

    public open: string;
    public close: string

    constructor(
        open?: string,
        close?: string
    ) {

        this.close = close || '';
        this.open = open || '';
    }
}
