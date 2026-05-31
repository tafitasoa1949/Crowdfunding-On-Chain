// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Crowdfunding
 * @dev Smart contract de financement participatif on-chain.
 *
 * Ce contrat permet aux utilisateurs de contribuer en ETH a une campagne.
 * La campagne possede un proprietaire, un objectif de collecte et une date limite.
 */
contract Crowdfunding {
    address public owner;
    uint256 public goal;
    uint256 public deadline;
    uint256 public totalRaised;
    bool public fundsWithdrawn;

    mapping(address => uint256) public contributions;

    event ContributionReceived(
        address indexed contributor,
        uint256 amount,
        uint256 totalRaised
    );

    event FundsWithdrawn(
        address indexed owner,
        uint256 amount
    );

    /**
     * @dev Limite l'acces uniquement au proprietaire de la campagne.
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
        fundsWithdrawn = false;
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
     * @dev Permet au proprietaire de retirer les fonds si la campagne a reussi.
     */
    function withdrawFunds() external onlyOwner {
        require(block.timestamp >= deadline, "La campagne n'est pas encore terminee");
        require(totalRaised >= goal, "L'objectif de collecte n'est pas atteint");
        require(!fundsWithdrawn, "Les fonds ont deja ete retires");

        fundsWithdrawn = true;

        uint256 amount = address(this).balance;

        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Le retrait des fonds a echoue");

        emit FundsWithdrawn(owner, amount);
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
            bool goalReached,
            bool campaignFundsWithdrawn,
            uint256 contractBalance
        )
    {
        return (
            owner,
            goal,
            deadline,
            totalRaised,
            block.timestamp >= deadline,
            totalRaised >= goal,
            fundsWithdrawn,
            address(this).balance
        );
    }
}