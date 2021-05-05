INSERT INTO 
    [SabkadV01].[dbo].[tblCashAssistanceDetail] 
    ("PlanId", "AssignNeedyPlanId", "NeededPrice", "MinPrice", "Description")
    VALUES ('1', '5', '2000', '0', 'TOZIHAT');
    SELECT SCOPE_IDENTITY() AS cashAssistanceDetailId;