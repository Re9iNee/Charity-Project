INSERT INTO [SabkadV01].[dbo].[tblPlans] (PlanName, Description, PlanNature, ParentPlanId, Fdate, Tdate, neededLogin, Icon) 
    VALUES ('Arman', 'Its just his birthday', '1', '1', '2020-03-02', '2021-03-02', '0', CONVERT(varbinary, '123456'));
    SELECT SCOPE_IDENTITY() AS charityAccountId;