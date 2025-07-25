import { Resource } from "../models/resouceModel.js";
import { InstitutionInfo } from "../models/institutionModel.js";

import sendResponse from "../utils/sendResponse.js";

export const addResource = async (req, res) => {
    try {
        const institute = await InstitutionInfo.findOne({ eiin: req.params.instituteId });
        if (institute === null) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Institute not found",
            });
        }
        const resourceData = new Resource(
            {
                title: req.body.title,
                description: req.body.description,
                file_url: req.body.file_url,
                institute_id: institute._id,
                isPublic: req.body.isPublic || false,
                type: req.body.type
            }
        );
        await resourceData.save();
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Resource added successfully",
            data: resourceData,
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
        });
    }
}

export const getResources = async (req, res) => {
    try {
        const institute = await InstitutionInfo.findOne({ eiin: req.params.instituteId });
            if (institute === null) {
                return sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: "Institute not found",
                });
            }
        const resourceType = req.query.type;
        if (!resourceType || !["download", "notice"].includes(resourceType)) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Invalid or missing resource type",
            });
        }
        const resources = await Resource.find({ institute_id: institute._id, type: resourceType });
        if (resources.length === 0) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "No resources found for this institute",
            });
        }
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Resources fetched successfully",
            data: resources,
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to fetch resources",
        });
    }
}