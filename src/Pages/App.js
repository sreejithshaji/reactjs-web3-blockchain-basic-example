import logo from '../logo.svg';
import '../App.css';

// import SimpleStorage from '...'

import Web3 from 'web3'
import { useEffect , useState  } from 'react';

import Test_contract from '../abi/Test_contract.json';

var Contract = require('web3-eth-contract');

function App() {

  const [address , setAddress ] = useState();
  const [isConnectedToWallet , setIsConnectedToWallet ] = useState(false);

  const [inputData , setInputData ] = useState("");

  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");


  
  async function LoadBlockChain()
  {
    
    // connects to the local evelopment environment



    const ConnectToMetaMask = async () => {
      
      // This function is used to check if metamask is connected or not 

      if (window.ethereum) 
      {
        // the function enters here if metamask is installed
        console.log("metamask is present ")
        await window.ethereum.send('eth_requestAccounts');
        window.web3 = new Web3(window.ethereum);

        // console.log(window.web3);
        const acc = await web3.eth.getAccounts();

        console.log(acc)
        // The address is then stored 
        setAddress(acc)

        // In this case, the await window.ethereum.send('eth_requestAccounts') function calls the pop-up UI dialogue that asks the user’s permission to connect the dApp to MetaMask.

        setIsConnectedToWallet(true);
        // if we connect to the wallet successfully we set isConnectedToWallet to true


        // This function returns true if metamask is installed
        return true;
      }
      else{
        // the function enters here if metamask is not installed
        console.log("metamask is not installed")
      }

      // This function returns false if metamask is not installed

      return false;
    }

   await  ConnectToMetaMask()

  }






  const getBalance = async () => {
    
    if(!isConnectedToWallet)
    {
      // If wallet is not connected we enter here 
      console.log("Please connect to wallet ");
      return;
    }

    console.log("address : " , address);
    

    // prints the balance of the connected address
    const balanceFrom = web3.utils.fromWei(
       await web3.eth.getBalance( address[0] ),
       'ether'
    );

    console.log("balance is :" ,  balanceFrom )
    
  };

  const sendCoin = async () =>{
    // send coin from the current account to the account address given below 
    web3.eth.sendTransaction(
      {
        from: address[0],
        to:"0xD89d41606705904f55AAB8BE035E41A8986bd082",
        value: '100000000000000000'
        // value is the money to send in wei
      }, 
      function(err, transactionHash) 
      {
          if (!err)
            console.log(transactionHash + " success"); 
      }
    );
  };

  const ConnectSmartContract = async () =>{

    // This function is used to connect to the smart contract 
    if(!isConnectedToWallet)
    {
      // If wallet is not connected we enter here 
      console.log("Please connect to wallet ");
      return;
    }


    // These below lines are used to fetch the address of our smart contract
    // The address is present inside the test_contract.json 

    const networkId = await web3.eth.net.getId()
    console.log( "networkId :  " , networkId );
    const networkData = Test_contract.networks[networkId];
    console.log( "network Data :  " , networkData);

    if(networkData)
    {
      var smartContractAddress = networkData.address;
      console.log( "network address :  " , smartContractAddress);
      
      // the below line is used to connect to the Test_contract , 
      // ie , our smart contract
      const TestContract =  new web3.eth.Contract( Test_contract.abi , smartContractAddress );


      console.log(TestContract);

      return TestContract;
    }
    else{
      console.log("not found");
    }

  

  }

  const smartContract_testFunction = async () =>{
    // This function is used to call the functions in the smart contract 
    const TestContract = await ConnectSmartContract();
    // above line connect to the smart contract
    //  ConnectSmartContract() is a function we have written to connect with our smart contract 

    const dataBack = await TestContract.methods.testFunction().call();
    // This runs the TestContract and stores the return value to dataBack variable 
    console.log("dataBack : " , dataBack );

  }


  const smartContract_changeData = async ( _data_to_change ) =>{

    const TestContract = await ConnectSmartContract();
    // above line connect to the smart contract
    //  ConnectSmartContract() is a function we have written to connect with our smart contract 
    
    const dataBack = await TestContract.methods.changeData(_data_to_change).send({from: address[0] , gas:"22000" });

    // gas is the gas fee for the transaction


    // The above lines are used to write data to smart contract 
    // to send data to the smart contract we use .send() function
    // Data back will be the reply from the smart contract

    // This runs the TestContract and stores the return value to dataBack variable 
    console.log("dataBack : " , dataBack );

  }
  
  const smartContract_getData = async (  ) =>{
    // This function is used to call the functions in the smart contract 
    const TestContract = await ConnectSmartContract();
    // above line connect to the smart contract
    //  ConnectSmartContract() is a function we have written to connect with our smart contract 

    const dataBack = await TestContract.methods.getData().call();
    // above line is used to read a data from the smart contract 
    // To retreive data we use .call()  function
    
    // This runs the TestContract and stores the return value to dataBack variable 
    console.log("dataBack : " , dataBack );

  }


 

  function LogTest()
  {
    console.log(web3)
  }

  

  

  
  return (
    <div className="App">
      <div>Please connect To the wallet first</div>
      <div >
          <button onClick={ ()=>{LoadBlockChain()} } > Connect To Wallet</button>
      </div>


      <div  style={{ marginTop:10 }} >
          <button onClick={ ()=>{getBalance()} } >  get balance </button>
      </div>

      <div style={{ marginTop:10 }} >
          <button onClick={ ()=>{sendCoin()} } >Send money</button>
      </div>

    
      <div style={{ marginTop:10 }} >
          <button onClick={ ()=>{LogTest()} } >Log Test</button>
      </div>


      <hr  style={{
          marginTop:20,
          color: '#000000',
          backgroundColor: '#000000',
          height: .5,
          borderColor : '#000000'
      }}/>



      <div style={{marginTop:20}} >
        SMART CONTRACT TEST SECTION
      </div>

      <div >
          <button onClick={ ()=>{ConnectSmartContract()} } > Connect To snmart contract </button>
      </div>

      <div >
          <button onClick={ ()=>{smartContract_testFunction()} } > test function call </button>
      </div>

      


      <hr  style={{
          marginTop:20,
          color: '#000000',
          backgroundColor: '#000000',
          height: .5,
          borderColor : '#000000'
      }}/>

      <div style={{marginTop:30}} >
        SMART CONTRACT INPUT AND RETURN SECTION
      </div>

      <div style={{marginTop:10}}>
          <input onChange={event => setInputData(event.target.value) } />
          <button onClick={ ()=>{smartContract_changeData(inputData)} } > send to smart contract</button>

      </div>

      <div style={{marginTop:10}} >
          <button onClick={ ()=>{smartContract_getData()} } > retrieve from smart contract </button>
      </div>



      

    </div>

    

    


  );
}

export default App;
