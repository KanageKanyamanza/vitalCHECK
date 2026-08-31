const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role:      { type: String, enum: ['owner', 'member'], default: 'member' },
    joinedAt:  { type: Date, default: Date.now },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [teamMemberSchema],

  subscription: {
    plan:      { type: String, enum: ['free', 'standard', 'premium', 'diagnostic'], default: 'free' },
    status:    { type: String, enum: ['active', 'inactive', 'cancelled', 'expired'], default: 'inactive' },
    startDate: Date,
    endDate:   Date,
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null },
  },

  maxMembers: { type: Number, default: 5 },
  createdAt:  { type: Date, default: Date.now },
});

teamSchema.index({ owner: 1 });
teamSchema.index({ 'members.user': 1 });

module.exports = mongoose.model('Team', teamSchema);
