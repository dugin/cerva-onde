import { BeerModel } from './beer';
import * as moment from 'moment';

export class BeersBarModel {

    public beer: BeerModel;
    public size: string;
    public price: number;
    public minToRemove: number;
    public barID: string;
    public updatedAt: string;

    constructor(
        beer?: BeerModel,
        size?: string,
        price?: number,
        minToRemove?: number,
        barID?: string,
        updatedAt?: string,
    ) {

        this.beer = beer || new BeerModel();
        this.size = size || '';
        this.price = price || null;
        this.minToRemove = minToRemove || 0;
        this.barID = barID || '';
        this.updatedAt = updatedAt || moment().toJSON();
    }
}
