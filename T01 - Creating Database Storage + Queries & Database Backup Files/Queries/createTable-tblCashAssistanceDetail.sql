CREATE TABLE tblCashAssistanceDetail (
    CashAssistanceDetailId int PRIMARY KEY NOT NULL,
    AssignNeedyPlanId int UNIQUE,
    PlanId int NOT NULL UNIQUE,
    NeededPrice MONEY NOT NULL,
    MinPrice MONEY,
    Description TEXT,
    CONSTRAINT FK_CashAssistanceNeedyPlan FOREIGN KEY (AssignNeedyPlanId) REFERENCES [SabkadV01].[dbo].[tblAssignNeedyToPlans](AssignNeedyPlanId),
    CONSTRAINT FK_CashAssistancePlan FOREIGN KEY (PlanId) REFERENCES [SabkadV01].[dbo].[tblPlans](PlanId),
);