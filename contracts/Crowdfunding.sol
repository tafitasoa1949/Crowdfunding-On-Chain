// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Crowdfunding
 * @dev Première version d'un smart contract de financement participatif on-chain.
 *
 * Ce contrat permet aux utilisateurs de contribuer en ETH à une campagne.
 * La campagne possède un propriétaire, un objectif de collecte et une date limite.
 */
contract Crowdfunding {
    address public owner;
    uint256 public goal;
    uint256 public deadline;
    uint256 public totalRaised;

    mapping(address => uint256) public contributions;

    event ContributionReceived(
        address indexed contributor,
        uint256 amount,
        uint256 totalRaised
    );

    /**
     * @dev Limite l'accès uniquement au propriétaire de la campagne.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Seul le proprietaire peut appeler cette fonction");
        _;
    }

    /**
     * @dev Initialise la campagne de financement participatif.
     * @param _goal Objectif de collecte en wei.
     * @param _durationInMinutes Duree de la campagne en minutes.
     */
    constructor(uint256 _goal, uint256 _durationInMinutes) {
        require(_goal > 0, "L'objectif doit etre superieur a zero");
        require(_durationInMinutes > 0, "La duree doit etre superieure a zero");

        owner = msg.sender;
        goal = _goal;
        deadline = block.timestamp + (_durationInMinutes * 1 minutes);
        totalRaised = 0;
    }

    /**
     * @dev Permet aux utilisateurs de contribuer en ETH avant la date limite.
     */
    function contribute() external payable {
        require(block.timestamp < deadline, "La campagne est deja terminee");
        require(msg.value > 0, "La contribution doit etre superieure a zero");

        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;

        emit ContributionReceived(msg.sender, msg.value, totalRaised);
    }

    /**
     * @dev Retourne le montant contribue par une adresse specifique.
     * @param _contributor Adresse du contributeur a verifier.
     */
    function getContribution(address _contributor) external view returns (uint256) {
        return contributions[_contributor];
    }

    /**
     * @dev Retourne les informations principales de la campagne.
     */
    function getCampaignInfo()
        external
        view
        returns (
            address campaignOwner,
            uint256 campaignGoal,
            uint256 campaignDeadline,
            uint256 campaignTotalRaised,
            bool campaignFinished,
            bool goalReached
        )
    {
        return (
            owner,
            goal,
            deadline,
            totalRaised,
            block.timestamp >= deadline,
            totalRaised >= goal
        );
    }
}