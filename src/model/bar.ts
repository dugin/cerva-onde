import { BeersBarModel } from './beers-bar';
import { OpeningModel } from './opening';
import { AddressModel } from './address';
import * as moment from 'moment';

export class BarModel {

    public name: string;
    public address: AddressModel;
    public openingHours: Array<OpeningModel>;
    public beers: Array<string> | any[];
    public createdAt: string;
    public updatedAt: string;
    public photos: Array<string>;
    public logo: string;
    public tel: string;
    public userID: string;
    public isDenounced: boolean;
    public menuImg: string;
    public rating: number;
    public distance?: number;
    public id?: string;



    constructor(
        distance?: number,
        id?: string,
        name?: string,
        address?: AddressModel,
        openingHours?: Array<OpeningModel>,
        beers?: Array<string>,
        createdAt?: string,
        updatedAt?: string,
        photos?: Array<string>,
        logo?: string,
        tel?: string,
        userID?: string,
        isDenounced?: boolean,
        menuImg?: string,
        rating?: number,


    ) {
        this.name = name || '';
        this.createdAt = createdAt || moment().toJSON();
        this.updatedAt = updatedAt || '';
        this.address = address || new AddressModel();
        this.openingHours = openingHours || new Array<OpeningModel>();
        this.beers = beers || new Array<string>();
        this.photos = photos || new Array<string>();
        this.logo = logo || '';
        this.tel = tel || '';
        this.userID = userID || '';
        this.isDenounced = isDenounced || false;
        this.menuImg = menuImg || '';
        this.rating = rating || null;
        this.distance = distance || null;
        this.id = id || null;
    }
}
