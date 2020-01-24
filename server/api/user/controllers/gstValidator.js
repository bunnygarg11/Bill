var Services = require("./../../../service/network");
const pool = require("./../../../config/database");
var validator = require("gstin-validator");
// validator.isValidGSTNumber('12AAACI1681G1Z0');
// validator.ValidateGSTIN('47AAACI1681G1Z0');
// validator.getGSTINInfo('12AAACI1681G1Z0');
const gstValid = async (req, res, next) => {
 try {
    const valid = validator.isValidGSTNumber(req.body.gstNumber);

    if(!valid){
          return Services._handleError(res, "Not a valid gst");
          //   return res.status(400).send("Not a valid gst")
    }
    let data=await pool.query(`SELECT firstName,lastName FROM mbillUsers WHERE gstNumber="${req.body.gstNumber}"`)
    if(data.length===0){
          return Services._handleError(res, "Gst Number Not Matched");
          // return res.status(400).send("Not a valid gst")
    }
    data=data[0]
  
    // res.end({firstname:data.firstName,lastname:data.lastName,msg:"Gst verified"})
    Services._response(res, { firstname:data.firstName,lastname:data.lastName},"Gst verified");

  
 } catch (error) {
    Services._handleError(res, error.message);
 }

};
module.exports = { gstValid };
