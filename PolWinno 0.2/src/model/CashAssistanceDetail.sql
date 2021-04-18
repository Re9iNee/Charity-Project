CREATE TABLE tblCashAssistanceDetail (
    CashAssistanceDetailId int IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    AssignNeedyPlanId int,
    PlanId int NOT NULL,
    NeededPrice MONEY NOT NULL,
    MinPrice MONEY,
    Description TEXT,
    CONSTRAINT FK_CashAssistanceNeedyPlan FOREIGN KEY (AssignNeedyPlanId) REFERENCES [SabkadV01].[dbo].[tblAssignNeedyToPlans](AssignNeedyPlanId),
    CONSTRAINT FK_CashAssistancePlan FOREIGN KEY (PlanId) REFERENCES [SabkadV01].[dbo].[tblPlans](PlanId),
    UNIQUE (AssignNeedyPlanId, PlanId)
);