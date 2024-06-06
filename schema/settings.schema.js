import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
    {
        alias: { type: String, default: "general" },
        storage: { type: Number, default: 0 },
        storage_mb: { type: Number, default: 0 },
        file_count: { type: Number, default: 0 },
        favourite: { type: Number, default: 0 },
        bin: { type: Number, default: 0 },
        status: { type: Number, default: 1 }
    }, {
    timestamps: true,
    versionKey: false
}
);

export default mongoose.model("Settings", settingSchema, "Settings")