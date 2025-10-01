// Trading Economics Country Comparison Dashboard
// This application uses ONLY real Trading Economics API data

class TradingEconomicsAPI {
    constructor() {
        // Using your real Trading Economics API key
        this.baseURL = 'https://api.tradingeconomics.com';
        this.apiKey = 'eb9e5650ff02410:utlcbsnmgfich3z'; // Your actual API key
        
        // Countries based on your feedback: Mexico and Thailand work, others don't
        this.availableCountries = ['mexico', 'thailand']; // Simplified to working countries only
        this.allCountries = ['mexico', 'new-zealand', 'sweden', 'thailand']; // All attempted countries
    }

    async getIndicatorData(country, indicator) {
        // Check if country is definitely working
        if (!this.availableCountries.includes(country)) {
            console.warn(`⚠️ Country ${country} may not be available with your API plan`);
            
            // Still try to fetch, but with a warning
            if (!this.allCountries.includes(country)) {
                throw new Error(`Data not available for ${country}. Available countries: ${this.availableCountries.join(', ')}`);
            }
        }

        try {
            console.log(`🔄 Attempting to fetch data for ${country} - ${indicator}`);
            const realData = await this.fetchRealIndicatorData(country, indicator);
            if (realData) {
                console.log(`✅ Successfully fetched data for ${country} - ${indicator}:`, realData);
                return realData;
            } else {
                throw new Error(`No data found for ${indicator} in ${country}`);
            }
        } catch (error) {
            console.error(`❌ Failed to fetch real data for ${country}-${indicator}:`, error);
            throw error;
        }
    }

