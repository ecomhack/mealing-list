
var braintree = require('braintree');
var gateway;

module.exports = {
	getGateway: function() {
		if (gateway)
			return gateway;

		gateway = braintree.connect({
			environment: braintree.Environment.Sandbox,
			merchantId: "3m5jmx73r6njsfx3",
			publicKey: "krbdnytx4hz4bd2z",
			privateKey: "6423079fa2fd59377580bf389fa15396"
		});

		return gateway;
	}
};

