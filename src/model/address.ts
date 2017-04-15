export class AddressModel {

    public street: string;
    public number: number;
    public complement: string;
    public neighborhood: string;
    public city: string;
    public state: string;
    public country: string;
    public coordinates: { lat: number, lng: number };
    public cep: string;

    constructor(
        street?: string,
        number?: number,
        complement?: string,
        neighborhood?: string,
        city?: string,
        state?: string,
        country?: string,
        coordinates?: { lat: number, lng: number },
        cep?: string,
    ) {
        this.street = street || '';
        this.number = number || null;
        this.complement = complement || '';
        this.neighborhood = neighborhood || '';
        this.city = city || '';
        this.state = state || '';
        this.country = country || '';
        this.coordinates = coordinates || { lat: null, lng: null };
        this.cep = cep || '';


    }


}
