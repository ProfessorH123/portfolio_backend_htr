const Newsletter = require("../models/Newsletter");
const nodemailer = require("nodemailer");

// GET ALL SUBSCRIBERS
const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find();
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching subscribers" });
  }
};

// GET SUBSCRIBER BY ID
const getSubscriberById = async (req, res) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ error: "Subscriber not found" });
    }
    res.json(subscriber);
  } catch (error) {
    res.status(500).json({ error: "Error fetching subscriber" });
  }
};

// SUBSCRIBE A NEW EMAIL
const subscribeEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const existingSubscriber = await Newsletter.findOne({ email });

    if (!email) {
      throw new Error("Email cannot be empty");
    }

    if (existingSubscriber) {
      throw new Error("Email is already subscribed");
    }

    const newSubscriber = new Newsletter({ email });
    const savedSubscriber = await newSubscriber.save();

    await sendConfirmationEmail(email);

    res.status(200).json({
      message: "Email subscribed successfully",
      subscriber: savedSubscriber,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const sendConfirmationEmail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ttriki50@gmail.com",
      pass: "hlctjnhciorbhmkc",
    },
  });

  const mailOptions = {
    from: "ttriki50@email.com",
    to: email,
    subject: "Subscription Confirmation",
    text: "Thank you for subscribing to our newsletter!",
  };

  await transporter.sendMail(mailOptions);
};

// UNSUBSCRIBE EMAIL BY ID
const unsubscribeEmailById = async (req, res) => {
  try {
    const unsubscribedSubscriber = await Newsletter.findByIdAndDelete(
      req.params.id
    );
    if (!unsubscribedSubscriber) {
      return res.status(404).json({ error: "Subscriber not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error unsubscribing email" });
  }
};

module.exports = {
  getAllSubscribers,
  getSubscriberById,
  subscribeEmail,
  unsubscribeEmailById,
};
