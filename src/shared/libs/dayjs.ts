import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import minMax from 'dayjs/plugin/minMax';

dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(minMax);

export default dayjs;
