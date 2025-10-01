
class RealTradingEconomicsAPI {
    constructor(apiKey = 'eb9e5650ff02410:utlcbsnmgfich3z') {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.tradingeconomics.com';
    }

    /**
     * 
     * @param {string} country 
     * @param {string} indicator
     * @returns {Promise} 
     */
    async getIndicators(country, indicator = null) {
        try {
            let url = `${this.baseURL}/country/${country}`;
            if (indicator) {
                url += `/${indicator}`;
            }
            url += `?c=${this.apiKey}&f=json`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching indicators:', error);
            throw error;
        }
    }

    /**
     * 
     * @param {string} country -
     * @param {string} indicator 
     * @param {string} startDate 
     * @param {string} endDate
     * @returns {Promise} 
     */
    async getHistoricalData(country, indicator, startDate, endDate) {
        try {
            const url = `${this.baseURL}/historical/country/${country}/${indicator}/${startDate}/${endDate}?c=${this.apiKey}&f=json`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching historical data:', error);
            throw error;
        }
    }

    /**
     *      * @param {string} query 
     * @returns {Promise} 
     */
    async search(query) {
        try {
            const url = `https://brains.tradingeconomics.com/v2/search/wb,fred,comtrade?q=${encodeURIComponent(query)}&pp=50&p=0`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error searching:', error);
            throw error;
        }
    }

    /**
     * Get trade data between countries
     * @param {string} country1 - First country
     * @param {string} country2 - Second country
     * @returns {Promise} Trade data
     */
    async getTradeData(country1, country2) {
        try {
          
            const url = `${this.baseURL}/comtrade/country/${country1}/partner/${country2}?c=${this.apiKey}&f=json`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching trade data:', error);
            throw error;
        }
    }

    /**
     * 
     * @param {string} category 
     * @returns {Promise}  
     */
    async getMarketData(category = null) {
        try {
            let url = `${this.baseURL}/markets`;
            if (category) {
                url += `/${category}`;
            }
            url += `?c=${this.apiKey}&f=json`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching market data:', error);
            throw error;
        }
    }

    /**
     * Get economic calendar events
     * @param {string} country 
     * @param {string} startDate 
     * @param {string} endDate
     * @returns {Promise}  
     */
    async getCalendar(country = null, startDate = null, endDate = null) {
        try {
            let url = `${this.baseURL}/calendar`;
            
            const params = [];
            if (country) params.push(`country=${country}`);
            if (startDate && endDate) params.push(`${startDate}/${endDate}`);
            
            if (params.length > 0) {
                url += `/${params.join('/')}`;
            }
            
            url += `?c=${this.apiKey}&f=json`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching calendar:', error);
            throw error;
        }
    }
}


async function demonstrateAPI() {
    const api = new RealTradingEconomicsAPI();
    
    console.log('🌍 Trading Economics API Integration Demo');
    console.log('==========================================');

    
class APIIntegrationHelper {
    static async integrateWithWebApp() {
        console.log('🔧 Integrating real API with web application...');
        
        const realAPI = new RealTradingEconomicsAPI('YOUR_API_KEY_HERE');
        
        const getIndicatorData = async (country, indicator) => {
            try {
                const data = await realAPI.getIndicators(country, indicator);
                
                // Transform API response to match our application's data structure
                if (data && data.length > 0) {
                    const latest = data[0];
                    return {
                        value: latest.LastUpdate || latest.Value,
                        date: latest.LastUpdate || latest.Date,
                        unit: latest.Unit || '%'
                    };
                }
                
                throw new Error('No data available');
            } catch (error) {
                console.error(`Error fetching ${indicator} for ${country}:`, error);
                throw error;
            }
        };
        
        console.log('✅ Real API integration ready!');
        return { getIndicatorData };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RealTradingEconomicsAPI, APIIntegrationHelper };
}

if (typeof window === 'undefined') {
    demonstrateAPI();
}

