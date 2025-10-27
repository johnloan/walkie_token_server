// TODO: This file will forward requests to Dart Frog build.
// Next step: After Dart Frog build is provided, this file will require the compiled handler.
module.exports = (req, res) => {
  res.status(501).json({ error: "Build step required. Contact support to finalize adapter." });
};