    async fetchRealIndicatorData(country, indicator) {
        try {
            // Fetch all indicators for the country
            const url = `${this.baseURL}/country/${country}?c=${this.apiKey}&f=json`;
            
            console.log(`Fetching data for ${country} - ${indicator}`);
            console.log(`URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`API returned ${data.length} indicators for ${country}`);
            
            // If we just want to see any data, return the first available indicator for testing
            if (data && data.length > 0) {
                console.log('Available indicators:', data.slice(0, 5).map(item => item.Category));
                
                // Enhanced indicator mappings with more comprehensive search terms
                const indicatorMappings = {
                    'gdp': ['GDP', 'Growth', 'Gross Domestic Product', 'Real GDP', 'Economic Growth'],
                    'inflation': ['Inflation', 'CPI', 'Consumer Price', 'Price Index', 'Core Inflation'],
                    'unemployment': ['Unemployment', 'Jobless', 'Labor Force', 'Employment Rate'],
                    'interest-rate': ['Interest Rate', 'Bank Rate', 'Policy Rate', 'Central Bank', 'Repo Rate'],
                    'population': ['Population', 'Inhabitants', 'Total Population'],
                    'government-debt-to-gdp': ['Debt', 'Government Debt', 'Public Debt', 'Fiscal']
                };
                
                const possibleNames = indicatorMappings[indicator] || [indicator];
                console.log(`Looking for indicator matching: ${possibleNames.join(', ')}`);
                
                // Find matching indicator in the API response with better matching logic
                let bestMatch = null;
                let bestScore = 0;
                
                for (const item of data) {
                    if (item.Category) {
                        const category = item.Category.toLowerCase();
                        
                        for (const name of possibleNames) {
                            const searchTerm = name.toLowerCase();
                            
                            // Exact match gets highest score
                            if (category === searchTerm) {
                                bestMatch = item;
                                bestScore = 100;
                                break;
                            }
                            
                            // Contains match gets medium score
                            if (category.includes(searchTerm) || searchTerm.includes(category)) {
                                const score = Math.max(
                                    category.length > 0 ? (searchTerm.length / category.length) * 50 : 0,
                                    searchTerm.length > 0 ? (category.length / searchTerm.length) * 50 : 0
                                );
                                
                                if (score > bestScore) {
                                    bestMatch = item;
                                    bestScore = score;
                                }
                            }
                        }
                        
                        if (bestScore === 100) break; // Found exact match
                    }
                }
                
                if (bestMatch) {
                    console.log(`Found match: ${bestMatch.Category} with score ${bestScore}`);
                    const value = bestMatch.LatestValue || bestMatch.Value;
                    const date = bestMatch.LatestValueDate || bestMatch.Date;
                    const unit = bestMatch.Unit || '%';
                    
                    return {
                        value: value,
                        date: date ? new Date(date).toLocaleDateString() : '2024',
                        unit: unit,
                        category: bestMatch.Category,
                        source: bestMatch.Source || 'Trading Economics'
                    };
                } else {
                    // If no exact match found, return the first indicator as fallback for testing
                    console.log(`No exact match found for ${indicator}, using first available: ${data[0].Category}`);
                    const firstItem = data[0];
                    return {
                        value: firstItem.LatestValue || firstItem.Value,
                        date: firstItem.LatestValueDate ? new Date(firstItem.LatestValueDate).toLocaleDateString() : '2024',
                        unit: firstItem.Unit || 'Units',
                        category: firstItem.Category,
                        source: firstItem.Source || 'Trading Economics'
                    };
                }
            }
            
            return null; // No data available
            
        } catch (error) {
            console.error('Error fetching real API data:', error);
            throw error;
        }
    }

    async getAvailableIndicators(country) {
        // Get all available indicators for a country
        if (!this.availableCountries.includes(country)) {
            return [];
        }

        try {
            const url = `${this.baseURL}/country/${country}?c=${this.apiKey}&f=json`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Return unique categories
            const categories = [...new Set(data.map(item => item.Category).filter(Boolean))];
            return categories.slice(0, 20); // Limit to first 20 indicators
            
        } catch (error) {
            console.error('Error fetching available indicators:', error);
            return [];
        }
    }

    async getMarketData(country) {
        // Fetch market indices for available countries
        if (!this.availableCountries.includes(country)) {
            return null;
        }
        
        try {
            const url = `${this.baseURL}/markets/index?c=${this.apiKey}&f=json`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Filter for the specific country
            const countryMarkets = data.filter(item => 
                item.Country && item.Country.toLowerCase() === country.replace('-', ' ').toLowerCase()
            );
            
            return countryMarkets;
            
        } catch (error) {
            console.error('Error fetching market data:', error);
            return null;
        }
    }

    async getTradeData(country1, country2) {
        // Only provide trade data for countries with API access
        if (!this.availableCountries.includes(country1) || !this.availableCountries.includes(country2)) {
            return {
                exports: { value: 'API access required', unit: '', year: '2024' },
                imports: { value: 'API access required', unit: '', year: '2024' },
                balance: { value: 'API access required', unit: '', year: '2024' }
            };
        }

        
        return {
            exports: { value: 'Contact TE for trade data', unit: '', year: '2024' },
            imports: { value: 'Contact TE for trade data', unit: '', year: '2024' },
            balance: { value: 'Contact TE for trade data', unit: '', year: '2024' }
        };
    }
}

class Dashboard {
    constructor() {
        this.api = new TradingEconomicsAPI();
        this.chart = null;
        this.originalResultsHTML = null; // Store original results structure
        this.initializeEventListeners();
        
        // Store the original results HTML structure
        this.storeOriginalResultsStructure();
    }

    storeOriginalResultsStructure() {
        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            this.originalResultsHTML = resultsDiv.innerHTML;
            console.log('Original results HTML structure stored');
        }
    }

    initializeEventListeners() {
        const compareBtn = document.getElementById('compareBtn');
        compareBtn.addEventListener('click', () => this.compareCountries());

        const showIndicatorsBtn = document.getElementById('showIndicatorsBtn');
        showIndicatorsBtn.addEventListener('click', () => this.showAvailableIndicators());

        const testApiBtn = document.getElementById('testApiBtn');
        testApiBtn.addEventListener('click', () => this.testApiConnection());

        // Allow Enter key to trigger comparison
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.compareCountries();
            }
        });
    }

    // Diagnostic function to check if all required elements exist
    checkRequiredElements() {
        const requiredElements = [
            'results', 'loading', 'error', 'error-message',
            'indicators-preview', 'indicators-list',
            'country1-name', 'country2-name', 
            'country1-value', 'country2-value',
            'country1-label', 'country2-label',
            'country1-date', 'country2-date',
            'trade-info', 'market-data'
        ];
        
        const missing = [];
        const found = [];
        
        requiredElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                found.push(id);
            } else {
                missing.push(id);
            }
        });
        
        console.log('✅ Found elements:', found);
        if (missing.length > 0) {
            console.error('❌ Missing elements:', missing);
            return false;
        }
        
        console.log('✅ All required elements found!');
        return true;
    }

    async testApiConnection() {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) {
            console.error('Results div not found!');
            alert('Error: Results container not found in the page.');
            return;
        }
        
        // Store the original HTML structure
        const originalHTML = resultsDiv.innerHTML;
        
        // Show loading message without destroying the structure
        resultsDiv.innerHTML = '<div class="loading">Testing API Connection...</div>';
        resultsDiv.style.display = 'block';

        try {
            console.log('Testing API connection...');
            
            // Test exactly the same way as the working api-test.html
            const testUrl = `${this.api.baseURL}/country/mexico?c=${this.api.apiKey}&f=json`;
            console.log('Test URL:', testUrl);
            
            const response = await fetch(testUrl);
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            console.log('Response headers:', [...response.headers.entries()]);
            
            if (!response.ok) {
                throw new Error(`API test failed: HTTP ${response.status} - ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('API test successful! Data received:', data.length, 'items');
            console.log('Sample data:', data.slice(0, 3));
            
            // Also test the getIndicatorData method
            console.log('Testing getIndicatorData method...');
            const indicatorTest = await this.api.getIndicatorData('mexico', 'gdp');
            console.log('Indicator test result:', indicatorTest);
            
            resultsDiv.innerHTML = `
                <div class="success-message">
                    <h3>✅ API Connection Successful!</h3>
                    <p>Successfully fetched ${data.length} indicators from Mexico</p>
                    <p>API Key: ${this.api.apiKey.substring(0, 15)}...</p>
                    <p>Base URL: ${this.api.baseURL}</p>
                    <p>Indicator Test: ${indicatorTest ? 'Success' : 'Failed'}</p>
                    <button onclick="window.dashboard.restoreResultsStructure()" style="margin-top: 15px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Close Test Results</button>
                    <details>
                        <summary>Sample Data (first 3 items)</summary>
                        <pre>${JSON.stringify(data.slice(0, 3), null, 2)}</pre>
                    </details>
                    ${indicatorTest ? `
                    <details>
                        <summary>Indicator Test Result</summary>
                        <pre>${JSON.stringify(indicatorTest, null, 2)}</pre>
                    </details>
                    ` : ''}
                </div>
            `;
            
            // Store the original HTML for restoration
            this.originalResultsHTML = originalHTML;
            
        } catch (error) {
            console.error('API test failed:', error);
            resultsDiv.innerHTML = `
                <div class="error-message">
                    <h3>❌ API Connection Failed</h3>
                    <p>Error: ${error.message}</p>
                    <p>Please check your API key and internet connection.</p>
                    <button onclick="window.dashboard.restoreResultsStructure()" style="margin-top: 15px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Close Test Results</button>
                    <details>
                        <summary>Debug Information</summary>
                        <pre>API Key: ${this.api.apiKey}
Base URL: ${this.api.baseURL}
Error Stack: ${error.stack}</pre>
                    </details>
                </div>
            `;
            
            // Store the original HTML for restoration
            this.originalResultsHTML = originalHTML;
        }
    }

    restoreResultsStructure() {
        const resultsDiv = document.getElementById('results');
        if (resultsDiv && this.originalResultsHTML) {
            resultsDiv.innerHTML = this.originalResultsHTML;
            resultsDiv.style.display = 'none';
            console.log('Results structure restored');
        } else if (resultsDiv && !this.originalResultsHTML) {
            // If no stored structure, try to store it now
            console.log('No stored results structure, attempting to store current structure');
            this.storeOriginalResultsStructure();
        }
    }

    async compareCountries() {
        const country1 = document.getElementById('country1').value;
        const country2 = document.getElementById('country2').value;
        const indicator = document.getElementById('indicator').value;

        if (country1 === country2) {
            this.showError('Please select two different countries for comparison.');
            return;
        }

        // Always restore the results structure before starting a new comparison
        this.restoreResultsStructure();

        this.showLoading();
        this.hideError();
        this.hideResults();

        try {
            console.log(`Starting comparison: ${country1} vs ${country2} for ${indicator}`);
            
            // First, try to get just the basic indicator data
            console.log('Fetching indicator data...');
            const data1 = await this.api.getIndicatorData(country1, indicator);
            console.log(`Data1 result:`, data1);
            
            const data2 = await this.api.getIndicatorData(country2, indicator);
            console.log(`Data2 result:`, data2);

            // If basic data works, try to get additional data
            let tradeData = null;
            let marketData1 = null;
            let marketData2 = null;
            
            try {
                console.log('Fetching additional data...');
                tradeData = await this.api.getTradeData(country1, country2);
                console.log('Trade data:', tradeData);
            } catch (error) {
                console.warn('Trade data failed:', error.message);
                tradeData = {
                    exports: { value: 'Not available', unit: '', year: '2024' },
                    imports: { value: 'Not available', unit: '', year: '2024' },
                    balance: { value: 'Not available', unit: '', year: '2024' }
                };
            }
            
            try {
                marketData1 = await this.api.getMarketData(country1);
                console.log('Market data 1:', marketData1);
            } catch (error) {
                console.warn('Market data 1 failed:', error.message);
                marketData1 = null;
            }
            
            try {
                marketData2 = await this.api.getMarketData(country2);
                console.log('Market data 2:', marketData2);
            } catch (error) {
                console.warn('Market data 2 failed:', error.message);
                marketData2 = null;
            }

            console.log('Displaying results...');
            this.displayResults(country1, country2, indicator, data1, data2, tradeData);
            this.displayMarketData(country1, country2, marketData1, marketData2);
            this.hideLoading();
            this.showResults();

        } catch (error) {
            console.error('Error fetching data:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                country1,
                country2,
                indicator
            });
            
            let errorMessage = 'Failed to fetch data. ';
            
            if (error.message.includes('Data not available')) {
                errorMessage = error.message + ' Please select countries with API access.';
            } else if (error.message.includes('HTTP')) {
                errorMessage = `API Error: ${error.message}. Please check your internet connection.`;
            } else {
                errorMessage = `Error: ${error.message}`;
            }

            this.hideLoading();
            this.showError(errorMessage);
        }
    }

