const _ = require('lodash');
const BillingCycle = require('../billingCycle/billingCycle');

//Create another middleware
function getSummary(req, res) {
    BillingCycle.aggregate({
            //Sum all credits/debts from each entry
            $project: {
                credit: {
                    $sum: "$credits.value"
                },
                debt: {
                    $sum: "$debts.value"
                }
            }
        }, {
            //Sum all credits/debts from all entries using the previous calculated values
            $group: {
                _id: null,
                credit: {
                    $sum: "$credit"
                },
                debt: {
                    $sum: "$debt"
                }
            }
        }, {
            //Do not show id, only credit and debt
            $project: {
                _id: 0,
                credit: 1,
                debt: 1
            }
        },
        function(error, result) {
            if (error) {
                res.status(500).json({
                    errors: [error]
                })
            } else {
                //Define all default in case result is undefined, null, etc
                res.json(_.defaults(result[0], {
                    credit: 0,
                    debt: 0
                }))
            }
        })
}

module.exports = {
    getSummary
}
