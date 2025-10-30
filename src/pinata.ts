import axios from "axios";
import FormData from "form-data";
export interface NFTFrom {
    name: string;
    description: string;
    price: number;
    image: string,
}

export const uploadJSONToIPFS = async (JSONBody: NFTFrom) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  try {
    const response = await axios.post(
      url,
      JSONBody,
      {
        headers: {
          "Content-Type": "application/json", // 显式指定
          'pinata_api_key': import.meta.env.VITE_APP_PINATA_KEY,
          'pinata_secret_api_key': import.meta.env.VITE_APP_PINATA_SECRET,
        }
      }
    );
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (error:any) {
    console.error('Pinata 上传失败:', error.response?.data || error.message);
    throw error;
  }
};
export const uploadFileToIPFS = async (file: File) => {
    if (!file) return null;
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    try {
        const formData = new FormData();
        // 注意：需传入原始 File 对象（而非 FileItem）
        formData.append('file', file);
        formData.append('pinataMetadata', JSON.stringify({
            name: file.name,
            keyvalues: { type: 'nft' }
        }));

        const response = await axios.post(
            // 接口路径需完整，通过代理转发时保持一致
            url,
            formData,
            {
                maxBodyLength: 500 * 1024 * 1024,// 上传图片的大小的限制500MB
                headers: {
                    "Content-Type": `multipart/form-data; boundary=`,
                    'pinata_api_key': import.meta.env.VITE_APP_PINATA_KEY,
                    'pinata_secret_api_key': import.meta.env.VITE_APP_PINATA_SECRET,
                    // FormData 会自动设置 Content-Type 为 multipart/form-data，无需手动指定
                }
            }
        );
        // 返回 IPFS 网关地址（用于访问文件）
        return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
        console.error('Pinata 上传失败:', error);
        throw error;
    }
};
