// Trading Economics Country Comparison Dashboard
// This application uses the Trading Economics API to compare economic indicators between countries

class TradingEconomicsAPI {
    constructor() {
        // For demo purposes, we'll use mock data structure similar to Trading Economics API
        // In a real implementation, you would use your actual API key from tradingeconomics.com
        this.baseURL = 'https://api.tradingeconomics.com';
        this.apiKey = 'guest'; // Replace with your actual API key
        
        // Mock data for demonstration (since we're using guest credentials)
        this.mockData = this.initializeMockData();
    }

    initializeMockData() {
        return {
            'united-states': {
                gdp: { value: 2.1, date: '2024-Q3', unit: '%' },
                inflation: { value: 3.2, date: '2024-09', unit: '%' },
                unemployment: { value: 3.8, date: '2024-09', unit: '%' },
                'interest-rate': { value: 5.25, date: '2024-09', unit: '%' },
                population: { value: 331.9, date: '2024', unit: 'Million' },
                'government-debt-to-gdp': { value: 106.7, date: '2024', unit: '%' }
            },
            'nigeria': {
                gdp: { value: 3.46, date: '2024-Q2', unit: '%' },
                inflation: { value: 33.88, date: '2024-09', unit: '%' },
                unemployment: { value: 5.0, date: '2024-Q2', unit: '%' },
                'interest-rate': { value: 26.75, date: '2024-09', unit: '%' },
                population: { value: 223.8, date: '2024', unit: 'Million' },
                'government-debt-to-gdp': { value: 37.1, date: '2024', unit: '%' }
            },
            'china': {
                gdp: { value: 4.7, date: '2024-Q3', unit: '%' },
                inflation: { value: 0.4, date: '2024-09', unit: '%' },
                unemployment: { value: 5.1, date: '2024-09', unit: '%' },
                'interest-rate': { value: 3.35, date: '2024-09', unit: '%' },
                population: { value: 1412.0, date: '2024', unit: 'Million' },
                'government-debt-to-gdp': { value: 77.1, date: '2024', unit: '%' }
            },
            'germany': {
                gdp: { value: -0.1, date: '2024-Q3', unit: '%' },
                inflation: { value: 1.6, date: '2024-09', unit: '%' },
                unemployment: { value: 6.0, date: '2024-09', unit: '%' },
                'interest-rate': { value: 4.25, date: '2024-09', unit: '%' },
                population: { value: 83.2, date: '2024', unit: 'Million' },
                'government-debt-to-gdp': { value: 66.3, date: '2024', unit: '%' }
            },
            'japan': {
                gdp: { value: 0.7, date: '2024-Q3', unit: '%' },
                inflation: { value: 2.8, date: '2024-09', unit: '%' },
                unemployment: { value: 2.5, date: '2024-09', unit: '%' },
                'interest-rate': { value: 0.25, date: '2024-09', unit: '%' },
                population: { value: 125.8, date: '2024', unit: 'Million' },
                'government-debt-to-gdp': { value: 261.3, date: '2024', unit: '%' }
            },
            'united-kingdom': {
                gdp: { value: 0.6, date: '2024-Q3', unit: '%' },
                inflation: { value: 1.7, date: '2024-09', unit: '%' },
                unemployment: { value: 4.0, date: '2024-09', unit: '%' },
                'interest-rate': { value: 5.0, date: '2024-09', unit: '%' },
                population: { value: 67.5, date: '2024', unit: 'Million' },
                'government-debt-to-gdp': { value: 101.2, date: '2024', unit: '%' }
            },
            'france': {
                gdp: { value: 0.4, date: '2024-Q3', unit: '%' },
                inflation: { value: 1.3, date: '2024-09', unit: '%' },
                unemployment: { value: 7.4, date: '2024-09', unit: '%' },
                'interest-rate': { value: 4.25, date: '2024-09', unit: '%' },
                population: { value: 68.0, date: '2024', unit: 'Million' },
                'government-debt-to-gdp': { value: 111.9, date: '2024', unit: '%' }
            },
            'india': {
                gdp: { value: 6.7, date: '2024-Q2', unit: '%' },
                inflation: { value: 5.08, date: '2024-09', unit: '%' },
                unemployment: { value: 3.2, date: '2024-09', unit: '%' },
                'interest-rate': { value: 6.5, date: '2024-09', unit: '%' },
                population: { value: 1428.0, date: '2024', unit: 'Million' },
                'government-debt-to-gdp': { value: 89.6, date: '2024', unit: '%' }
            },
            'brazil': {
                gdp: { value: 3.2, date: '2024-Q3', unit: '%' },
                inflation: { value: 4.42, date: '2024-09', unit: '%' },
                unemployment: { value: 7.8, date: '2024-09', unit: '%' },
                'interest-rate': { value: 11.25, date: '2024-09', unit: '%' },
                population: { value: 216.4, date: '2024', unit: 'Million' },
                'government-debt-to-gdp': { value: 87.7, date: '2024', unit: '%' }
            },
            'canada': {
                gdp: { value: 1.2, date: '2024-Q3', unit: '%' },
                inflation: { value: 1.6, date: '2024-09', unit: '%' },
                unemployment: { value: 6.5, date: '2024-09', unit: '%' },
                'interest-rate': { value: 4.25, date: '2024-09', unit: '%' },
                population: { value: 39.0, date: '2024', unit: 'Million' },
                'government-debt-to-gdp': { value: 106.7, date: '2024', unit: '%' }
            }
        };
    }

