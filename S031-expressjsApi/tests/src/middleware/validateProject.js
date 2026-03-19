const validateProject = (req, res, next) => {

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Project name is required"
    });
  }

  next();

};

module.exports = validateProject;