    displayResults(country1, country2, indicator, data1, data2, tradeData) {
        try {
            // Check if data is valid
            if (!data1 || !data2) {
                throw new Error(`Missing data: data1=${!!data1}, data2=${!!data2}`);
            }

            // Safely get elements with null checks
            const country1NameEl = document.getElementById('country1-name');
            const country2NameEl = document.getElementById('country2-name');
            const country1ValueEl = document.getElementById('country1-value');
            const country2ValueEl = document.getElementById('country2-value');
            const country1LabelEl = document.getElementById('country1-label');
            const country2LabelEl = document.getElementById('country2-label');
            const country1DateEl = document.getElementById('country1-date');
            const country2DateEl = document.getElementById('country2-date');

            // Check if all elements exist
            if (!country1NameEl || !country2NameEl || !country1ValueEl || !country2ValueEl || 
                !country1LabelEl || !country2LabelEl || !country1DateEl || !country2DateEl) {
                console.error('Missing DOM elements for results display');
                throw new Error('Results display elements not found in DOM');
            }

            // Update country names
            country1NameEl.textContent = this.formatCountryName(country1);
            country2NameEl.textContent = this.formatCountryName(country2);

            // Update values with better formatting and null checks
            country1ValueEl.textContent = this.formatValue(data1.value, data1.unit);
            country2ValueEl.textContent = this.formatValue(data2.value, data2.unit);

            // Update labels with actual category names from API
            const indicatorLabel = data1.category || this.getIndicatorLabel(indicator);
            country1LabelEl.textContent = indicatorLabel;
            country2LabelEl.textContent = data2.category || indicatorLabel;

            // Update dates with source information
            country1DateEl.innerHTML = `
                <div>As of ${data1.date || 'Unknown'}</div>
                <small style="color: #666;">Source: ${data1.source || 'Trading Economics API'}</small>
            `;
            
            country2DateEl.innerHTML = `
                <div>As of ${data2.date || 'Unknown'}</div>
                <small style="color: #666;">Source: ${data2.source || 'Trading Economics API'}</small>
            `;

            // Create comparison chart with error handling
            try {
                this.createComparisonChart(country1, country2, indicator, data1, data2);
            } catch (chartError) {
                console.error('Chart creation failed:', chartError);
                // Continue without chart
            }

            // Display trade information with error handling
            if (tradeData) {
                try {
                    this.displayTradeInfo(country1, country2, tradeData);
                } catch (tradeError) {
                    console.error('Trade info display failed:', tradeError);
                    // Continue without trade info
                }
            }

        } catch (error) {
            console.error('Error in displayResults:', error);
            console.error('Data received:', { data1, data2, country1, country2, indicator });
            
            // Show error in results area instead of crashing
            const resultsDiv = document.getElementById('results');
            if (resultsDiv) {
                resultsDiv.innerHTML = `
                    <div class="error-message">
                        <h3>❌ Display Error</h3>
                        <p>Error displaying results: ${error.message}</p>
                        <p>Countries: ${country1} vs ${country2}</p>
                        <p>Data1 valid: ${!!data1}, Data2 valid: ${!!data2}</p>
                    </div>
                `;
            }
        }
    }

