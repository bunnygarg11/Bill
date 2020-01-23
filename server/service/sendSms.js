const SendOtp = require("sendotp");
const sendOtp = new SendOtp('313130AUZ6pZHTJ2nk5e1dac4aP1');

module.exports={
    sendOtp:function(phoneNumber){
       
        const sendOtp = new SendOtp(
            "313130AUZ6pZHTJ2nk5e1dac4aP1",
            "Otp for your order is {{otp}}, please only share it with MILAN"
          );
          sendOtp.setOtpExpiry('90');
          sendOtp.send(phoneNumber, "", function(error, data) {
            // console.log(data);
            if(error) throw error
            return data
          });
    },
    verifyOTP:function(phoneNumber,otp){
        sendOtp.verify(phoneNumber, otp, function (error, data) {
            
            // if(data.type == 'success') console.log('OTP verified successfully')
            // if(data.type == 'error') console.log('OTP verification failed')
            if(error) throw error
            return data
          });
    }
}