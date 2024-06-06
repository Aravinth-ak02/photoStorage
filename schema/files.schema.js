import mongoose from "mongoose";

const FilesSchema = new mongoose.Schema(
    {
        file_url: String,
        file_name: String,
        description: String,
        favourite: { type: Number, default: 0 },//0=>not favourite ,1=>favourite
        file_size: { type: Number, default: 0 },
        status: { type: Number, default: 1 } //1=> active , 2=>bin
    }, {
    timestamps: true,
    versionKey: false
}
);

export default mongoose.model("Files", FilesSchema, "Files")