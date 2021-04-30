SELECT TOP (1000) [CashAssistanceDetailId]
      ,cashAssist.[AssignNeedyPlanId]
      ,cashAssist.[PlanId]
      ,[NeededPrice]
      ,[MinPrice]
      ,cashAssist.[Description]
      ,[NeedyId]
      ,assignNeedy.[Fdate]
      ,assignNeedy.[Tdate]
      ,[PersonId]
      ,[Name]
      ,[Family]
      ,[NationalCode]
      ,[SecretCode]
      ,[PlanName]
      ,plans.[Description]
      ,[PlanNature]
      ,[ParentPlanId]
  FROM [SabkadV01].[dbo].[tblCashAssistanceDetail] as cashAssist INNER JOIN
  [SabkadV01].[dbo].[tblAssignNeedyToPlans] as assignNeedy 
  on cashAssist.AssignNeedyPlanId = assignNeedy.AssignNeedyPlanId
  INNER JOIN [SabkadV01].[dbo].[tblPlans] as plans 
  on cashAssist.PlanId = plans.PlanId
  INNER JOIN [SabkadV01].[dbo].[tblPersonal] as personal
  on assignNeedy.NeedyId = personal.PersonId