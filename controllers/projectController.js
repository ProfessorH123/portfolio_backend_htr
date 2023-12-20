const Project = require("../models/projects");
const Newsletter = require("../models/Newsletter");
const nodemailer = require("nodemailer");
// GET ALL PROJECTS
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Error fetching projects" });
  }
};

// GET PROJECT BY ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Error fetching project" });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, description, coverImageUrl, videoDemoUrl, tags } = req.body;
    const newProject = new Project({
      title,
      description,
      coverImageUrl,
      videoDemoUrl,
      tags,
    });
    const savedProject = await newProject.save();

    const subscribers = await Newsletter.find({}, "email");

    const emailSubject = "New Project Announcement";
    const emailBody = `Check out my new project: ${title}\n\nTags: ${tags.join(
      ", "
    )}`;

    await Promise.all(
      subscribers.map(async (subscriber) => {
        await sendEmail(subscriber.email, emailSubject, emailBody);
      })
    );

    res.json(savedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating project" });
  }
};

// Function to send emails
const sendEmail = async (to, subject, body) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ttriki50@gmail.com",
      pass: "hlctjnhciorbhmkc",
    },
  });

  const mailOptions = {
    from: "ttriki50@gmail.com",
    to,
    subject,
    text: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
};

// UPDATE PROJECT BY ID
const updateProjectById = async (req, res) => {
  try {
    const { title, description, coverImageUrl, videoDemoUrl, tags } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, coverImageUrl, videoDemoUrl, tags },
      { new: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: "Error updating project" });
  }
};

// DELETE PROJECT BY ID
const deleteProjectById = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting project" });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProjectById,
  deleteProjectById,
};
