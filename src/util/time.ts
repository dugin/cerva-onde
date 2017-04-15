import * as moment from 'moment';
import 'moment/locale/pt-br';

export class TimeUtil {


    static weekDay() {

        moment.locale('pt-BR');

        const time = moment();
        const hour = time.get('hour');

        if (hour <= 6)
            return {
                weeday_short: time.subtract(1, 'day').format('ddd'),
                weeday_num: Number.parseInt(time.subtract(1, 'day').format('E'))
            };

        return {
            weeday_short: time.format('ddd'),
            weeday_num: Number.parseInt(time.format('E'))
        }


    }

    static setTimeFromString(tempo: string) { 
        
        const time = moment(tempo, 'YYYY-MM-DDTHH:mm:ss.SSSZ', false);
    
        return `${time.format('MMM')} ${time.format('DD')}, ${time.format('YYYY')}`
    }
}
