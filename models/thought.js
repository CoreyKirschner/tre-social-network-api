const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const reactionSchema = require('./reaction');

const dateFormat = timestamp => {
  return new Date(timestamp).toLocaleDateString();
};

const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    maxLength: 280
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: timestamp => dateFormat(timestamp)
  },
  username: {
    type: String,
    required: true
  },
  reactions: [reactionSchema]
}, {
  toJSON: {
    virtuals: true,
    getters: true
  },
  id: false
});

// Virtual to count the reactions for each thought
reactionSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;