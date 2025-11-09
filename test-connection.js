const axios = require('axios');
async function testHardhatConnection() {
  try {
    const response = await axios.post('http://localhost:8545', {
      jsonrpc: '2.0',
      method: 'eth_chainId',
      params: [],
      id: 1
    });
    console.log('Hardhat链ID:', response.data.result);
  } catch (error) {
    console.error('连接失败:', error.message);
  }
}
testHardhatConnection();