/**
 * MainControllerController
 *
 * @description :: Server-side logic for managing Maincontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

function getCurrencySymbol(result) {
	switch (result.transaction.currencyIsoCode) {
		case 'USD':
			return '$';
		default:
			return '€';
	}
}

module.exports = {

	btToken: function(req, res) {
		BtGateway.getGateway().clientToken.generate({},
			function (err, response) {
			if (err)
				return res.negotiate(err);

			res.send(response.clientToken);
		});
	},

	checkout : function(req, res){
		var nonce = req.body.payment_method_nonce;
		var ammountToPay = req.param('Pay')
		BtGateway.getGateway().transaction.sale({
			amount: ammountToPay,
			paymentMethodNonce: nonce,
		}, function (err, result) {
			if (err)
				return res.negotiate(err);

			console.log(result);
			res.view('payments-success', {
				success: result.success,
				amount: getCurrencySymbol(result) +
					result.transaction.amount
			});
		});
	},


	foodpairGateway: function(req, res) {
		res.send();
	}

};