    async getIndicatorData(country, indicator) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (this.mockData[country] && this.mockData[country][indicator]) {
            return this.mockData[country][indicator];
        }
        
        throw new Error(`Data not available for ${country} - ${indicator}`);
    }

    async getTradeData(country1, country2) {
        // Simulate trade data (in a real implementation, this would call the Comtrade endpoints)
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const tradeRelationships = {
            'united-states-nigeria': {
                exports: { value: 1.2, unit: 'Billion USD', year: '2024' },
                imports: { value: 8.7, unit: 'Billion USD', year: '2024' },
                balance: { value: -7.5, unit: 'Billion USD', year: '2024' }
            },
            'nigeria-united-states': {
                exports: { value: 8.7, unit: 'Billion USD', year: '2024' },
                imports: { value: 1.2, unit: 'Billion USD', year: '2024' },
                balance: { value: 7.5, unit: 'Billion USD', year: '2024' }
            },
            'china-nigeria': {
                exports: { value: 15.8, unit: 'Billion USD', year: '2024' },
                imports: { value: 2.1, unit: 'Billion USD', year: '2024' },
                balance: { value: 13.7, unit: 'Billion USD', year: '2024' }
            }
        };

        const key = `${country1}-${country2}`;
        return tradeRelationships[key] || {
            exports: { value: 'N/A', unit: '', year: '2024' },
            imports: { value: 'N/A', unit: '', year: '2024' },
            balance: { value: 'N/A', unit: '', year: '2024' }
        };
    }
}

class Dashboard {
    constructor() {
        this.api = new TradingEconomicsAPI();
        this.chart = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const compareBtn = document.getElementById('compareBtn');
        compareBtn.addEventListener('click', () => this.compareCountries());

        // Allow Enter key to trigger comparison
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.compareCountries();
            }
        });
    }

    async compareCountries() {
        const country1 = document.getElementById('country1').value;
        const country2 = document.getElementById('country2').value;
        const indicator = document.getElementById('indicator').value;

        if (country1 === country2) {
            this.showError('Please select two different countries for comparison.');
            return;
        }

        this.showLoading();
        this.hideError();
        this.hideResults();

        try {
            const [data1, data2, tradeData] = await Promise.all([
                this.api.getIndicatorData(country1, indicator),
                this.api.getIndicatorData(country2, indicator),
                this.api.getTradeData(country1, country2)
            ]);

            this.displayResults(country1, country2, indicator, data1, data2, tradeData);
            this.hideLoading();
            this.showResults();

        } catch (error) {
            console.error('Error fetching data:', error);
            this.showError('Failed to fetch data. Please try again later.');
            this.hideLoading();
        }
    }

    displayResults(country1, country2, indicator, data1, data2, tradeData) {
        // Update country names
        document.getElementById('country1-name').textContent = this.formatCountryName(country1);
        document.getElementById('country2-name').textContent = this.formatCountryName(country2);

        // Update values
        document.getElementById('country1-value').textContent = this.formatValue(data1.value, data1.unit);
        document.getElementById('country2-value').textContent = this.formatValue(data2.value, data2.unit);

        // Update labels
        const indicatorLabel = this.getIndicatorLabel(indicator);
        document.getElementById('country1-label').textContent = indicatorLabel;
        document.getElementById('country2-label').textContent = indicatorLabel;

        // Update dates
        document.getElementById('country1-date').textContent = `As of ${data1.date}`;
        document.getElementById('country2-date').textContent = `As of ${data2.date}`;

        // Create chart
        this.createComparisonChart(country1, country2, indicator, data1, data2);

        // Display trade information
        this.displayTradeInfo(country1, country2, tradeData);
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

    formatCountryName(country) {
        return country.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatValue(value, unit) {
        if (typeof value === 'number') {
            return value.toFixed(2);
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
        document.getElementById('loading').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showResults() {
        document.getElementById('results').style.display = 'block';
    }

    hideResults() {
        document.getElementById('results').style.display = 'none';
    }

    showError(message) {
        document.getElementById('error-message').textContent = message;
        document.getElementById('error').style.display = 'block';
    }

    hideError() {
        document.getElementById('error').style.display = 'none';
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
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