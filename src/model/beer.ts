export class BeerModel {

    public name: string;
    public producer: string;
    public img: string;
    public style: string;
    public file: any;

    constructor(
        name?: string,
        producer?: string,
        img?: string,
        style?: string,
        file?: any
    ) {

        this.name = name || '';
        this.producer = producer || '';
        this.img = img || '';
        this.style = style || '';
        this.file = file || '';
    }
}
