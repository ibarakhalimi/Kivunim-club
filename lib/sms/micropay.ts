const MICROPAY_OTP_URL = "https://www.micropay.co.il/extApi/sendOtp.php";
const OTP_CODE_LENGTH = "6";
const OTP_VALID_MINUTES = "5";

type MicropayOtpResponse = {
  status?: number;
  message?: string;
  data?: {
    description?: string;
    remoteIP?: string;
  };
};

type MicropayRequest = {
  phone: string;
  code?: string;
};

function getMicropayToken() {
  const token = process.env.MICROPAY_API_TOKEN;
  if (!token) throw new Error("Missing MICROPAY_API_TOKEN");
  return token;
}

async function callMicropay(payload: Record<string, string>) {
  const response = await fetch(MICROPAY_OTP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: getMicropayToken(),
      codelen: OTP_CODE_LENGTH,
      minvalid: OTP_VALID_MINUTES,
      lang: "he",
      ...payload,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return { ok: false, message: "MICROPAY_HTTP_ERROR" };
  }

  const data = (await response.json().catch(() => null)) as MicropayOtpResponse | null;
  return {
    ok: data?.status === 1,
    message: data?.message ?? "ERROR",
    description: data?.data?.description,
  };
}

export async function sendMicropayOtp({ phone }: MicropayRequest) {
  const result = await callMicropay({
    phone,
    type: "sms",
    webotp: "kivunim-club.vercel.app",
  });

  return {
    ok: result.ok && result.message === "CODE_SENT",
    message: result.message,
    description: result.description,
  };
}

export async function verifyMicropayOtp({ phone, code }: Required<MicropayRequest>) {
  const result = await callMicropay({
    phone,
    code,
  });

  return {
    ok: result.ok && result.message === "CODE_VALID",
    message: result.message,
    description: result.description,
  };
}
