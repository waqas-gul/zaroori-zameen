import mongoose from "mongoose";

const viewSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  viewedAt: {
    type: Date,
    default: Date.now,
  },
});

const View = mongoose.model("View", viewSchema);

export default View;