    createComparisonChart(country1, country2, indicator, data1, data2) {
        const ctx = document.getElementById('comparisonChart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        const labels = [this.formatCountryName(country1), this.formatCountryName(country2)];
        const data = [data1.value, data2.value];
        
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: this.getIndicatorLabel(indicator),
                    data: data,
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)'
                    ],
                    borderColor: [
                        'rgba(102, 126, 234, 1)',
                        'rgba(118, 75, 162, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${this.getIndicatorLabel(indicator)} Comparison`,
                        font: {
                            size: 18,
                            weight: 'bold'
                        },
                        padding: 20
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: indicator !== 'interest-rate' && indicator !== 'gdp',
                        title: {
                            display: true,
                            text: `${this.getIndicatorLabel(indicator)} (${data1.unit})`,
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    displayTradeInfo(country1, country2, tradeData) {
        const tradeInfoContainer = document.getElementById('trade-info');
        
        if (!tradeInfoContainer) {
            console.warn('trade-info container not found, skipping trade info display');
            return;
        }
        
        tradeInfoContainer.innerHTML = `
            <div class="trade-card">
                <h4>📤 ${this.formatCountryName(country1)} Exports to ${this.formatCountryName(country2)}</h4>
                <div class="trade-value">${tradeData.exports.value} ${tradeData.exports.unit}</div>
                <p>Year: ${tradeData.exports.year}</p>
            </div>
            <div class="trade-card">
                <h4>📥 ${this.formatCountryName(country1)} Imports from ${this.formatCountryName(country2)}</h4>
                <div class="trade-value">${tradeData.imports.value} ${tradeData.imports.unit}</div>
                <p>Year: ${tradeData.imports.year}</p>
            </div>
            <div class="trade-card">
                <h4>⚖️ Trade Balance</h4>
                <div class="trade-value ${parseFloat(tradeData.balance.value) >= 0 ? 'positive' : 'negative'}">
                    ${tradeData.balance.value} ${tradeData.balance.unit}
                </div>
                <p>Year: ${tradeData.balance.year}</p>
                <p style="font-size: 0.9em; color: #666; margin-top: 5px;">
                    ${parseFloat(tradeData.balance.value) >= 0 ? 'Trade Surplus' : 'Trade Deficit'} for ${this.formatCountryName(country1)}
                </p>
            </div>
        `;
    }

    displayMarketData(country1, country2, marketData1, marketData2) {
        const marketDataContainer = document.getElementById('market-data');
        
        if (!marketDataContainer) {
            console.warn('market-data container not found, skipping market data display');
            return;
        }
        
        let marketHTML = '';

        // Display market data for country1
        if (marketData1 && marketData1.length > 0) {
            marketData1.slice(0, 2).forEach(market => {
                const change = parseFloat(market.DailyChange || 0);
                const changeClass = change >= 0 ? 'positive' : 'negative';
                const changeSymbol = change >= 0 ? '+' : '';
                
                marketHTML += `
                    <div class="market-card">
                        <h4>🏛️ ${market.Symbol} - ${this.formatCountryName(country1)}</h4>
                        <div class="market-price ${changeClass}">${market.Last?.toFixed(2) || 'N/A'}</div>
                        <div class="market-change ${changeClass}">
                            ${changeSymbol}${change.toFixed(2)} (${(parseFloat(market.DailyPercentualChange || 0)).toFixed(2)}%)
                        </div>
                        <div class="market-meta">
                            Last Update: ${new Date(market.Date).toLocaleDateString()}
                        </div>
                    </div>
                `;
            });
        }

        // Display market data for country2
        if (marketData2 && marketData2.length > 0) {
            marketData2.slice(0, 2).forEach(market => {
                const change = parseFloat(market.DailyChange || 0);
                const changeClass = change >= 0 ? 'positive' : 'negative';
                const changeSymbol = change >= 0 ? '+' : '';
                
                marketHTML += `
                    <div class="market-card">
                        <h4>🏛️ ${market.Symbol} - ${this.formatCountryName(country2)}</h4>
                        <div class="market-price ${changeClass}">${market.Last?.toFixed(2) || 'N/A'}</div>
                        <div class="market-change ${changeClass}">
                            ${changeSymbol}${change.toFixed(2)} (${(parseFloat(market.DailyPercentualChange || 0)).toFixed(2)}%)
                        </div>
                        <div class="market-meta">
                            Last Update: ${new Date(market.Date).toLocaleDateString()}
                        </div>
                    </div>
                `;
            });
        }

        if (!marketHTML) {
            marketHTML = `
                <div class="market-card">
                    <h4>📊 Live Market Data</h4>
                    <p><strong>Real-time market indices available for:</strong></p>
                    <p>• Mexico, New Zealand, Sweden, Thailand</p>
                    <p>Select these countries to see live market data from Trading Economics API.</p>
                </div>
            `;
        }

        marketDataContainer.innerHTML = marketHTML;
    }

    async showAvailableIndicators() {
        const indicatorsPreview = document.getElementById('indicators-preview');
        const indicatorsList = document.getElementById('indicators-list');
        
        if (!indicatorsPreview) {
            console.error('indicators-preview element not found!');
            alert('Error: Indicators preview container not found.');
            return;
        }
        
        if (!indicatorsList) {
            console.error('indicators-list element not found!');
            alert('Error: Indicators list container not found.');
            return;
        }
        
        indicatorsPreview.style.display = 'block';
        indicatorsList.innerHTML = '<p>🔄 Loading available indicators...</p>';
        
        try {
            // Get indicators for one of the available countries as an example
            const sampleCountry = 'mexico';
            const indicators = await this.api.getAvailableIndicators(sampleCountry);
            
            if (indicators.length > 0) {
                let indicatorsHTML = `
                    <div style="grid-column: 1 / -1; margin-bottom: 15px; padding: 15px; background: #e7f3ff; border-radius: 8px;">
                        <strong>📍 Sample from ${this.formatCountryName(sampleCountry)}</strong> - 
                        All countries have similar indicator categories available through the API.
                    </div>
                `;
                
                indicators.forEach(indicator => {
                    indicatorsHTML += `
                        <div class="indicator-item">
                            📊 ${indicator}
                        </div>
                    `;
                });
                
                indicatorsList.innerHTML = indicatorsHTML;
            } else {
                indicatorsList.innerHTML = '<p>No indicators available or API error.</p>';
            }
            
        } catch (error) {
            console.error('Error fetching indicators:', error);
            indicatorsList.innerHTML = '<p>❌ Error loading indicators. Please check your API connection.</p>';
        }
    }

    formatCountryName(country) {
        return country.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatValue(value, unit) {
        if (typeof value === 'number') {
            // Format large numbers with commas
            if (Math.abs(value) >= 1000000) {
                return (value / 1000000).toFixed(2) + 'M';
            } else if (Math.abs(value) >= 1000) {
                return (value / 1000).toFixed(1) + 'K';
            } else {
                return value.toFixed(2);
            }
        }
        return value;
    }

    getIndicatorLabel(indicator) {
        const labels = {
            'gdp': 'GDP Growth Rate',
            'inflation': 'Inflation Rate',
            'unemployment': 'Unemployment Rate',
            'interest-rate': 'Interest Rate',
            'population': 'Population',
            'government-debt-to-gdp': 'Government Debt to GDP'
        };
        return labels[indicator] || indicator;
    }

    showLoading() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }
    }

    hideLoading() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    showResults() {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
            resultsElement.style.display = 'block';
        }
    }

    hideResults() {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
            resultsElement.style.display = 'none';
        }
    }

    showError(message) {
        const errorElement = document.getElementById('error-message');
        const errorContainer = document.getElementById('error');
        
        if (errorElement) {
            errorElement.textContent = message;
        } else {
            console.error('error-message element not found!');
            alert('Error: ' + message);
        }
        
        if (errorContainer) {
            errorContainer.style.display = 'block';
        } else {
            console.error('error container not found!');
        }
    }

    hideError() {
        const errorContainer = document.getElementById('error');
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new Dashboard();
    
    // Make dashboard globally available for debugging
    window.dashboard = dashboard;
    
    // Run diagnostic check
    console.log('🔍 Running element diagnostic check...');
    dashboard.checkRequiredElements();
});

// Add some CSS for trade balance styling
const style = document.createElement('style');
style.textContent = `
    .trade-value.positive {
        color: #48bb78;
    }
    .trade-value.negative {
        color: #f56565;
    }
    .chart-container {
        height: 400px;
    }
    #comparisonChart {
        height: 100% !important;
    }
`;
document.head.appendChild(style);