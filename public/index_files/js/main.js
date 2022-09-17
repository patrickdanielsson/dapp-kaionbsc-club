const connect = document.querySelectorAll(".connect");

const claim = document.querySelectorAll(".claim");

const EvmChains = window.evmChains;
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
let web3Modal;
let provider;
let balance;
let userAddress;

const contractAddress = "0xA02d33F34a377f27441d9d32C8697608B9B90847";

function init() {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          56: "https://bsc-dataseed.binance.org/", //mainnet
        },
        network: "binance",
      },
    },
  };

  web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: false,
    providerOptions,
  });
}

async function onConnect() {
  try {
    provider = await web3Modal.connect();
  } catch (e) {
    console.log("Could not get a wallet connection", e);
    return;
  }
  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });
  await fetchAccountData();
  await claimBalance();
}

async function fetchAccountData() {

  const web3 = new Web3(provider);
  const chainId = await web3.eth.getChainId();
  console.log(chainId);
  const chainData = await EvmChains.getChain(chainId);
  console.log(chainData.name);
  if (chainId !== 56) return alert("Connect wallet to a Binance Smart Chain");
  const accounts = await web3.eth.getAccounts();
  selectedAccount = accounts[0];
  userAddress = selectedAccount;
  showAddress(selectedAccount);
  Balance(selectedAccount);
  console.log("selected-account", selectedAccount);
}

//show claimable balance
async function claimBalance(){
    const web3 = new Web3(provider);
    let Contract = web3.eth.Contract;
    let contract = new Contract(abi, contractAddress);
    let pendingTotal = 0;

    const getTokenId = await contract.methods.tokensOfOwner(userAddress).call();
    console.log(getTokenId);
    for (let x in getTokenId) {
      console.log(getTokenId)

      const getTokenIdBalance = await contract.methods.pendingForToken(getTokenId[x]).call();
      const etherPendingValueTotal = web3.utils.fromWei(getTokenIdBalance, 'ether');
      pendingTotal = Number(etherPendingValueTotal) + pendingTotal;

    }

    //const claimBal = await contract.methods.getredBalances(userAddress).call();
    const claimRBalance = pendingTotal.toFixed(6);
    document.getElementById("claimBalance").innerHTML = '<span class="cpink">'+claimRBalance+'</span><span class="cyellow"> BNB</span>';

    return claimRBalance;
}

const Balance = async (address) => {
  const web3 = new Web3(provider);
  const bal = await web3.eth.getBalance(address);
  balance = (bal / 10 ** 18).toFixed(3);
  let Address = showAddress(address);
  connect_bt.classList.add("connect_btn");
  connect_bt.innerHTML = `<span color="cpurple">${balance} BNB</span>`;
};

function showAddress(num) {
  const firstAddressPart = shortener(num, 0, 6);
  const lastAddressPart = shortener(num, 36, 42);
  return `${firstAddressPart}...${lastAddressPart}`;
}

const shortener = (_data, _start, _end) => {
  let result = "";
  for (let i = _start; i < _end; i++) result = [...result, _data[i]];

  return result.join("");
};

// Claim rewards
const Claim = async () => {
  const web3 = new Web3(provider);
  let Contract = web3.eth.Contract;
  let contract = new Contract(abi, contractAddress);
  let value = 0; //claim
  let currentClaimBalance = await claimBalance();

  if (currentClaimBalance > 0) {
    let sendTX = contract.methods.claimForTokens().send({
      from: userAddress,
    });
    if(await sendTX){
      Swal.fire({
        icon: 'success',
        title: 'Rewards Claimed',
        text: 'Come back later to get more.',
        footer: '<a href="https://t.me/doodleapes"><span class="cpink">ROYALTIES ANNOUNCEMENTS</span></a>'
      })
    }

  } else {
    window.alert("You do not have any rewards to claim.");
  }
};

window.addEventListener("load", () => {
  init();
  localStorage.clear()
  sessionStorage.clear()
});

connect.forEach(function(el,index){
el.addEventListener("click", function () {
  if (!balance) {
    onConnect();
  }
});
})

claim.forEach(function(el,index){
el.addEventListener("click", () => {
  if (balance) {
    Claim();
  } else {
    onConnect();
  }
});
})
