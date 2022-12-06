const axios = require('axios')

async function sparrowSMS ({phone, otp_string}){

    const response = await axios.post("http://api.sparrowsms.com/v2/sms/",
    data = {'token' : 'v2_AV4Juydy7i0E0LeOYqXt4t7TCGt.0j8g',
      'from'  : 'Demo',
      'to'    : `${phone}`,
      'text'  : `Your OTP code for your Login_Form is ${otp_string}`
    })

    return response;
}

module.export = sparrowSMS;