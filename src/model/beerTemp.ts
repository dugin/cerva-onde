export class BeerTempModel {

  constructor(public name: string = '',
              public price: number  = null,
              public size: string = '',
              public userID: string = '',
              public barID: string = '',
              public createdAt: string = '',
              public type: number = 0,
              public beersBarID: string = '') {
  }

}
