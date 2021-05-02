  SELECT TOP (1000) [AssignNeedyPlanId]
      ,[NeedyId]
      ,assNeedy.[PlanId]
      ,assNeedy.[Fdate]
      ,assNeedy.[Tdate]
      ,[PersonId]
      ,[Name]
      ,[Family]
      ,[NationalCode]
      ,[IdNumber]
      ,[Sex]
      ,[BirthDate]
      ,[BirthPlace]
      ,[PersonType]
      ,[SecretCode]
      ,[PlanName]
      ,[Description]
      ,[PlanNature]
      ,[ParentPlanId]
      ,plans.[Fdate] as 'Plans Fdate'
      ,plans.[Tdate] as 'Plans Tdate'
      ,[neededLogin]
  FROM [SabkadV01].[dbo].[tblAssignNeedyToPlans] as assNeedy INNER JOIN
  [SabkadV01].[dbo].[tblPersonal] as personal 
  on assNeedy.NeedyId = personal.PersonId
  INNER JOIN [SabkadV01].[dbo].[tblPlans] as plans 
  on assNeedy.PlanId = plans.PlanId