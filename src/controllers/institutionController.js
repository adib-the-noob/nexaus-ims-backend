import { InstitutionInfo } from "../models/institutionModel.js";
import sendResponse from "../utils/sendResponse.js";

export const addInstitutionInfo = async (req, res) => {
  try {
    const instituteData = new InstitutionInfo(req.body);
    await instituteData.save();
    
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Institution information added successfully",
      data: instituteData,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message,
    });
  }
};

export const getInstitutionInfo = async (req, res) => {
  try {
    // Changed from req.params.eiin to req.params.id
    const institutionInfo = await InstitutionInfo.findOne({ 
      eiin: req.params.id 
    });
    
    if (!institutionInfo) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Institution information not found",
      });
    }
    
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Institution information fetched successfully",
      data: institutionInfo,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch institution information",
    });
  }
};