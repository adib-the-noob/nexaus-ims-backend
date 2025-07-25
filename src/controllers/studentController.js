import { Student } from "../models/studentModel.js";
import sendResponse from "../utils/sendResponse.js";

export const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    
    sendResponse(res, {
      statusCode: 201,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message,
    });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    
    sendResponse(res, {
      message: "Students fetched successfully",
      data: students,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch students",
    });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Student not found",
      });
    }
    
    sendResponse(res, {
      message: "Student fetched successfully",
      data: student,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch student",
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!student) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Student not found",
      });
    }
    
    sendResponse(res, {
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message,
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Student not found",
      });
    }
    
    sendResponse(res, {
      message: "Student deleted successfully",
      data: student,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to delete student",
    });
  }
};