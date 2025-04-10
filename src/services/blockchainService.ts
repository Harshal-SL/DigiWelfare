import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { toast } from 'sonner';

// Use local blockchain
const LOCAL_RPC_URL = 'http://localhost:8545';
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

// Enhanced ABI for login logging
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "userId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "email",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "timestamp",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "ipAddress",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "deviceInfo",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "userType",
        "type": "string"
      }
    ],
    "name": "logLogin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "userId",
        "type": "string"
      }
    ],
    "name": "getLoginHistory",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "userId",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "email",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "timestamp",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipAddress",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "deviceInfo",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "userType",
            "type": "string"
          }
        ],
        "internalType": "struct LoginLog[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

class BlockchainService {
  private web3: Web3;
  private contract: any;
  private loginLogs: any[] = []; // In-memory storage for development

  constructor() {
    // Connect to local blockchain
    this.web3 = new Web3(LOCAL_RPC_URL);
    this.contract = new this.web3.eth.Contract(CONTRACT_ABI as AbiItem[], CONTRACT_ADDRESS);
    console.log('BlockchainService initialized with local blockchain');
  }

  private async hashData(data: any): Promise<string> {
    const dataString = JSON.stringify(data);
    return this.web3.utils.sha3(dataString) || '';
  }

  private generateBlockData(loginData: any) {
    const blockNumber = this.loginLogs.length + 1;
    const timestamp = new Date().toISOString();
    const previousHash = this.loginLogs.length > 0 
      ? this.loginLogs[this.loginLogs.length - 1].hash 
      : '0x0000000000000000000000000000000000000000000000000000000000000000';
    
    return {
      blockNumber,
      timestamp,
      previousHash,
      data: loginData
    };
  }

  async logLogin(loginData: {
    userId: string;
    email: string;
    timestamp: string;
    ipAddress: string;
    deviceInfo: string;
    userType: 'user' | 'admin';
  }) {
    try {
      console.log('Starting login logging process...');
      
      // Generate block data
      const blockData = this.generateBlockData(loginData);
      console.log('Generated block data:', blockData);
      
      // Hash the block data
      const blockHash = await this.hashData(blockData);
      console.log('Block hash:', blockHash);
      
      // Create the block
      const block = {
        ...blockData,
        hash: blockHash
      };
      
      // Store in blockchain (simulated in development)
      this.loginLogs.push(block);
      
      // Display blockchain information
      console.log('=== Blockchain Login Log ===');
      console.log('Block Number:', block.blockNumber);
      console.log('Timestamp:', block.timestamp);
      console.log('Previous Hash:', block.previousHash);
      console.log('Current Hash:', block.hash);
      console.log('Login Data:', block.data);
      console.log('=== End of Block ===');
      
      // Display entire blockchain
      console.log('=== Current Blockchain State ===');
      this.loginLogs.forEach((log, index) => {
        console.log(`Block ${index + 1}:`, {
          hash: log.hash,
          timestamp: log.timestamp,
          userId: log.data.userId,
          userType: log.data.userType
        });
      });
      console.log('=== End of Blockchain ===');
      
      return true;
    } catch (error: any) {
      console.error('Error in login logging:', error);
      return false;
    }
  }

  async getLoginHistory(userId: string) {
    try {
      console.log('Fetching login history for user:', userId);
      const userLogs = this.loginLogs.filter(log => log.data.userId === userId);
      console.log('User login history:', userLogs);
      return userLogs;
    } catch (error: any) {
      console.error('Error fetching login history:', error);
      return [];
    }
  }

  async logApplication(applicationData: {
    applicationId: string;
    schemeName: string;
    applicantName: string;
    applicantEmail: string;
    documents: File[];
    status: string;
  }) {
    try {
      console.log('Original application data:', applicationData);
      
      // Hash the application data
      const hashedData = await this.hashData(applicationData);
      console.log('Hashed application data:', hashedData);
      
      // In development mode, just log to console
      if (import.meta.env.DEV) {
        console.log('Development mode: Application data would be stored in blockchain');
        console.log('Blockchain transaction would include:');
        console.log('- Original data:', applicationData);
        console.log('- Hashed data:', hashedData);
        console.log('- Block number: (simulated)');
        console.log('- Transaction hash: (simulated)');
        return true;
      }

      // Production blockchain logging would go here
      return true;
    } catch (error: any) {
      console.error('Error in application logging:', error);
      return false;
    }
  }

  async getApplication(applicationId: string) {
    try {
      console.log('Fetching application from blockchain:', applicationId);
      const application = await this.contract.methods.getApplication(applicationId).call();
      console.log('Application retrieved:', application);
      return application;
    } catch (error: any) {
      console.error('Error fetching application from blockchain:', {
        error: error.message,
        applicationId
      });
      return null;
    }
  }
}

export const blockchainService = new BlockchainService(); 