const Thought = require('../models/thought');
const User = require('../models/user');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.userId
    })
    .populate('friends')
    .populate('thoughts')
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Remove the deleted user from their friends' friend lists
    await User.updateMany(
      { _id: { $in: user.friends } },
      { $pull: { friends: user._id } }
    );
    // Remove the user's thoughts
    await Thought.deleteMany({ username: user.username });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    // Check if the friendId exists
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the friend to the user's friends array
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    // find the user who wants to remove a friend
    const user = await User.findById(userId);

    // check if the friendId is in the user's friend list
    if (!user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'Friend not found in the user\'s friend list' });
    }

    // remove the friendId from the user's friend list
    user.friends.pull(friendId);
    await user.save();

    res.json({ message: 'Friend removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { getAllUsers, createUser, getUserById, updateUser, deleteUser, addFriend, removeFriend };