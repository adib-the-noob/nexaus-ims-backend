import { Teacher } from "../models/teacherModel.js";
import sendResponse from "../utils/sendResponse.js";

export const createTeacher = async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    
    sendResponse(res, {
      statusCode: 201,
      message: "Teacher created successfully",
      data: teacher,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message,
    });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    
    sendResponse(res, {
      message: "Teachers fetched successfully",
      data: teachers,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch teachers",
    });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Teacher not found",
      });
    }
    
    sendResponse(res, {
      message: "Teacher fetched successfully",
      data: teacher,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch teacher",
    });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!teacher) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Teacher not found",
      });
    }
    
    sendResponse(res, {
      message: "Teacher updated successfully",
      data: teacher,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message,
    });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Teacher not found",
      });
    }
    
    sendResponse(res, {
      message: "Teacher deleted successfully",
      data: teacher,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to delete teacher",
    });
  }
};
