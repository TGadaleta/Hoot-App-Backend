// controllers/hoots.js

import express from "express";
import verifyToken from "../middleware/verify-token.js";
import Hoot from "../models/hoot.js";
const router = express.Router();

// ========== Public Routes ===========
router.get("/", async (req, res) => {
  try {
    const hoots = await Hoot.find({})
      .populate("author")
      .sort({ createdAt: "desc" });
    res.status(200).json(hoots);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.id).populate("author");
    res.status(200).json(hoot);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ========= Protected Routes =========
router.post("/", verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const hoot = await Hoot.create(req.body);
    hoot._doc.author = req.user;
    res.status(201).json(hoot);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/:id/comments", verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const hoot = await Hoot.findById(req.params.id);
    hoot.comments.push(req.body);
    await hoot.save();

    // Find the newly created comment:
    const newComment = hoot.comments[hoot.comments.length - 1];
    newComment._doc.author = req.user;

    // Respond with the newComment:
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    // Find the hoot:
    const hoot = await Hoot.findById(req.params.id);

    // Check permissions:
    if (!hoot.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    // Update hoot:
    const updatedHoot = await Hoot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Append req.user to the author property:
    updatedHoot._doc.author = req.user;

    // Issue JSON response:
    res.status(200).json(updatedHoot);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.id);

    if (!hoot.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const deletedHoot = await Hoot.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedHoot);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
