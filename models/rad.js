var mongoose = require("mongoose");
var User = require("./user");

var radSchema = new mongoose.Schema({
                    name: {
                          type: String, 
                          required: true
                        },
                    reason: {
                          type: String, 
                          required: true
                        },
                    
                    date: String,
                    ownerId: String,
                    // Used for editing and deleting rads
                    image: [String],
                    author: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                    },
                     // This allows me to populate author data
                    // as needed
                  });



// radSchema.pre('remove', function(next) {
//     ****.remove({rad: this._id}).exec();
//     next();
// });

// Removes any associated data to a given rad

var Rad = mongoose.model("Rad", radSchema);

module.exports = Rad;