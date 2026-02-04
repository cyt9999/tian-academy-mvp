
const ALPHAVANTAGE_KEY = 'S2UMONK1OCRBUJ5M';

export const fetchStockPrice = async (symbol: string): Promise<number | null> => {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHAVANTAGE_KEY}`
    );
    const data = await response.json();
    const priceStr = data['Global Quote']?.['05. price'];
    
    if (priceStr) {
      return parseFloat(priceStr);
    }
    return null;
  } catch (error) {
    console.error("Alpha Vantage Error:", error);
    return null;
  }
};
