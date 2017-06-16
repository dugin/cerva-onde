export class BeerModel {

    public name: string;
    public producer: string;
    public img: string;
    public style: string;
    public file: any;
    public id: string;

    constructor(
        name?: string,
        producer?: string,
        img?: string,
        style?: string,
        file?: any,
        id?: string
    ) {

        this.name = name || '';
        this.producer = producer || '';
        this.img = img || '';
        this.style = style || '';
        this.file = file || '';
        this.id = id || '';
    }
}
