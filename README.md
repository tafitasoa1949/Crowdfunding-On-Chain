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

## Smart contract prévu

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
