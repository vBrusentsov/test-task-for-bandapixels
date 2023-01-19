import mysql2, {Connection} from 'mysql2/promise';

export class DatabaseService {
    connection!: Connection
    constructor(private config: mysql2.ConnectionOptions) {
    }
    async init() {
        this.connection = await mysql2.createConnection(this.config);
    }
}
