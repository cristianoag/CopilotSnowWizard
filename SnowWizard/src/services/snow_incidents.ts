//Uses the Trouble Ticket ServiceNow Open API to deal with incidents
//The Trouble Ticket Open API is a ServiceNow implementation of the TM Forum Trouble Ticket Management API REST specification. 
//Author: crisag@microsoft.com

import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({ path: 'env/.env.local.user' });

class IncidentsApiService {
    
    private SN_INSTANCE: string;
    private SN_USERNAME: string;
    private SN_PASSWORD: string;

    constructor() {
        // Environment variables setup
        this.SN_INSTANCE = process.env.SN_INSTANCE || '';
        this.SN_USERNAME = process.env.SN_USERNAME || '';
        this.SN_PASSWORD = process.env.SN_PASSWORD || '';
    }

    // Function to fetch the latest 10 incidents from ServiceNow
    async getIncidents() {
    try {
        const response = await axios.get(
        `https://${this.SN_INSTANCE}.service-now.com/api/now/table/incident`,
        {
            params: {
            sysparm_limit: 10,
            sysparm_query: 'ORDERBYDESCsys_created_on'
            },
            auth: {
            username: this.SN_USERNAME,
            password: this.SN_PASSWORD
            },
            headers: {
            'Content-Type': 'application/json',
            },
        }
        );
        console.log('Incidents fetched successfully from ServiceNow:', response.data.result);
        // Extracting incidents from response
        return response.data.result;
    } catch (error) {
        console.error('Error fetching incidents:', error);
        throw error;
    }
    }


}

export default new IncidentsApiService();

