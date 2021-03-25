CREATE TABLE tblNeedyAccounts (
    NeedyAccountId int IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    BankId int NOT NULL,
    NeedyId int NOT NULL UNIQUE,
    OwnerName NVARCHAR(1000) NOT NULL,
    CardNumber NVARCHAR(20),
    AccountNumber NVARCHAR(10) NOT NULL UNIQUE,
    AccountName NVARCHAR(500),
    ShebaNumber VARCHAR(26) NOT NULL UNIQUE,
    CONSTRAINT FK_NeedyAccounts FOREIGN KEY (NeedyId) REFERENCES [SabkadV01].[dbo].[tblPersonal](PersonId),
    CONSTRAINT FK_NeedyAccountsBank FOREIGN KEY (BankId) REFERENCES [SabkadV01].[dbo].[tblCommonBaseData](CommonBaseDataId),
);