import mongoose from "mongoose";
import FileSchema from "./schema/files.schema.js";
import Settings from "./schema/settings.schema.js";

export async function uploadFile(req, res) {
    const { file_list, description, size } = req.body;
    try {
        if (file_list && Array.isArray(file_list) && file_list.length > 0) {
            if (description) {
                file_list[0]['description'] = description;
            };
            let insertFile = await FileSchema.insertMany(file_list);
            if (insertFile && insertFile.length > 0) {
                // let size_con = size / 1000000;
                Settings.updateOne({ alias: "general" }, { $inc: { storage: size, file_count: insertFile.length } }, { upsert: true }).then(() => { });
                return res.status(200).send({ status: true, message: "File Insert Successfully" });
            } else {
                return res.status(500).send({ status: false, message: "Something went wrong! Please try again." })
            }
        } else {
            return res.status(400).send({ status: false, message: "Please check the files and try again" });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again." });
    };
};

export async function favouriteAddRemove(req, res) {
    const { file_id } = req.body;
    try {
        if (!file_id || !mongoose.isValidObjectId(file_id)) {
            return res.status(400).send({ status: false, message: "Please check the File id and try again" });
        }
        let fileDetails = await FileSchema.findOne({ _id: new mongoose.Types.ObjectId(file_id) });
        if (fileDetails) {
            let updateDetails = await FileSchema.updateOne({ _id: fileDetails._id, status: 1 }, { favourite: fileDetails.favourite ? 0 : 1 });
            if (updateDetails && updateDetails.modifiedCount > 0) {
                Settings.updateOne({ alias: "general" }, { $inc: { favourite: fileDetails.favourite ? -1 : 1 } }, { upsert: true }).then(() => { });
                return res.status(200).send({ status: true, message: `Favourtie ${fileDetails.favourite ? 'removed' : 'added'} successfully` });
            } else {
                return res.status(400).send({ status: false, message: "SOmething went wrong!Please try again" });
            }
        } else {
            return res.status(404).send({ status: false, message: "File not found" });
        };
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again." })
    };
};

export async function binFiles(req, res) {
    const { file_id } = req.body;
    try {
        if (!file_id || !mongoose.isValidObjectId(file_id)) {
            return res.status(400).send({ status: false, message: "Please check the File id and try again" });
        }
        let fileDetails = await FileSchema.updateOne({ _id: new mongoose.Types.ObjectId(file_id) }, { status: 2 });
        if (fileDetails && fileDetails.modifiedCount > 0) {
            return res.status(200).send({ status: true, message: "File moved to bin" });
        } else {
            return res.status(404).send({ status: false, message: "File not found" });
        };
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again." })
    };
};

export async function restoreBinFiles(req, res) {
    const { file_id } = req.body;
    try {
        if (!file_id || !mongoose.isValidObjectId(file_id)) {
            return res.status(400).send({ status: false, message: "Please check the File id and try again" });
        }
        let fileDetails = await FileSchema.updateOne({ _id: new mongoose.Types.ObjectId(file_id) }, { status: 1 });
        if (fileDetails && fileDetails.modifiedCount > 0) {
            return res.status(200).send({ status: true, message: "File restore successfully" });
        } else {
            return res.status(404).send({ status: false, message: "File not found" });
        };
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again." })
    };
};

export async function deleteBinFiles(req, res) {
    const { file_id, size, total_size } = req.body;
    try {
        if (!file_id || !mongoose.isValidObjectId(file_id)) {
            return res.status(400).send({ status: false, message: "Please check the File id and try again" });
        };
        let fileDetails = await FileSchema.deleteOne({ _id: new mongoose.Types.ObjectId(file_id) });
        if (fileDetails && fileDetails.deletedCount > 0) {
            let size_val = total_size - (size/1000000);
            Settings.updateOne({ alias: "general" }, {$inc:{ storage: -size }}).then(() => { })
            return res.status(200).send({ status: true, message: "File removed successfully" });
        } else {
            return res.status(404).send({ status: false, message: "File not found" });
        };
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again." })
    };
};

export async function listFiles(req, res) {
    const { search, status, favourite } = req.body;
    try {
        let skip = req.body.skip ? parseInt(req.body.skip) : 0;
        let limit = req.body.limit ? parseInt(req.body.limit) : 10;
        let condition = {};
        if (status === 1 && favourite) {
            condition.favourite = 1
        };
        if (status) {
            condition.status = status;
        };
        if (search) {
            condition.description = { $regex: search + ".*", $options: "si" };
        };
        let fileList = await FileSchema.find(condition).sort({ createdAt: -1 }).skip(skip).limit(limit);
        let countDoc = await FileSchema.countDocuments(condition)
        return res.status(200).send({ status: true, message: "File lists found", response: fileList, counts: countDoc })
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again." })
    }
};

export async function GeneralDetails(req, res) {
    try {
        let SettingDetails = await Settings.findOne({ alias: "general" });
        if (SettingDetails) {
            return res.status(200).send({ status: true, message: "Settings found", response: SettingDetails });
        } else {
            await Settings.insertMany({ alias: "general" });
            let sizeettingDetails = await Settings.findOne({ alias: "general" });
            return res.status(200).send({ status: true, message: "Settings found", response: sizeettingDetails });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again." })
    }
}