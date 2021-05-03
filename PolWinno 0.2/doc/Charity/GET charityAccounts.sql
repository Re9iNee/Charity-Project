SELECT TOP (1000) [CharityAccountId]
      ,[BankID]
      ,[BranchName]
      ,[OwnerName]
      ,[CardNumber]
      ,[AccountNumber]
      ,[AccountName]
      ,[BaseTypeCode]
      ,[BaseTypeTitle]
      ,[BaseCode]
      ,[BaseValue]
      ,[CommonBaseDataId]
  FROM [SabkadV01].[dbo].[tblCharityAccounts] as charityAcc 
  INNER JOIN [SabkadV01].[dbo].[tblCommonBaseData] as cmData
        on charityAcc.BankID = cmData.CommonBaseDataId
    INNER JOIN [SabkadV01].[dbo].[tblCommonBaseType] as cmType
    on cmData.CommonBaseTypeId = cmType.CommonBaseTypeId
    WHERE BaseTypeCode = '1';