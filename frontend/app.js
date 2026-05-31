const SEPOLIA_CHAIN_ID = "0xaa36a7";

const CONTRACTS = {
  success: {
    label: "Scénario 1 : campagne réussie",
    address: "0x3F0AEa9d6069Fa721Ed0446814cc3d88c21F5d7F",
  },
  failed: {
    label: "Scénario 2 : campagne échouée",
    address: "0x3E964a626Ef36D92537db7Dd9bC6b4891D6267cA",
  },
  frontend: {
    label: "Contrat utilisé par le frontend",
    address: "0xd4Dba1a3708C2DB98524373BE2a17151A759eE25",
  },
};

const CONTRACT_ADDRESS = CONTRACTS.frontend.address;

const CONTRACT_ABI = [
  "function owner() view returns (address)",
  "function goal() view returns (uint256)",
  "function deadline() view returns (uint256)",
  "function totalRaised() view returns (uint256)",
  "function fundsWithdrawn() view returns (bool)",
  "function getContribution(address _contributor) view returns (uint256)",
  "function getTimeLeft() view returns (uint256)",
  "function isCampaignSuccessful() view returns (bool)",
  "function isCampaignFailed() view returns (bool)",
  "function getCampaignInfo() view returns (address campaignOwner, uint256 campaignGoal, uint256 campaignDeadline, uint256 campaignTotalRaised, bool campaignFinished, bool goalReached, bool campaignFundsWithdrawn, uint256 contractBalance)",
  "function contribute() payable",
  "function withdrawFunds()",
  "function refund()",
];

let provider;
let signer;
let contract;
let currentAccount;

const connectWalletBtn = document.getElementById("connectWalletBtn");
const refreshBtn = document.getElementById("refreshBtn");

const walletAddress = document.getElementById("walletAddress");
const networkStatus = document.getElementById("networkStatus");

const campaignOwner = document.getElementById("campaignOwner");
const campaignGoal = document.getElementById("campaignGoal");
const totalRaised = document.getElementById("totalRaised");
const contractBalance = document.getElementById("contractBalance");
const campaignDeadline = document.getElementById("campaignDeadline");
const campaignStatus = document.getElementById("campaignStatus");

const messageBox = document.getElementById("messageBox");

