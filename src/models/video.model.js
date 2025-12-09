import mongoose from "mongoose";
import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const VideoSchema = new Schema(
    {
        videoFile:{
            type: String, //cloudinary url
            required: true,
        },
        thumbnail:{
            type: String, //cloudinary url
            required: true,
        },
        title:{
            type: String, 
            required: true,
        },
        description:{
            type: String, 
            required: true,
        },
        duration:{
            type: Number, 
            required: true,
        },
        views:{
            type: Number,
            default: 0,
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }

    },
    { timestamps: true }
)
//adding pagination plugin so that we can use aggregation queries with pagination
VideoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", VideoSchema);