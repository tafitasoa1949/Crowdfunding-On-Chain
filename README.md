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

```txt
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
```

## Déploiements Sepolia

Le smart contract `Crowdfunding.sol` a été déployé sur le réseau Sepolia pour démontrer deux scénarios.

### Scénario 1 : campagne réussie

Ce scénario montre une campagne dont l’objectif a été atteint.  
Après la deadline, le propriétaire peut appeler `withdrawFunds()` pour retirer les fonds.

- Network: Sepolia Testnet
- Contract address: `0x3F0AEa9d6069Fa721Ed0446814cc3d88c21F5d7F`
- Etherscan: `https://sepolia.etherscan.io/address/0x3F0AEa9d6069Fa721Ed0446814cc3d88c21F5d7F`
- Objectif: `1000000000000000 wei` soit `0.001 SepoliaETH`
- Durée: `1 minute`
- Fonction testée: `withdrawFunds()`

![Etherscan campagne réussie](./screenshots/Etherscan%20campagne%20réussie.png)

### Scénario 2 : campagne échouée

Ce scénario montre une campagne dont l’objectif n’a pas été atteint.  
Après la deadline, le contributeur peut appeler `refund()` pour récupérer sa contribution.

- Network: Sepolia Testnet
- Contract address: `0x3E964a626Ef36D92537db7Dd9bC6b4891D6267cA`
- Etherscan: `https://sepolia.etherscan.io/address/0x3E964a626Ef36D92537db7Dd9bC6b4891D6267cA`
- Objectif: `10000000000000000 wei` soit `0.01 SepoliaETH`
- Durée: `1 minute`
- Fonction testée: `refund()`

![Etherscan campagne échouée](./screenshots/Etherscan%20campagne%20échouée.png)

## Choix d’architecture

Le projet contient un seul smart contract : `Crowdfunding.sol`.

Pour la démonstration, deux instances du même contrat ont été déployées sur Sepolia :

- une instance pour démontrer le scénario de réussite ;
- une instance pour démontrer le scénario d’échec et de remboursement.

Dans cette version, chaque contrat déployé représente une seule campagne de crowdfunding. Pour créer une nouvelle campagne, il faut déployer une nouvelle instance du contrat avec un nouvel objectif et une nouvelle durée.

Ce choix rend le projet plus simple, plus lisible et adapté à une démonstration courte.

## Interface frontend

Le projet contient une interface web simple permettant d’interagir avec le smart contract `Crowdfunding.sol`.

L’interface permet de :

- connecter MetaMask ;
- vérifier que le réseau utilisé est Sepolia ;
- afficher l’adresse du wallet connecté ;
- afficher les informations de la campagne ;
- contribuer en SepoliaETH ;
- retirer les fonds si la campagne est réussie ;
- demander un remboursement si la campagne a échoué ;
- afficher les messages d’erreur retournés par le smart contract.

## Lancer le frontend

Ouvrir le projet dans VS Code, puis lancer le fichier :

```txt
frontend/index.html
```

avec l’extension **Live Server**.

L’URL locale utilisée pendant les tests est :

```txt
http://127.0.0.1:5500/frontend/index.html
```

## Contrat utilisé par le frontend

- Network: Sepolia Testnet
- Contract address: `0xd4Dba1a3708C2DB98524373BE2a17151A759eE25`
- Etherscan: `https://sepolia.etherscan.io/address/0xd4Dba1a3708C2DB98524373BE2a17151A759eE25`

Ce contrat est utilisé pour tester les interactions depuis l’interface web.

## Tests réalisés depuis le frontend

### Connexion MetaMask

L’utilisateur clique sur le bouton `Connecter MetaMask`.

Résultat obtenu :

- MetaMask s’ouvre ;
- le wallet est connecté ;
- l’adresse du compte est affichée ;
- le réseau Sepolia est détecté.

### Lecture des informations de campagne

Le frontend lit les informations depuis le smart contract avec `getCampaignInfo()`.

Informations affichées :

- propriétaire ;
- objectif ;
- montant collecté ;
- solde du contrat ;
- deadline ;
- état de la campagne.

### Contribution

L’utilisateur saisit un montant en SepoliaETH, puis clique sur `Contribuer`.

Résultat obtenu :

- MetaMask demande une confirmation ;
- la transaction est envoyée sur Sepolia ;
- après confirmation, le montant collecté est mis à jour dans l’interface.

### Retrait des fonds

Le bouton `Retirer les fonds` appelle la fonction `withdrawFunds()`.

Cette action réussit uniquement si :

- l’utilisateur est le propriétaire du contrat ;
- la campagne est terminée ;
- l’objectif est atteint ;
- les fonds n’ont pas déjà été retirés.

### Remboursement

Le bouton `Demander remboursement` appelle la fonction `refund()`.

Cette action réussit uniquement si :

- la campagne est terminée ;
- l’objectif n’est pas atteint ;
- l’utilisateur a déjà contribué.

### Gestion des erreurs

Le frontend récupère les messages d’erreur retournés par le smart contract.

Exemple de message affiché :

```txt
L'objectif de collecte n'est pas atteint
```

## Fonctionnalités réalisées

- Smart contract Solidity de crowdfunding
- Déploiement sur Sepolia Testnet
- Contribution en SepoliaETH
- Retrait des fonds par le propriétaire si l’objectif est atteint
- Remboursement des contributeurs si l’objectif n’est pas atteint
- Connexion MetaMask depuis le frontend
- Lecture des informations de campagne depuis le smart contract
- Exécution des transactions depuis l’interface web
- Affichage des erreurs retournées par le smart contract
- Vérification des transactions sur Etherscan

## Capture de l’interface

![Interface frontend](./screenshots/Frontend%20interface.png)
