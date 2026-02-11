import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
     {
    room: { type: String, index: true, default: null },
    text: { type: String, required: true },

    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    username: { type: String, required: true },

    toUser: { type: String, default: null, index: true },
    type: { type: String, enum: ["room", "private"], default: "room", index: true },
  },
    {timestamps: true}
)

export default mongoose.model('message', messageSchema)