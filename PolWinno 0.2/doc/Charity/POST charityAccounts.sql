INSERT INTO 
    [SabkadV01].[dbo].[tblCharityAccounts]
    (BankId, BranchName, OwnerName, CardNumber, AccountNumber, AccountName)
    VALUES 
    ('7', 'AhmadAbad', 'Ali', '5022291045970124', '6', 'Nam-e-Hesab'); 
    SELECT SCOPE_IDENTITY() AS charityAccountId;