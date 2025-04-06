const transectionModel = require("../models/transectionModel");
const moment = require("moment");

// Get All Transactions with Filters
const getAllTransection = async (req, res) => {
  try {
    const { frequency, selectedDate, type, userid } = req.body;

    let filter = { userid };

    // Date Filter
    if (frequency !== "custom") {
      const startDate = moment().subtract(Number(frequency), "days").startOf("day").toDate();
      filter.date = { $gte: startDate };
    } else if (selectedDate && selectedDate.length === 2) {
      const [start, end] = selectedDate;
      filter.date = {
        $gte: moment(start).startOf("day").toDate(),
        $lte: moment(end).endOf("day").toDate(),
      };
    }

    // Type Filter
    if (type !== "all") {
      filter.type = type;
    }

    const transactions = await transectionModel.find(filter).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Add Transaction
const addTransection = async (req, res) => {
  try {
    const newTransection = new transectionModel(req.body);
    await newTransection.save();
    res.status(201).send("Transaction Created");
  } catch (error) {
    console.error("❌ Add Error:", error);
    res.status(500).json(error);
  }
};

// Edit Transaction
const editTransection = async (req, res) => {
  try {
    await transectionModel.findOneAndUpdate(
      { _id: req.body.transactionId },
      req.body.payload
    );
    res.status(200).send("Edit Successfully");
  } catch (error) {
    console.error("❌ Edit Error:", error);
    res.status(500).json(error);
  }
};

// Delete Transaction
const deleteTransection = async (req, res) => {
  try {
    await transectionModel.findOneAndDelete({ _id: req.body.transactionId });
    res.status(200).send("Transaction Deleted!");
  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json(error);
  }
};

module.exports = {
  getAllTransection,
  addTransection,
  editTransection,
  deleteTransection,
};
