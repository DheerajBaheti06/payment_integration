import axios from "axios";

const itemsPerPage = 7;

export const fetchIndianNews = async (page = 1) => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=india&language=en&sortBy=publishedAt&pageSize=${itemsPerPage}&page=${page}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
    );
    return {
      articles: response.data.articles || [],
      totalResults: response.data.totalResults || 0,
    };
  } catch (error) {
    console.error("Error fetching Indian news:", error);
    return { articles: [], totalResults: 0 };
  }
};

export const fetchWorldNews = async (page = 1) => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?language=en&pageSize=${itemsPerPage}&page=${page}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
    );
    return {
      articles: response.data.articles || [],
      totalResults: response.data.totalResults || 0,
    };
  } catch (error) {
    console.error("Error fetching World news:", error);
    return { articles: [], totalResults: 0 };
  }
};
