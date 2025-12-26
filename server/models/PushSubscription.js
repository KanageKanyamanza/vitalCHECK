const mongoose = require("mongoose");

const pushSubscriptionSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		subscription: {
			endpoint: {
				type: String,
				required: true,
			},
			keys: {
				p256dh: {
					type: String,
					required: true,
				},
				auth: {
					type: String,
					required: true,
				},
			},
		},
		device: {
			browser: String,
			os: String,
			device: String,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

// Empêcher les doublons d'abonnements pour un même endpoint
pushSubscriptionSchema.index({ "subscription.endpoint": 1 }, { unique: true });
pushSubscriptionSchema.index({ user: 1 });

module.exports = mongoose.model("PushSubscription", pushSubscriptionSchema);
