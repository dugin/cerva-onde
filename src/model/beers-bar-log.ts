import * as moment from 'moment';

export class BeersBarLogModel {

    public createdAt: string;
    public price: number;
    public userID: string;
    public menuImg: string;
    public isChecked: boolean;

    constructor(
        createdAt?: string,
        price?: number,
        userID?: string,
        menuImg?: string,
        isChecked?: boolean,
    ) {

        this.userID = userID || '';
        this.price = price || null;
        this.menuImg = menuImg || '';
        this.isChecked = isChecked || true;
        this.createdAt = createdAt || moment().toJSON();
    }
}
