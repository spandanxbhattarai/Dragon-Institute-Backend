import {
    createNews,
    findNewsById,
    findAllNewsPaginated,
    updateNewsById,
    deleteNewsById
  } from '../repository/newsRepository.js';
  
  export const createNewsService = async (newsData) => {
    if (!newsData.title || !newsData.publisher || !newsData.content) {
      throw new Error('Title, publisher, and content are required');
    }
    return await createNews(newsData);
  };
  
  export const getNewsByIdService = async (id) => {
    const news = await findNewsById(id);
    if (!news) throw new Error('News not found');
    return news;
  };
  
  export const getAllNewsService = async ({ page, limit }) => {
    return await findAllNewsPaginated({ page, limit });
  };
  
  export const updateNewsService = async (id, updateData) => {
    const updatedNews = await updateNewsById(id, updateData);
    if (!updatedNews) throw new Error('News not found');
    return updatedNews;
  };
  
  export const deleteNewsService = async (id) => {
    const deletedNews = await deleteNewsById(id);
    if (!deletedNews) throw new Error('News not found');
    return deletedNews;
  };