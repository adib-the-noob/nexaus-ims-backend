import { Committee } from "../models/committeeModel.js";
import sendResponse from "../utils/sendResponse.js";

export const createCommittee = async (req, res) => {
  try {
    const committee = new Committee(req.body);
    await committee.save();
    
    sendResponse(res, {
      statusCode: 201,
      message: "Committee member created successfully",
      data: committee,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message,
    });
  }
};

export const getAllCommittees = async (req, res) => {
  try {
    const committees = await Committee.find();
    
    sendResponse(res, {
      message: "Committee members fetched successfully",
      data: committees,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch committee members",
    });
  }
};

export const getCommitteeById = async (req, res) => {
  try {
    const committee = await Committee.findById(req.params.id);
    if (!committee) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Committee member not found",
      });
    }
    
    sendResponse(res, {
      message: "Committee member fetched successfully",
      data: committee,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch committee member",
    });
  }
};

export const updateCommittee = async (req, res) => {
  try {
    const committee = await Committee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!committee) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Committee member not found",
      });
    }
    
    sendResponse(res, {
      message: "Committee member updated successfully",
      data: committee,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message,
    });
  }
};

export const deleteCommittee = async (req, res) => {
  try {
    const committee = await Committee.findByIdAndDelete(req.params.id);
    if (!committee) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Committee member not found",
      });
    }
    
    sendResponse(res, {
      message: "Committee member deleted successfully",
      data: committee,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to delete committee member",
    });
  }
};