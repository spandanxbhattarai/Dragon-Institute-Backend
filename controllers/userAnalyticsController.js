import {
    trackVisit,
    trackSubscriber,
    trackEnrollment,
    fetchMonthlyData,
    fetchYearlyData,
    fetchAllData
  } from '../services/userAnalyticsService.js';
  
  const getCurrentMonthYear = () => {
    const now = new Date();
    return { month: now.getMonth() + 1, year: now.getFullYear() };
  };
  
  export const recordVisit = async (req, res) => {
    try {
      const { isNewVisitor, source } = req.body;
      const { month, year } = getCurrentMonthYear();
      
      const result = await trackVisit(month, year, source, isNewVisitor);
      if(result){
      res.status(200).json({message: "Analytics Captured"});
      } else {
        res.status(200).json({message: "Failed to Capture User Visit"})
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const recordSubscriber = async (req, res) => {
    try {
      const { month, year } = getCurrentMonthYear();
      const result = await trackSubscriber(month, year);
      if(result == 1){
        res.status(200).json({message: "Subscriber Recorded Sucessfully"});
      } else {
        res.status(200).json({message: "Couldnt Record Subscriber"});
      }
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const recordEnrollment = async (req, res) => {
    try {
      const { month, year } = getCurrentMonthYear();
      const { plan } = req.query;
      
      if (!plan) {
        return res.status(400).json({ message: 'Plan type is required as query parameter' });
      }
      
      const result = await trackEnrollment(month, year, plan.toLowerCase());
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const getMonthlyAnalytics = async (req, res) => {
    try {
      const { month, year } = req.query;
      
      if (!month || !year) {
        return res.status(400).json({ message: 'Month and year are required' });
      }
      
      const result = await fetchMonthlyData(parseInt(month), parseInt(year));
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const getYearlyAnalytics = async (req, res) => {
    try {
      const { year } = req.query;
      
      if (!year) {
        return res.status(400).json({ message: 'Year is required' });
      }
      
      const result = await fetchYearlyData(parseInt(year));
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const getAllAnalytics = async (req, res) => {
    try {
      const result = await fetchAllData();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };