const mongoose = require("mongoose");

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);



const websiteSchema = new Schema(
  {
    
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

   
    title: {
      type: String,
      required: true,
      default: "Untitled Website",
      trim: true,
      maxlength: 150,
    },

   
    latestCode: {
      type: String,
      required: true,
    },


    conversation: {
      type: [messageSchema],
      default: [],
    },

  
    deployed: {
      type: Boolean,
      default: false,
    },

 
    deployUrl: {
      type: String,
      default: null,
      trim: true,
    },

  
    slug: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);



const Website = mongoose.model("Website", websiteSchema);

console.log("Website model loaded");
console.log("Website.create:", typeof Website.create);
console.log("Website.findOne:", typeof Website.findOne);


module.exports = Website;