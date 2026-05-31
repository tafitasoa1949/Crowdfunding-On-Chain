# Crowdfunding On-Chain

Mini-projet Blockchain : application de financement participatif décentralisé sur Ethereum Sepolia.

## Description

Ce projet permet à des utilisateurs de contribuer à une campagne de financement en SepoliaETH via MetaMask.

Si l'objectif de collecte est atteint avant la deadline, le propriétaire de la campagne peut retirer les fonds.

Si l'objectif n'est pas atteint après la deadline, les contributeurs peuvent récupérer leur contribution.

## Règles fonctionnelles

La campagne possède un propriétaire appelé `owner`.

Le propriétaire définit :

- un objectif de collecte en ETH ;
- une durée limite pour la campagne.

Les utilisateurs peuvent contribuer en envoyant du SepoliaETH au smart contract.

Chaque contribution est enregistrée dans le contrat.

Le montant total collecté est mis à jour après chaque contribution.

Le propriétaire peut retirer les fonds uniquement si :

- la deadline est dépassée ;
- l'objectif de collecte est atteint ;
- les fonds n'ont pas déjà été retirés.

Les contributeurs peuvent demander un remboursement uniquement si :

- la deadline est dépassée ;
- l'objectif de collecte n'est pas atteint ;
- ils ont déjà contribué ;
- ils n'ont pas encore été remboursés.

## Acteurs

### Owner

Le propriétaire de la campagne. Il déploie le contrat et peut retirer les fonds si la campagne réussit.

### Contributor

Un utilisateur qui connecte son wallet MetaMask et contribue à la campagne.

## Smart contract

Le contrat principal sera :

````txt
Crowdfunding.sol

## Technologies utilisées

- Solidity
- Remix IDE
- MetaMask
- Sepolia Testnet
- Etherscan
- HTML
- CSS
- JavaScript
- ethers.js

## Structure du projet

crowdfunding-on-chain/
├── contracts/
│   └── Crowdfunding.sol
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── README.md
````

## Déploiements Sepolia

Le smart contract `Crowdfunding.sol` a été déployé sur le réseau Sepolia pour démontrer deux scénarios.

### Scénario 1 : campagne réussie

- Network: Sepolia Testnet
- Contract address: `0x3F0AEa9d6069Fa721Ed0446814cc3d88c21F5d7F`
- Etherscan: `https://sepolia.etherscan.io/address/0x3F0AEa9d6069Fa721Ed0446814cc3d88c21F5d7F`
- Objectif: `1000000000000000 wei` soit `0.001 SepoliaETH`
- Durée: `1 minute`
- Fonction testée: `withdrawFunds()`

### Scénario 2 : campagne échouée

- Network: Sepolia Testnet
- Contract address: `0x3E964a626Ef36D92537db7Dd9bC6b4891D6267cA`
- Etherscan: `https://sepolia.etherscan.io/address/0x3E964a626Ef36D92537db7Dd9bC6b4891D6267cA`
- Objectif: `10000000000000000 wei` soit `0.01 SepoliaETH`
- Durée: `1 minute`
- Fonction testée: `refund()`

## Choix d’architecture

Le projet contient un seul smart contract : `Crowdfunding.sol`.

Pour la démonstration, deux instances du même contrat ont été déployées sur Sepolia :

- une instance pour démontrer le scénario de réussite ;
- une instance pour démontrer le scénario d’échec et de remboursement.

Dans cette version, chaque contrat déployé représente une seule campagne de crowdfunding. Pour créer une nouvelle campagne, il faut déployer une nouvelle instance du contrat avec un nouvel objectif et une nouvelle durée.

Ce choix rend le projet plus simple, plus lisible et adapté à une démonstration courte.
