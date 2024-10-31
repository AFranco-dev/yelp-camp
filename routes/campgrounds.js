// EXTERNAL DEPENDENCIES
const express = require("express");
const router = express.Router({ mergeParams: true });

// INTERNAL DEPENDENCIES
const {
  isLoggedIn,
  isCampgroundAuthor,
  campgroundSchemaCheck,
} = require("../utils/middleware");
const {
  createCampground,
  showCreateCampgroundForm,
  showCampgroundIndex,
  showCampgroundWithId,
  editCampgroundWithId,
  showEditCampgroundWithIdForm,
  deleteCampgroundWithId,
} = require("../controllers/campgroundController");

// CAMPGROUND OPERATIONS
// CREATE
// CREATE NEW CAMPGROUND
router.post("", isLoggedIn, campgroundSchemaCheck, createCampground);
// SHOW CREATE NEW CAMPGROUND FORM
router.get("/create", isLoggedIn, showCreateCampgroundForm);

// READ
// SHOW ALL CAMPGROUNDS
router.get("", showCampgroundIndex);
// SHOW CAMPGROUND WITH ID
router.get("/:id", showCampgroundWithId);

// UPDATE
// EDIT CAMPGROUND BY ID
router.put(
  "/:id",
  isLoggedIn,
  isCampgroundAuthor,
  campgroundSchemaCheck,
  editCampgroundWithId
);
// SHOW EDIT CAMPGROUND BY ID FORM
router.get(
  "/:id/edit",
  isLoggedIn,
  isCampgroundAuthor,
  showEditCampgroundWithIdForm
);

// DELETE
// DELETE CAMPGROUND BY ID
router.delete("/:id", isLoggedIn, isCampgroundAuthor, deleteCampgroundWithId);

module.exports = router;
