import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const sendOtpSms = async (phone, otp) => {
  const msg = `Your OTP is ${otp}`;
  const url = `http://bulksmsbd.net/api/smsapi?api_key=${process.env.SMS_API_KEY}&type=text&number=${phone}&senderid=8809617628506&message=${encodeURIComponent(
    msg
  )}`;
  try {
    const response = await axios.get(url);
    if (
      response.data?.response_code === 202 ||
      response.data?.status === "SUCCESS"
    ) {
      return { success: true };
    }
    return { success: false, message: "SMS failed", data: response.data };
  } catch (err) {
    return { success: false, message: "SMS error", data: err.message };
  }
};

export default sendOtpSms;
