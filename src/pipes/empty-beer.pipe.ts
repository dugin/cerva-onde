import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'emptyBeer'
})

export class EmptyBeerPipe implements PipeTransform {
  transform(beers: any[], args: any[]): any {
    if (!beers) {
      return beers;
    }
    const b = beers.filter(beerBar => beerBar.beer.id && beerBar.beer.id.length > 0);

    return b.sort((a, b) => {
      return a.price - b.price;
    })
  }
}
