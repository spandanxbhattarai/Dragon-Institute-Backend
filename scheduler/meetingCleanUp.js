import { cleanupExpiredMeetingsService } from '../services/batchService.js';

export const scheduleMeetingCleanup = () => {
  // Define the interval in milliseconds (24 hours = 24 * 60 * 60 * 1000 ms)
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  
  // Run the cleanup function immediately once when the server starts
  runCleanup();
  
  // Then set it to run every 24 hours
  setInterval(runCleanup, TWENTY_FOUR_HOURS);
};

const runCleanup = async () => {
  try {
    console.log('Running scheduled meeting cleanup...');
    const result = await cleanupExpiredMeetingsService();
    console.log(`Cleaned up expired meetings from ${result.modifiedCount} batches`);
  } catch (error) {
    console.error('Error cleaning up expired meetings:', error);
  }
};