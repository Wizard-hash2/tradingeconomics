// Trading Economics API Integration Example
// This script demonstrates how to integrate with the real Trading Economics API

/**
 * Example of how to integrate with the real Trading Economics API
 * Replace 'guest:guest' with your actual API credentials from tradingeconomics.com
 */

class RealTradingEconomicsAPI {
    constructor(apiKey = 'guest:guest') {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.tradingeconomics.com';
    }

    /**
     * Get economic indicators for a country
     * @param {string} country - Country name (e.g., 'nigeria', 'united-states')
     * @param {string} indicator - Indicator name (e.g., 'gdp', 'inflation')
     * @returns {Promise} API response with indicator data
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
     * Get historical data for an indicator
     * @param {string} country - Country name
     * @param {string} indicator - Indicator name
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise} Historical data
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
     * Search for available indicators and countries
     * @param {string} query - Search query
     * @returns {Promise} Search results
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
            // This would use the Comtrade API endpoints
            // For example: /comtrade/country/{country1}/partner/{country2}
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
     * Get market data (currencies, commodities, stocks)
     * @param {string} category - Market category ('currency', 'commodity', 'index')
     * @returns {Promise} Market data
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
     * @param {string} country - Country name (optional)
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise} Calendar events
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

/**
 * Example usage of the Trading Economics API
 */
async function demonstrateAPI() {
    const api = new RealTradingEconomicsAPI();
    
    console.log('🌍 Trading Economics API Integration Demo');
    console.log('==========================================');

    try {
        // 1. Search for Nigeria-related data
        console.log('\n📊 Searching for Nigeria data...');
        const searchResults = await api.search('nigeria');
        console.log(`Found ${searchResults.hits?.length || 0} results for Nigeria`);
        
        // 2. Get Nigeria's GDP data
        console.log('\n🇳🇬 Getting Nigeria indicators...');
        const nigeriaIndicators = await api.getIndicators('nigeria');
        console.log(`Retrieved ${nigeriaIndicators.length} indicators for Nigeria`);
        
        // 3. Get US indicators for comparison
        console.log('\n🇺🇸 Getting US indicators...');
        const usIndicators = await api.getIndicators('united-states');
        console.log(`Retrieved ${usIndicators.length} indicators for United States`);
        
        // 4. Get market data
        console.log('\n💰 Getting currency market data...');
        const currencyData = await api.getMarketData('currency');
        console.log(`Retrieved ${currencyData.length} currency pairs`);
        
        // 5. Get economic calendar
        console.log('\n📅 Getting economic calendar...');
        const calendarData = await api.getCalendar();
        console.log(`Retrieved ${calendarData.length} upcoming economic events`);
        
        console.log('\n✅ API Integration demo completed successfully!');
        
    } catch (error) {
        console.error('❌ API Demo failed:', error.message);
        console.log('\n💡 Note: This demo requires a valid Trading Economics API key.');
        console.log('   Sign up at: https://developer.tradingeconomics.com');
    }
}

/**
 * Integration helper for the web application
 */
class APIIntegrationHelper {
    static async integrateWithWebApp() {
        console.log('🔧 Integrating real API with web application...');
        
        // Example of how to replace mock data with real API calls
        const realAPI = new RealTradingEconomicsAPI('YOUR_API_KEY_HERE');
        
        // This would replace the mock getIndicatorData method in app.js
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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RealTradingEconomicsAPI, APIIntegrationHelper };
}

// Demonstrate API usage if running in Node.js
if (typeof window === 'undefined') {
    demonstrateAPI();
}

/**
 * Instructions for integrating with the web application:
 * 
 * 1. Get your API key from https://developer.tradingeconomics.com
 * 2. Replace 'guest:guest' with your actual API key in the RealTradingEconomicsAPI constructor
 * 3. In app.js, replace the TradingEconomicsAPI class with RealTradingEconomicsAPI
 * 4. Update the getIndicatorData method to use real API calls instead of mock data
 * 5. Test with a few API calls first to ensure your key works correctly
 * 6. Handle rate limiting and error cases appropriately
 * 
 * Note: The guest credentials have limitations on which endpoints and data you can access.
 * For full functionality, you'll need a paid API subscription.
 */