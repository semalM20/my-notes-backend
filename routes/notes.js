const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const router = express.Router();
const Notes = require("../models/notes");
const { body, validationResult } = require("express-validator");

// add Note Route - requires authentication
router.post(
  "/addnote",
  [
    //checking if title length is minimum 5
    body("title")
      .isLength({ min: 5 })
      .withMessage("Name length must be atleast 5"),
    //checking min description length is minimum 5
    body("desc")
      .isLength({ min: 5 })
      .withMessage("desc length must be atleast 5"),
  ],
  isLoggedIn,
  async (req, res) => {
    //check whether there are errors in the input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newNote = new Notes({
        title: req.body.title,
        desc: req.body.desc,
        tag: req.body.tag,
        user: req.user,
      });
      await newNote.save();

      res.json(newNote);
    } catch (error) {
      res.json("Internal Server error");
    }
  }
);

// show all Note Route - requires authentication
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user });
    res.json(notes);
  } catch (error) {
    res.json("Internal server error");
  }
});

// update Note Route - requires authentication
router.put(
  "/updateNote/:id",
  [
    //checking if title length is minimum 5
    body("title")
      .isLength({ min: 5 })
      .withMessage("Name length must be atleast 5"),
    //checking min description length is minimum 5
    body("desc")
      .isLength({ min: 5 })
      .withMessage("desc length must be atleast 5"),
  ],
  isLoggedIn,
  async (req, res) => {
    //check whether there are errors in the input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let newNote = {};
      if (req.body.title) {
        newNote.title = req.body.title;
      }
      if (req.body.desc) {
        newNote.desc = req.body.desc;
      }
      if (req.body.tag) {
        newNote.tag = req.body.tag;
      }

      //find the note to be updated
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return req.status(404).send("not found");
      }

      if (note.user.toString() != req.user) {
        return res.status(401).send("not allowed");
      }

      note = await Notes.findByIdAndUpdate(req.params.id, newNote, {
        new: true,
      });
      res.json(note);
    } catch (error) {
      res.json("Internal server error");
    }
  }
);

// delete Note Route - requires authentication
router.delete("/deleteNote/:id", isLoggedIn, async (req, res) => {
  try {
    //find the note to be updated
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return req.status(404).send("not found");
    }

    if (note.user.toString() != req.user) {
      return res.status(401).send("not allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: "Note deleted successfully", note });
  } catch (error) {
    res.json("Internal server error");
  }
});

module.exports = router;
