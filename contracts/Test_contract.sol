pragma solidity >=0.4.22 <0.9.0;

contract Test_contract 
{
  address public owner = msg.sender;
  string public data_stored ;


  function testFunction () public pure returns(string memory ){
      return "hello from first test";
  }


  function changeData ( string memory _dataToChange ) public returns(string memory)
  {
    data_stored = _dataToChange;
    return data_stored;
  }

  function getData () public view returns(string memory)
  {
    // return "data_stored";
    return data_stored;
  }


}
