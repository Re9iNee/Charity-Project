CREATE TABLE tblAssignNeedyToPlans (
    AssignNeedyPlanId int IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    NeedyId int NOT NULL UNIQUE,
    PlanId int NOT NULL UNIQUE,
    Fdate VARCHAR(10) NOT NULL,
    Tdate VARCHAR(10) NOT NULL,
    CONSTRAINT FK_AssignNeedy FOREIGN KEY (NeedyId) REFERENCES [SabkadV01].[dbo].[tblPersonal](PersonId),
    CONSTRAINT FK_AssignNeedyPlan FOREIGN KEY (PlanId) REFERENCES [SabkadV01].[dbo].[tblPlans](PlanId),
)