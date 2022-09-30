import Room from "../models/Room.js";

export const createRoom = async (req, res, next) => {
  try {
    const newRoom = new Room();

    await newRoom.save();
    res.status(200).json({
      success: true,
      data: newRoom,
    });
  } catch (err) {
    next(err);
  }
};

export const getRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const foundItem = await Room.findById(roomId);
    if (foundItem)
      res.status(200).json({
        success: true,
        data: foundItem,
      });
  } catch (err) {
    next(err);
  }
};

export const assignLog = async (req, res, next) => {
  try {
    await Room.findByIdAndUpdate(req.body.roomId, {
      $push: { logs: req.body.log },
    });
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const getLog = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const foundItem = await Room.findById(roomId);
    if (foundItem)
      res.status(200).json({
        success: true,
        data: foundItem.logs,
      });
  } catch (err) {
    next(err);
  }
};