const contributionAmount = document.getElementById("contributionAmount");
const contributeBtn = document.getElementById("contributeBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
const refundBtn = document.getElementById("refundBtn");

function showMessage(message, type = "info") {
  messageBox.textContent = message;

  messageBox.classList.remove(
    "message-success",
    "message-error",
    "message-info"
  );

  if (type === "success") {
    messageBox.classList.add("message-success");
  } else if (type === "error") {
    messageBox.classList.add("message-error");
  } else {
    messageBox.classList.add("message-info");
  }
}

function getErrorMessage(error) {
  if (error.reason) {
    return error.reason;
  }

  if (error.revert.args && error.revert.args.length > 0) {
    return error.revert.args[0];
  }

  if (error.shortMessage) {
    return error.shortMessage;
  }

  if (error.info.error.message) {
    return error.info.error.message;
  }

  if (error.message) {
    const match = error.message.match(/reverted with reason string '(.+?)'/);
    if (match && match[1]) {
      return match[1];
    }

    return error.message;
  }

  return "Erreur inconnue.";
}

function shortenAddress(address) {
  if (!address) return "-";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatEth(value) {
  return `${ethers.formatEther(value)} SepoliaETH`;
}

function formatDate(timestamp) {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString("fr-FR");
}

async function checkMetaMask() {
  if (!window.ethereum) {
    showMessage(
      "MetaMask n'est pas installé. Installe MetaMask pour utiliser la DApp.",
      "error"
    );
    return false;
  }

  return true;
}

async function checkNetwork() {
  const chainId = await window.ethereum.request({ method: "eth_chainId" });

  if (chainId !== SEPOLIA_CHAIN_ID) {
    networkStatus.textContent =
      "Mauvais réseau. Veuillez sélectionner Sepolia dans MetaMask.";
    showMessage("Veuillez changer le réseau MetaMask vers Sepolia.", "error");
    return false;
  }

  networkStatus.textContent = "Réseau Sepolia détecté";
  return true;
}

async function connectWallet() {
  try {
    const hasMetaMask = await checkMetaMask();
    if (!hasMetaMask) return;

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    currentAccount = accounts[0];

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    walletAddress.textContent = currentAccount;
    connectWalletBtn.textContent = "Wallet connecté";

    const isSepolia = await checkNetwork();
    if (!isSepolia) return;

    showMessage("Wallet connecté avec succès.", "success");

    await loadCampaignInfo();
  } catch (error) {
    console.error(error);
    showMessage("Erreur pendant la connexion du wallet.", "error");
  }
}

async function loadCampaignInfo() {
  try {
    if (!contract) {
      showMessage("Connecte d'abord MetaMask.", "error");
      return;
    }

    const info = await contract.getCampaignInfo();

    const owner = info[0];
    const goal = info[1];
    const deadline = info[2];
    const raised = info[3];
    const finished = info[4];
    const reached = info[5];
    const withdrawn = info[6];
    const balance = info[7];

    campaignOwner.textContent = shortenAddress(owner);
    campaignGoal.textContent = formatEth(goal);
    totalRaised.textContent = formatEth(raised);
    contractBalance.textContent = formatEth(balance);
    campaignDeadline.textContent = formatDate(deadline);

    if (!finished) {
      campaignStatus.textContent = "En cours";
    } else if (reached && withdrawn) {
      campaignStatus.textContent = "Réussie — fonds retirés";
    } else if (reached) {
      campaignStatus.textContent = "Réussie — retrait possible";
    } else {
      campaignStatus.textContent = "Échouée — remboursement possible";
    }

    showMessage("Informations de la campagne chargées.", "success");
  } catch (error) {
    console.error(error);
    showMessage("Impossible de charger les informations du contrat.", "error");
  }
}

async function contribute() {
  try {
    if (!contract) {
      showMessage("Connecte d'abord MetaMask.", "error");
      return;
    }

    const amount = contributionAmount.value;

    if (!amount || Number(amount) <= 0) {
      showMessage("Entre un montant valide en SepoliaETH.", "error");
      return;
    }

    showMessage("Transaction de contribution en cours...", "info");

    const tx = await contract.contribute({
      value: ethers.parseEther(amount),
    });

    showMessage("Transaction envoyee. Attente de confirmation...", "info");

    await tx.wait();

    showMessage("Contribution confirmee avec succes.", "success");
    contributionAmount.value = "";

    await loadCampaignInfo();
  } catch (error) {
    console.error(error);
    showMessage(
      `Erreur pendant la contribution : ${getErrorMessage(error)}`,
      "error"
    );
  }
}

async function withdrawFunds() {
  try {
    if (!contract) {
      showMessage("Connecte d'abord MetaMask.", "error");
      return;
    }

    showMessage("Transaction de retrait en cours...", "info");

    const tx = await contract.withdrawFunds();

    showMessage("Transaction envoyee. Attente de confirmation...", "info");

    await tx.wait();

    showMessage("Retrait des fonds confirme avec succes.", "success");

    await loadCampaignInfo();
  } catch (error) {
    console.error(error);
    showMessage(
      `Erreur pendant le remboursement : ${getErrorMessage(error)}`,
      "error"
    );
  }
}

async function refund() {
  try {
    if (!contract) {
      showMessage("Connecte d'abord MetaMask.", "error");
      return;
    }

    showMessage("Transaction de remboursement en cours...", "info");

    const tx = await contract.refund();

    showMessage("Transaction envoyee. Attente de confirmation...", "info");

    await tx.wait();

    showMessage("Remboursement confirme avec succes.", "success");

    await loadCampaignInfo();
  } catch (error) {
    console.error(error);
    showMessage(
      `Erreur pendant le remboursement : ${getErrorMessage(error)}`,
      "error"
    );
    //    showMessage(
    //        "Erreur pendant le remboursement. La campagne doit etre terminee et l'objectif non atteint.",
    //        "error"
    //    );
  }
}

if (connectWalletBtn) {
  connectWalletBtn.addEventListener("click", connectWallet);
}

if (refreshBtn) {
  refreshBtn.addEventListener("click", loadCampaignInfo);
}

if (window.ethereum) {
  window.ethereum.on("accountsChanged", () => {
    window.location.reload();
  });

  window.ethereum.on("chainChanged", () => {
    window.location.reload();
  });
}

if (contributeBtn) {
  contributeBtn.addEventListener("click", contribute);
}

if (withdrawBtn) {
  withdrawBtn.addEventListener("click", withdrawFunds);
}

if (refundBtn) {
  refundBtn.addEventListener("click", refund);
}
