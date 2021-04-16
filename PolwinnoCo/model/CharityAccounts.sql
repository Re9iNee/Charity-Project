CREATE TABLE tblCharityAccounts (
    CharityAccountId int IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    BankID int NOT NULL,
    BranchName NVARCHAR(500) NOT NULL,
    OwnerName NVARCHAR(1000) NOT NULL,
    CardNumber NVARCHAR(20),
    AccountNumber NVARCHAR(10) NOT NULL UNIQUE,
    AccountName NVARCHAR(500),
    CONSTRAINT FK_CharityAccount FOREIGN KEY (BankId) REFERENCES [SabkadV01].[dbo].[tblCommonBaseData](CommonBaseDataId)
)