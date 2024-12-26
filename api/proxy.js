import axios from 'axios';

export default async function handler(req, res) {
  const targetUrl = `http://ec2-3-39-240-71.ap-northeast-2.compute.amazonaws.com:8080${req.url.replace('/api', '')}`;
  
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.method !== 'GET' ? req.body : undefined,
      params: req.method === 'GET' ? req.query : undefined,
      headers: {
        ...req.headers,
        host: new URL(targetUrl).host,
        'Content-Type': 'application/json',
      },
    });
    
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 응답 전송
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    // 에러 응답
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Internal Server Error',
      message: error.message
    });
  }
}