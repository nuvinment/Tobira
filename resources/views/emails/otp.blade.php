<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body{font-family:Arial,sans-serif;background:#F7F5F2;margin:0;padding:0}
    .wrap{max-width:480px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E0E0E0}
    .header{background:#BC002D;padding:28px 32px;text-align:center}
    .header h1{color:#fff;font-size:24px;margin:0;letter-spacing:.05em}
    .header p{color:#ffaaaa;font-size:12px;margin:4px 0 0;font-family:'Noto Serif JP',serif}
    .body{padding:32px}
    .greeting{font-size:15px;color:#333;margin-bottom:16px}
    .otp-box{background:#F7F5F2;border:2px dashed #BC002D;border-radius:10px;padding:20px;text-align:center;margin:20px 0}
    .otp-code{font-size:40px;font-weight:700;color:#BC002D;letter-spacing:10px}
    .otp-note{font-size:12px;color:#757575;margin-top:8px}
    .footer{padding:20px 32px;border-top:1px solid #E0E0E0;font-size:11px;color:#999;text-align:center}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>扉 Tobira</h1>
      <p>Business Japanese Learning Platform</p>
    </div>
    <div class="body">
      <div class="greeting">こんにちは、{{ $userName }} さん！<br/>Welcome to Tobira. Use the code below to verify your email address.</div>
      <div class="otp-box">
        <div class="otp-code">{{ $otp }}</div>
        <div class="otp-note">This code expires in 10 minutes</div>
      </div>
      <p style="font-size:13px;color:#555;line-height:1.6">If you did not create a Tobira account, you can safely ignore this email.</p>
    </div>
    <div class="footer">© 2025 Tobira · 扉 · Business Japanese Learning Platform</div>
  </div>
</body>
</html>