import {
    getAdvertisements as getAdsRepo,
    getAdvertisementById,
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
  } from "../repository/advertisementRepository.js";
  
  export const getAdvertisements = async (page = 1, limit = 10) => {
    return await getAdsRepo(page, limit);
  };
  
  export const getAdvertisement = async (id) => {
    return await getAdvertisementById(id);
  };
  
  export const createAd = async (ad) => {
    return await createAdvertisement(ad);
  };
  
  export const updateAd = async (id, updatedAd) => {
    return await updateAdvertisement(id, updatedAd);
  };
  
  export const deleteAd = async (id) => {
    return await deleteAdvertisement(id);
  };