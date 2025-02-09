import axios from 'axios'
import crypto from 'crypto'
import User from "../../models/user.model.js";

var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const FRONTEND_URL = process.env.FRONTEND_URL

export const upgradeAccount =  async (req, res) => {
    let {amount, orderInfo} = req.body
    // var orderInfo = 'pay with MoMo';
    var partnerCode = 'MOMO';
    var redirectUrl = FRONTEND_URL;
    // var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    var ipnUrl = `https://attendance-web-app-backend.onrender.com/user-service/api/upgrade/callback`;

    var requestType = "payWithMethod";
    // var amount = '2000';
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData ='';
    var orderGroupId ='';
    var autoCapture =true;
    var lang = 'vi';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode : partnerCode,
        partnerName : "Test",
        storeId : "MomoTestStore",
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        redirectUrl : redirectUrl,
        ipnUrl : ipnUrl,
        lang : lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData : extraData,
        orderGroupId: orderGroupId,
        signature : signature
    });

    //option for axios
    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        },
        data: requestBody
    }
    let result
    try {
        result = await axios(options)
        return res.status(200).json({
            success: true,
            result: result.data
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            statusCode: 500,
            message: "server error"
        })
    }
}

export const callBackUpgrade = async (req, res) => {
    const { orderInfo, resultCode, amount } = req.body;
    const match = orderInfo.split(" ")
    const email = match[0].replace(/"/g, '')
    const level = Number(match.at(-1))
    try {
        if (resultCode === 0) { // Giao dịch thành công
            const user = await User.findOne({email})
            if(!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            user.level = level
            user.amountMoney += amount

            await user.save()
        }
        return res.status(200).json({ success: true, message: "Cập nhật trạng thái thành công", result: req.body });
    } catch (error) {
        console.error("Lỗi cập nhật trạng thái:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
}

export const upgradeStatus = async (req, res) => {
    const {orderId} = req.body
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`

    const signature = crypto
                    .createHmac("sha256", secretKey)
                    .update(rawSignature)
                    .digest('hex')
    
    const requestBody = JSON.stringify({
        partnerCode: "MOMO",
        requestId: orderId,
        orderId,
        signature,
        lang : 'vi'
    })

    //option axios
    const option = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/query",
        headers: {
            'Content-Type': 'application/json',
        },
        data: requestBody
    }

    let result = await axios(option)

    try {
        result = await axios(option)
        return res.status(200).json(result.data)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            statusCode: 500,
            message: "server error"
        })
    }
}